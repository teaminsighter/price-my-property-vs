'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  Target,
  Flame,
  Snowflake,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

export default function LeadScoringPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lead Quality Scoring</h1>
        <p className="text-muted-foreground">
          AI-powered lead scoring and qualification analysis
        </p>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
            <Flame className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Score 75+ • High intent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warm Leads</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Score 50-74 • Qualified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cold Leads</CardTitle>
            <Snowflake className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Score &lt;50 • Nurture needed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Lead Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.0</div>
            <p className="text-xs text-muted-foreground">
              +0.0 from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="top-leads">Top Scored Leads</TabsTrigger>
          <TabsTrigger value="scoring-breakdown">Score Breakdown</TabsTrigger>
          <TabsTrigger value="rules">Scoring Rules</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
                <CardDescription>Lead distribution by quality rating</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { grade: 'A+', range: '90-100', count: 0, percent: 0.0, color: 'bg-green-500' },
                    { grade: 'A', range: '85-89', count: 0, percent: 0.0, color: 'bg-green-400' },
                    { grade: 'B+', range: '75-84', count: 0, percent: 0.0, color: 'bg-blue-500' },
                    { grade: 'B', range: '65-74', count: 0, percent: 0.0, color: 'bg-blue-400' },
                    { grade: 'C', range: '50-64', count: 0, percent: 0.0, color: 'bg-yellow-500' },
                    { grade: 'D/F', range: '<50', count: 0, percent: 0.0, color: 'bg-gray-400' },
                  ].map((item) => (
                    <div key={item.grade} className="flex items-center gap-4">
                      <div className="w-12 text-sm font-medium">{item.grade}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-muted-foreground">{item.range}</span>
                          <span className="text-sm font-medium">{item.count} leads ({item.percent}%)</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`${item.color} h-2 rounded-full`}
                            style={{ width: `${item.percent}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scoring Components</CardTitle>
                <CardDescription>Average contribution by factor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { component: 'Engagement', weight: 20, avgScore: 0, color: 'bg-purple-500' },
                    { component: 'Behavior', weight: 15, avgScore: 0, color: 'bg-blue-500' },
                    { component: 'Demographics', weight: 15, avgScore: 0, color: 'bg-green-500' },
                    { component: 'Source Quality', weight: 15, avgScore: 0, color: 'bg-yellow-500' },
                    { component: 'Timing', weight: 10, avgScore: 0, color: 'bg-orange-500' },
                    { component: 'Property Fit', weight: 15, avgScore: 0, color: 'bg-red-500' },
                    { component: 'Target Fit', weight: 10, avgScore: 0, color: 'bg-indigo-500' },
                  ].map((item) => (
                    <div key={item.component}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{item.component}</span>
                        <span className="text-sm text-muted-foreground">{item.avgScore}/100 ({item.weight}% weight)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full`}
                          style={{ width: `${item.avgScore}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Conversion Probability vs Lead Score</CardTitle>
              <CardDescription>How scoring correlates with actual conversions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { scoreRange: '90-100 (A+)', conversionRate: 0, sampleSize: 0 },
                  { scoreRange: '80-89 (A)', conversionRate: 0, sampleSize: 0 },
                  { scoreRange: '70-79 (B+)', conversionRate: 0, sampleSize: 0 },
                  { scoreRange: '60-69 (B)', conversionRate: 0, sampleSize: 0 },
                  { scoreRange: '50-59 (C)', conversionRate: 0, sampleSize: 0 },
                  { scoreRange: '<50 (D/F)', conversionRate: 0, sampleSize: 0 },
                ].map((item) => (
                  <div key={item.scoreRange} className="flex items-center gap-4">
                    <div className="w-32 text-sm font-medium">{item.scoreRange}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">{item.sampleSize} leads</span>
                        <span className="text-sm font-medium">{item.conversionRate}% convert</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                          style={{ width: `${item.conversionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Scored Leads Tab */}
        <TabsContent value="top-leads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Highest Quality Leads</CardTitle>
              <CardDescription>Top 10 leads by quality score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[].length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No leads to display
                  </div>
                )}
                {[].map((lead: any, idx: number) => (
                  <div key={lead.email} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                          idx === 0 ? 'bg-yellow-500' :
                          idx === 1 ? 'bg-gray-400' :
                          idx === 2 ? 'bg-orange-600' :
                          'bg-blue-500'
                        }`}>
                          #{idx + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{lead.name}</h4>
                          <p className="text-sm text-muted-foreground">{lead.email}</p>
                          <p className="text-sm text-muted-foreground mt-1">{lead.property} • {lead.value}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl font-bold">{lead.score}</span>
                          <span className="text-sm font-medium text-muted-foreground">{lead.grade}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Flame className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-medium text-red-500 capitalize">{lead.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {lead.signals.map((signal: string) => (
                        <span key={signal} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md">
                          {signal}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Score Breakdown Tab */}
        <TabsContent value="scoring-breakdown" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Score Analysis</CardTitle>
              <CardDescription>Example lead score breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg">No lead data available for detailed analysis</p>
                <p className="text-sm mt-2">Score breakdown will appear here when leads are available</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scoring Rules Tab */}
        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Scoring Rules</CardTitle>
              <CardDescription>Configurable rules that contribute to lead scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Property Value > $2M', category: 'Property', points: '+15', active: true, timesApplied: 0 },
                  { name: 'Auckland/Wellington/Christchurch', category: 'Demographics', points: '+15', active: true, timesApplied: 0 },
                  { name: 'Business Email Domain', category: 'Demographics', points: '+10', active: true, timesApplied: 0 },
                  { name: 'Form Completion < 2 minutes', category: 'Engagement', points: '+10', active: true, timesApplied: 0 },
                  { name: 'Zero Form Errors', category: 'Engagement', points: '+15', active: true, timesApplied: 0 },
                  { name: 'Multiple Website Visits (3+)', category: 'Behavior', points: '+10', active: true, timesApplied: 0 },
                  { name: 'Organic Search Traffic', category: 'Source', points: '+20', active: true, timesApplied: 0 },
                  { name: 'Email Click Engagement', category: 'Behavior', points: '+10', active: true, timesApplied: 0 },
                  { name: 'Weekend Submission', category: 'Timing', points: '-5', active: true, timesApplied: 0 },
                  { name: 'After Hours (10pm-6am)', category: 'Timing', points: '-10', active: false, timesApplied: 0 },
                ].map((rule) => (
                  <div key={rule.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {rule.active ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-gray-400" />
                      )}
                      <div>
                        <h5 className="font-medium">{rule.name}</h5>
                        <p className="text-sm text-muted-foreground">
                          {rule.category} • Applied {rule.timesApplied} times
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-lg font-bold ${
                        rule.points.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {rule.points}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-md ${
                        rule.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {rule.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
        <CardHeader>
          <CardTitle className="text-green-900 dark:text-green-100">AI-Powered Lead Scoring Active</CardTitle>
          <CardDescription className="text-green-700 dark:text-green-300">
            Intelligent lead qualification with predictive analytics and quality scoring
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-green-800 dark:text-green-200">
          <ul className="list-disc list-inside space-y-1">
            <li>7 scoring components: engagement, behavior, demographics, source, timing, property, fit</li>
            <li>Automatic quality grading (A+ to F) and temperature rating (hot/warm/cold)</li>
            <li>Conversion probability prediction based on historical data</li>
            <li>Configurable scoring rules with real-time application tracking</li>
            <li>Lead value estimation and churn risk analysis</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
