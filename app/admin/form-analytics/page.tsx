"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

export default function FormAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dateRange.start) params.append("startDate", dateRange.start);
      if (dateRange.end) params.append("endDate", dateRange.end);

      const response = await fetch(`/api/analytics/form-stats?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-xl">Loading analytics...</div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-xl">No analytics data available</div>
        </div>
      </div>
    );
  }

  const COLORS = ["#3B9FE5", "#2B7AC5", "#60A5FA", "#93C5FD", "#BFDBFE", "#DBEAFE", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Form Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Detailed insights into user behavior and form performance</p>
        </div>
        <div className="flex gap-4">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="p-6">
          <div className="text-sm text-gray-600 font-medium">Total Sessions</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{analytics.overview.totalSessions}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-gray-600 font-medium">Completed</div>
          <div className="text-3xl font-bold text-green-600 mt-2">{analytics.overview.completed}</div>
          <div className="text-xs text-gray-500 mt-1">{analytics.overview.completionRate}% conversion</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-gray-600 font-medium">Abandoned</div>
          <div className="text-3xl font-bold text-red-600 mt-2">{analytics.overview.abandoned}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-gray-600 font-medium">Completion Rate</div>
          <div className="text-3xl font-bold text-primary mt-2">{analytics.overview.completionRate}%</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-gray-600 font-medium">Avg Time</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">
            {Math.floor(analytics.overview.averageCompletionTime / 60)}m {analytics.overview.averageCompletionTime % 60}s
          </div>
        </Card>
      </div>

      {/* Funnel Visualization */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Conversion Funnel</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={analytics.funnel} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="stepName" type="category" width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3B9FE5" name="Users Reached" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Question-by-Question Analytics */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Question Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {analytics.questionAnalytics.map((question: any) => (
            <Card key={question.step} className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">{question.stepName}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span>{question.totalResponses} responses</span>
                  <span>•</span>
                  <span>Avg time: {question.averageTime}s</span>
                  {question.skipRate > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-orange-600">{question.skipRate}% skipped</span>
                    </>
                  )}
                </div>
              </div>

              {/* Answer Distribution */}
              {question.answers && question.answers.length > 0 && (
                <div>
                  {/* Check if answers are numeric (slider values) */}
                  {isNumericAnswer(question.answers) ? (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700 mb-3">Value Distribution:</div>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={prepareNumericData(question.answers)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="range" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#3B9FE5" />
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="mt-2 text-xs text-gray-500">
                        Most common: {getMostCommonNumeric(question.answers)}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-gray-700">Answer Distribution:</div>
                      {question.answers.map((answer: any, idx: number) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-900 truncate max-w-[200px]">
                              {truncateAnswer(answer.value)}
                            </span>
                            <span className="text-gray-600">
                              {answer.count} ({answer.percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${answer.percentage}%`,
                                backgroundColor: COLORS[idx % COLORS.length],
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Time Analysis */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Time Spent Per Step</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={analytics.timeAnalytics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="step" />
            <YAxis label={{ value: "Seconds", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="averageTime" stroke="#3B9FE5" name="Average Time" strokeWidth={2} />
            <Line type="monotone" dataKey="medianTime" stroke="#10B981" name="Median Time" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Drop-off Analysis */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Biggest Drop-off Points</h2>
        <div className="space-y-3">
          {analytics.dropOffPoints.slice(0, 5).map((dropOff: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-semibold text-gray-900">
                  {dropOff.fromStepName} → {dropOff.toStepName}
                </div>
                <div className="text-sm text-gray-600 mt-1">{dropOff.dropCount} users dropped off</div>
              </div>
              <div className="text-2xl font-bold text-red-600">{dropOff.dropPercentage}%</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Device & Traffic Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Device Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.entries(analytics.deviceBreakdown).map(([name, value]) => ({ name, value }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {Object.keys(analytics.deviceBreakdown).map((_key, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Traffic Sources */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Traffic Sources</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.entries(analytics.trafficSources).map(([name, value]) => ({ name, value }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {Object.keys(analytics.trafficSources).map((_key, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

// Helper function to check if answers are numeric
function isNumericAnswer(answers: any[]): boolean {
  if (answers.length === 0) return false;
  // Check if all values are numbers or can be parsed as numbers
  return answers.every(a => !isNaN(parseFloat(a.value)));
}

// Helper function to prepare numeric data for visualization
function prepareNumericData(answers: any[]) {
  const values = answers.map(a => parseFloat(a.value)).sort((a, b) => a - b);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  const bucketSize = range / 5; // 5 buckets

  const buckets: any[] = [];
  for (let i = 0; i < 5; i++) {
    const rangeStart = min + (bucketSize * i);
    const rangeEnd = min + (bucketSize * (i + 1));
    const count = answers.filter(a => {
      const val = parseFloat(a.value);
      return val >= rangeStart && (i === 4 ? val <= rangeEnd : val < rangeEnd);
    }).reduce((sum, a) => sum + a.count, 0);

    buckets.push({
      range: `${Math.round(rangeStart)}-${Math.round(rangeEnd)}`,
      count,
    });
  }

  return buckets;
}

// Helper function to get most common numeric value
function getMostCommonNumeric(answers: any[]): string {
  const sorted = [...answers].sort((a, b) => b.count - a.count);
  return sorted[0]?.value || 'N/A';
}

// Helper function to truncate long answers
function truncateAnswer(answer: string): string {
  try {
    // If it's JSON, try to parse and display better
    const parsed = JSON.parse(answer);
    if (Array.isArray(parsed)) {
      return parsed.join(", ");
    }
    if (typeof parsed === "object") {
      return JSON.stringify(parsed);
    }
  } catch {
    // Not JSON, just return as is
  }

  if (answer.length > 30) {
    return answer.substring(0, 30) + "...";
  }
  return answer;
}
