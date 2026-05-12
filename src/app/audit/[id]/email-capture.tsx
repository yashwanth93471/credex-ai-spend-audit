"use client";

import { useState } from "react";
import { claimAudit } from "@/app/actions/claim-audit";

interface EmailCaptureProps {
  auditId: string;
  isClaimed: boolean;
}

export function EmailCapture({ auditId, isClaimed }: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const result = await claimAudit({
      auditId,
      email,
      name: name || undefined,
      company: company || undefined,
      role: role || undefined,
    });

    setIsSubmitting(false);

    if (result.success) {
      setMessage({ type: "success", text: "Audit saved to your account!" });
    } else {
      setMessage({ type: "error", text: result.error || "Something went wrong" });
    }
  };

  if (isClaimed) {
    return (
      <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="text-center">
          <p className="text-green-800 font-medium">✓ This audit is saved to your account</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold text-zinc-900">
          Save this audit to your account
        </h3>
        <p className="text-sm text-zinc-600 max-w-md mx-auto">
          Get a copy of this report emailed to you and track your AI spend over time.
        </p>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 max-w-md mx-auto">
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Company (optional)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Role (optional)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={isSubmitting || !email}
            className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Saving..." : "Save Audit"}
          </button>
        </form>

        <p className="text-xs text-zinc-500">
          We&apos;ll email you a copy of this report. No spam, ever.
        </p>
      </div>
    </div>
  );
}
