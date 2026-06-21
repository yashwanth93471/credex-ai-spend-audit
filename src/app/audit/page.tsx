"use client";

import { useState } from "react";
import { CATALOG } from "@/core/catalog";
import { LoadingSpinner } from "@/components/ui/loading";
import { ErrorState } from "@/components/ui/error-state";

type Subscription = {
  toolId: string;
  planId?: string;
  seats: number;
  monthlySpendUsd: number;
  billingCycle: "monthly" | "annual";
};

type FormData = {
  teamSize: number;
  primaryUseCase: string;
  subscriptions: Subscription[];
};

const useCaseOptions = [
  { value: "general-chat", label: "General Chat & Research" },
  { value: "coding", label: "Software Development" },
  { value: "research", label: "Market & Product Research" },
  { value: "writing", label: "Content & Copywriting" },
  { value: "data-analysis", label: "Data Analysis & Reports" },
];

export default function AuditFormPage() {
  const [teamSize, setTeamSize] = useState<number>(10);
  const [primaryUseCase, setPrimaryUseCase] = useState<string>("general-chat");
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    { toolId: "chatgpt", planId: "chatgpt-plus", seats: 5, monthlySpendUsd: 100, billingCycle: "monthly" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addSubscription = () => {
    setSubscriptions([
      ...subscriptions,
      { toolId: "claude", planId: "claude-pro", seats: 1, monthlySpendUsd: 20, billingCycle: "monthly" },
    ]);
  };

  const removeSubscription = (index: number) => {
    if (subscriptions.length <= 1) return;
    setSubscriptions(subscriptions.filter((_, i) => i !== index));
  };

  const updateSubscription = (index: number, field: keyof Subscription, value: unknown) => {
    const updated = [...subscriptions];
    updated[index] = { ...updated[index], [field]: value };
    setSubscriptions(updated);
  };

  const getTool = (toolId: string) => CATALOG.tools.find((t) => t.id === toolId);
  const getPlans = (toolId: string) => getTool(toolId)?.plans ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData: FormData = {
        teamSize,
        primaryUseCase,
        subscriptions: subscriptions.map((sub) => ({
          ...sub,
          seats: Number(sub.seats),
          monthlySpendUsd: Number(sub.monthlySpendUsd),
        })),
      };

      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to create audit");
      }

      const data = await response.json();

      if (data.persisted === false) {
        sessionStorage.setItem(
          "audit-fallback",
          JSON.stringify({
            result: data.result,
            summary: data.summary,
            summarySource: data.summarySource,
          })
        );
        window.location.href = "/audit/preview";
      } else {
        window.location.href = `/audit/${data.id}`;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = teamSize > 0 && teamSize <= 1000 && subscriptions.length > 0 && subscriptions.length <= 20 &&
    subscriptions.every((sub) => sub.seats > 0 && sub.seats <= 500 && sub.monthlySpendUsd >= 0);

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">AI Spend Audit</h1>
          <p className="text-zinc-600">Find savings in your AI tool stack in 60 seconds</p>
        </div>

        {error && (
          <ErrorState
            title="Failed to Create Audit"
            message={error}
            onRetry={() => setError(null)}
          />
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6 space-y-6">
          {/* Team Size */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Team Size <span className="text-zinc-400 font-normal">(1-1000 people)</span>
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
          </div>

          {/* Primary Use Case */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Primary Use Case
            </label>
            <select
              value={primaryUseCase}
              onChange={(e) => setPrimaryUseCase(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {useCaseOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Subscriptions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-zinc-700">
                AI Tools & Subscriptions
              </label>
              <button
                type="button"
                onClick={addSubscription}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + Add Tool
              </button>
            </div>

            <div className="space-y-4">
              {subscriptions.map((sub, index) => {
                const tool = getTool(sub.toolId);
                const plans = getPlans(sub.toolId);

                return (
                  <div key={index} className="border border-zinc-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        {/* Tool Selection */}
                        <div>
                          <label className="block text-xs font-medium text-zinc-500 mb-1">Tool</label>
                          <select
                            value={sub.toolId}
                            onChange={(e) => updateSubscription(index, "toolId", e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border border-zinc-300 rounded focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            {CATALOG.tools.map((t) => (
                              <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                          </select>
                        </div>

                        {/* Plan Selection */}
                        {tool && (
                          <div>
                            <label className="block text-xs font-medium text-zinc-500 mb-1">Plan</label>
                            <select
                              value={sub.planId ?? ""}
                              onChange={(e) => updateSubscription(index, "planId", e.target.value || undefined)}
                              className="w-full px-3 py-1.5 text-sm border border-zinc-300 rounded focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Custom/Enterprise</option>
                              {plans.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.name} ${p.pricePerSeatMonthlyUsd}/mo
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          {/* Seats */}
                          <div>
                            <label className="block text-xs font-medium text-zinc-500 mb-1">Seats</label>
                            <input
                              type="number"
                              min="1"
                              value={sub.seats}
                              onChange={(e) => updateSubscription(index, "seats", e.target.value)}
                              className="w-full px-3 py-1.5 text-sm border border-zinc-300 rounded focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>

                          {/* Monthly Spend */}
                          <div>
                            <label className="block text-xs font-medium text-zinc-500 mb-1">Monthly Spend ($)</label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={sub.monthlySpendUsd}
                              onChange={(e) => updateSubscription(index, "monthlySpendUsd", e.target.value)}
                              className="w-full px-3 py-1.5 text-sm border border-zinc-300 rounded focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                        </div>

                        {/* Billing Cycle */}
                        <div>
                          <label className="block text-xs font-medium text-zinc-500 mb-1">Billing</label>
                          <select
                            value={sub.billingCycle}
                            onChange={(e) => updateSubscription(index, "billingCycle", e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border border-zinc-300 rounded focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="monthly">Monthly</option>
                            <option value="annual">Annual</option>
                          </select>
                        </div>
                      </div>

                      {subscriptions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSubscription(index)}
                          className="ml-2 text-zinc-400 hover:text-red-600"
                          aria-label="Remove subscription"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Analyzing your stack...</span>
              </>
            ) : (
              "Run Audit"
            )}
          </button>

          <p className="text-xs text-center text-zinc-500">
            Your data is processed locally. We don&apos;t store any information beyond this audit.
          </p>
        </form>
      </div>
    </div>
  );
}
