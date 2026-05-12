import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100">
      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            Free AI Spend Audit
          </div>

          {/* Hero */}
          <h1 className="text-5xl md:text-6xl font-bold text-zinc-900 tracking-tight leading-tight">
            Most Teams Overpay for AI Tools by 30%
          </h1>
          <p className="text-xl text-zinc-600 max-w-3xl mx-auto leading-relaxed">
            Our deterministic audit engine analyzes your SaaS tool stack to find unused seats,
            overlapping subscriptions, and overpriced plans. Get actionable recommendations in 60 seconds.
          </p>

          {/* CTA */}
          <div className="pt-4">
            <Link
              href="/audit"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg shadow-lg shadow-blue-600/20"
            >
              Run Free Audit
            </Link>
            <p className="mt-4 text-sm text-zinc-500">
              No email required • See your savings before sharing any contact info
            </p>
          </div>
        </div>

        {/* Trust Metrics */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-zinc-900">6</div>
            <div className="text-sm text-zinc-600">Audit Rules</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-zinc-900">8</div>
            <div className="text-sm text-zinc-600">AI Tools Covered</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-zinc-900">60s</div>
            <div className="text-sm text-zinc-600">Analysis Time</div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-24">
          <h2 className="text-2xl font-bold text-zinc-900 text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-zinc-900">1. Enter Your Stack</h3>
                <p className="text-sm text-zinc-600">
                  List the AI tools you use, team size, and monthly spend. No account required.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-zinc-900">2. Get Analysis</h3>
                <p className="text-sm text-zinc-600">
                  Our engine checks for unused seats, overlapping tools, and better pricing.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-zinc-900">3. See Savings</h3>
                <p className="text-sm text-zinc-600">
                  Get a detailed report with specific recommendations and estimated savings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What You'll Get */}
        <div className="mt-24">
          <h2 className="text-2xl font-bold text-zinc-900 text-center mb-12">What You&apos;ll Get</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
              <h3 className="text-lg font-semibold text-zinc-900 mb-3">Detailed Findings</h3>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Excess seat identification</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Overlapping tool detection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Overpriced plan recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Annual discount opportunities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Startup credit eligibility</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
              <h3 className="text-lg font-semibold text-zinc-900 mb-3">Actionable Evidence</h3>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Observed vs. expected values</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Severity-graded recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Per-tool savings estimates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>AI-generated summary</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Shareable report link</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tools Covered */}
        <div className="mt-24">
          <h2 className="text-2xl font-bold text-zinc-900 text-center mb-8">Tools We Analyze</h2>
          <p className="text-center text-zinc-600 mb-8">
            We check pricing for these AI tools against your current spend
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "ChatGPT", vendor: "OpenAI" },
              { name: "Claude", vendor: "Anthropic" },
              { name: "Cursor", vendor: "Anysphere" },
              { name: "GitHub Copilot", vendor: "GitHub" },
              { name: "Gemini", vendor: "Google" },
              { name: "Windsurf", vendor: "Codeium" },
              { name: "Anthropic API", vendor: "Anthropic" },
              { name: "OpenAI API", vendor: "OpenAI" },
            ].map((tool) => (
              <div key={tool.name} className="bg-white rounded-lg p-4 text-center border border-zinc-200">
                <div className="font-medium text-zinc-900 text-sm">{tool.name}</div>
                <div className="text-xs text-zinc-500 mt-1">{tool.vendor}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-zinc-500 mt-6">
            Pricing verified as of May 2026. See PRICING_DATA.md for verification notes.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-24 text-center text-sm text-zinc-500">
          <p>Built with Next.js 15, Supabase, and TypeScript.</p>
          <p className="mt-2">
            <a href="https://github.com/yashwanth93471/credex-ai-spend-audit" className="text-blue-600 hover:text-blue-700">
              View Source
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
