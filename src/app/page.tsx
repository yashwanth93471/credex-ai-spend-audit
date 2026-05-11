import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold text-zinc-900 tracking-tight">
            Stop Overpaying for AI Tools
          </h1>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
            Most teams waste 30% of their AI SaaS spend on unused seats, overlapping tools,
            and overpriced plans. Find your savings in 60 seconds.
          </p>
          <div className="pt-6">
            <Link
              href="/audit"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg"
            >
              Start Free Audit
            </Link>
            <p className="mt-4 text-sm text-zinc-500">
              No signup required • See your savings before sharing any contact info
            </p>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">Enter Your Stack</h3>
            <p className="text-zinc-600 text-sm">
              List the AI tools you use, your team size, and what you&apos;re spending.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">Get Instant Insights</h3>
            <p className="text-zinc-600 text-sm">
              Our audit engine identifies unused seats, overlapping tools, and better plans.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">See Your Savings</h3>
            <p className="text-zinc-600 text-sm">
              Get a detailed report with actionable recommendations and estimated savings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
