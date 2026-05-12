"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase";
import { sendAuditReportEmail } from "@/lib/email/resend";
import { clientEnv } from "@/lib/env";

const claimSchema = z.object({
  auditId: z.string().uuid(),
  email: z.string().email(),
  name: z.string().optional(),
  company: z.string().optional(),
  role: z.string().optional(),
});

export type ClaimAuditInput = z.infer<typeof claimSchema>;

export async function claimAudit(input: ClaimAuditInput) {
  const parsed = claimSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }

  const { auditId, email, name, company, role } = parsed.data;

  const supabase = createServerClient();

  try {
    // UPSERT lead (create if doesn't exist, update last_seen if does)
    const { data: leadData, error: leadError } = await supabase
      .from("leads")
      .upsert(
        {
          email,
          name: name || null,
          company: company || null,
          role: role || null,
          last_seen: new Date().toISOString(),
        },
        {
          onConflict: "email",
          ignoreDuplicates: false,
        }
      )
      .select("id")
      .single();

    if (leadError || !leadData) {
      console.error("Lead upsert error:", leadError);
      return { success: false, error: "Failed to save contact information" };
    }

    // Update audit with lead_id and claimed_at
    const { error: auditError } = await supabase
      .from("audits")
      .update({
        lead_id: leadData.id,
        claimed_at: new Date().toISOString(),
      })
      .eq("id", auditId);

    if (auditError) {
      console.error("Audit update error:", auditError);
      return { success: false, error: "Failed to claim audit" };
    }

    // Fetch audit details for email
    const { data: auditData } = await supabase
      .from("audits")
      .select("savings_usd, result")
      .eq("id", auditId)
      .single();

    if (auditData) {
      const { result, savings_usd } = auditData as {
        result: { findings: unknown[] };
        savings_usd: number;
      };

      // Send email (fails silently if not configured)
      const auditUrl = `${clientEnv().NEXT_PUBLIC_APP_URL}/audit/${auditId}`;
      await sendAuditReportEmail({
        to: email,
        auditId,
        savingsUsd: savings_usd,
        findingsCount: result.findings.length,
        auditUrl,
      });
    }

    // Revalidate the report page to show updated state
    revalidatePath(`/audit/${auditId}`);

    return { success: true };
  } catch (error) {
    console.error("Claim audit error:", error);
    return { success: false, error: "Something went wrong" };
  }
}
