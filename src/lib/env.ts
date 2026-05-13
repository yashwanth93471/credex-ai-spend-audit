import { z } from "zod";

const serverSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  ANTHROPIC_API_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().startsWith("re_").optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

type ServerEnv = z.infer<typeof serverSchema>;
type ClientEnv = z.infer<typeof clientSchema>;

let serverEnvCache: ServerEnv | undefined;
let clientEnvCache: ClientEnv | undefined;

function formatIssues(error: z.ZodError): string {
  return error.issues.map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`).join("\n");
}

export function serverEnv(): ServerEnv {
  if (typeof window !== "undefined") {
    throw new Error("serverEnv() must not be called from client-side code");
  }
  if (serverEnvCache) return serverEnvCache;
  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Invalid server environment variables:\n${formatIssues(parsed.error)}`);
  }
  serverEnvCache = parsed.data;
  return serverEnvCache;
}

export function clientEnv(): ClientEnv {
  if (clientEnvCache) return clientEnvCache;
  const parsed = clientSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });
  if (!parsed.success) {
    throw new Error(`Invalid client environment variables:\n${formatIssues(parsed.error)}`);
  }
  clientEnvCache = parsed.data;
  return clientEnvCache;
}
