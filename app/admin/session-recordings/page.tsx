'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  MousePointer,
  Eye,
  Activity,
  AlertTriangle,
  Clock,
  MapPin,
  TrendingDown,
} from "lucide-react";

export default function SessionRecordingsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Session Recordings & Heatmaps</h1>
        <p className="text-muted-foreground">
          Visual analytics and user behavior insights
        </p>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recordings</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0m 0s</div>
            <p className="text-xs text-muted-foreground">
              +0s from average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frustration Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Rage clicks, errors, dead clicks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Form Abandonment</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.0%</div>
            <p className="text-xs text-muted-foreground">
              -0.0% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="recordings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recordings">Session Recordings</TabsTrigger>
          <TabsTrigger value="heatmaps">Heatmaps</TabsTrigger>
          <TabsTrigger value="frustration">Frustration Analysis</TabsTrigger>
          <TabsTrigger value="drop-offs">Form Drop-Offs</TabsTrigger>
        </TabsList>

        {/* Session Recordings Tab */}
        <TabsContent value="recordings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Session Recordings</CardTitle>
              <CardDescription>Watch user interactions and form submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[].length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No session recordings to display
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Heatmaps Tab */}
        <TabsContent value="heatmaps" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Click Heatmap</CardTitle>
                <CardDescription>Where users click most</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center text-muted-foreground">
                    <MousePointer className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">Click Heatmap Visualization</p>
                    <p className="text-xs mt-1">Homepage • Last 7 days • 0 sessions</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Top Click Targets</h4>
                  {[
                    { element: 'Submit Button (Form)', clicks: 0, percent: 0 },
                    { element: 'Navigation Menu', clicks: 0, percent: 0 },
                    { element: 'Property Value Dropdown', clicks: 0, percent: 0 },
                    { element: 'Address Input Field', clicks: 0, percent: 0 },
                    { element: 'Learn More Link', clicks: 0, percent: 0 },
                  ].map((item) => (
                    <div key={item.element} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{item.element}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.clicks.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">({item.percent}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scroll Heatmap</CardTitle>
                <CardDescription>How far users scroll</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">Scroll Depth Heatmap</p>
                    <p className="text-xs mt-1">Homepage • Last 7 days • 0 sessions</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Scroll Depth Distribution</h4>
                  {[
                    { depth: '0-25% (Above Fold)', visitors: 0, percent: 0 },
                    { depth: '25-50%', visitors: 0, percent: 0 },
                    { depth: '50-75%', visitors: 0, percent: 0 },
                    { depth: '75-100%', visitors: 0, percent: 0 },
                    { depth: '100% (Bottom)', visitors: 0, percent: 0 },
                  ].map((item) => (
                    <div key={item.depth} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{item.depth}</span>
                        <span className="font-medium">{item.visitors.toLocaleString()} ({item.percent}%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full"
                          style={{ width: `${item.percent}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attention Heatmap</CardTitle>
                <CardDescription>Where users spend time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center text-muted-foreground">
                    <Eye className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">Attention/Hover Heatmap</p>
                    <p className="text-xs mt-1">Form Page • Last 7 days • 0 sessions</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Most Viewed Elements</h4>
                  {[
                    { element: 'Form Instructions', avgTime: '0s', engagement: 0 },
                    { element: 'Address Field', avgTime: '0s', engagement: 0 },
                    { element: 'Property Type Selector', avgTime: '0s', engagement: 0 },
                    { element: 'Submit Button', avgTime: '0s', engagement: 0 },
                    { element: 'Privacy Policy', avgTime: '0s', engagement: 0 },
                  ].map((item) => (
                    <div key={item.element} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{item.element}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{item.avgTime}</span>
                        <div className="flex items-center gap-1">
                          <div className="w-16 bg-muted rounded-full h-1.5">
                            <div
                              className="bg-orange-500 h-1.5 rounded-full"
                              style={{ width: `${item.engagement}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{item.engagement}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Movement Patterns</CardTitle>
                <CardDescription>Mouse movement analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">Mouse Movement Heatmap</p>
                    <p className="text-xs mt-1">All Pages • Last 7 days</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Movement Insights</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-muted-foreground text-xs">Avg Movements</p>
                      <p className="font-bold text-lg">0</p>
                    </div>
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-muted-foreground text-xs">Hover Duration</p>
                      <p className="font-bold text-lg">0.0s</p>
                    </div>
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-muted-foreground text-xs">Dead Zones</p>
                      <p className="font-bold text-lg">0</p>
                    </div>
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-muted-foreground text-xs">Hot Zones</p>
                      <p className="font-bold text-lg">0</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Frustration Analysis Tab */}
        <TabsContent value="frustration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frustration Signals</CardTitle>
              <CardDescription>Identifying user pain points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    type: 'Rage Clicks',
                    description: 'Multiple rapid clicks on the same element',
                    count: 0,
                    severity: 'high',
                    topElements: ['Submit Button (disabled)', 'Date Picker', 'Address Autocomplete'],
                  },
                  {
                    type: 'Dead Clicks',
                    description: 'Clicks on non-interactive elements',
                    count: 0,
                    severity: 'medium',
                    topElements: ['Static Text "Click Here"', 'Disabled Form Field', 'Image (no link)'],
                  },
                  {
                    type: 'Error Clicks',
                    description: 'Clicks that trigger JavaScript errors',
                    count: 0,
                    severity: 'high',
                    topElements: ['Property Value Dropdown', 'Phone Number Field', 'Email Validation'],
                  },
                  {
                    type: 'Quick Backs',
                    description: 'Users leaving page within 5 seconds',
                    count: 0,
                    severity: 'medium',
                    topElements: ['Homepage Hero', 'Pricing Page', 'Contact Form'],
                  },
                ].map((signal) => (
                  <div key={signal.type} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{signal.type}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            signal.severity === 'high'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {signal.severity}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{signal.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{signal.count}</div>
                        <p className="text-xs text-muted-foreground">events</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Top Affected Elements:</p>
                      <div className="flex flex-wrap gap-2">
                        {signal.topElements.map((element) => (
                          <span key={element} className="text-xs bg-muted px-2 py-1 rounded">
                            {element}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Drop-Offs Tab */}
        <TabsContent value="drop-offs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Form Field Drop-Off Analysis</CardTitle>
              <CardDescription>Where users abandon form completion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { field: 'Address Field', started: 0, completed: 0, dropRate: 0.0, avgTime: '0s', errors: 0 },
                  { field: 'Property Type', started: 0, completed: 0, dropRate: 0.0, avgTime: '0s', errors: 0 },
                  { field: 'Property Value', started: 0, completed: 0, dropRate: 0.0, avgTime: '0s', errors: 0 },
                  { field: 'Bedrooms', started: 0, completed: 0, dropRate: 0.0, avgTime: '0s', errors: 0 },
                  { field: 'First Name', started: 0, completed: 0, dropRate: 0.0, avgTime: '0s', errors: 0 },
                  { field: 'Last Name', started: 0, completed: 0, dropRate: 0.0, avgTime: '0s', errors: 0 },
                  { field: 'Email', started: 0, completed: 0, dropRate: 0.0, avgTime: '0s', errors: 0 },
                  { field: 'Phone', started: 0, completed: 0, dropRate: 0.0, avgTime: '0s', errors: 0 },
                  { field: 'Submit', started: 0, completed: 0, dropRate: 0.0, avgTime: '0s', errors: 0 },
                ].map((field, idx) => (
                  <div key={field.field} className="border rounded-lg p-4">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{field.field}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{field.started.toLocaleString()} started</span>
                          <span>→</span>
                          <span>{field.completed.toLocaleString()} completed</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          field.dropRate > 10 ? 'text-red-600' :
                          field.dropRate > 5 ? 'text-orange-600' :
                          'text-green-600'
                        }`}>
                          {field.dropRate}%
                        </div>
                        <p className="text-xs text-muted-foreground">drop-off</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Avg Time</p>
                        <p className="font-medium">{field.avgTime}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Errors</p>
                        <p className={`font-medium ${field.errors > 30 ? 'text-red-600' : 'text-foreground'}`}>
                          {field.errors}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Completion Rate</p>
                        <p className="font-medium">{(100 - field.dropRate).toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20">
        <CardHeader>
          <CardTitle className="text-purple-900 dark:text-purple-100">Session Recordings & Heatmaps Active</CardTitle>
          <CardDescription className="text-purple-700 dark:text-purple-300">
            Visual analytics tracking user behavior and identifying optimization opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-purple-800 dark:text-purple-200">
          <ul className="list-disc list-inside space-y-1">
            <li>Session replay with full event tracking (clicks, scrolls, inputs, navigation)</li>
            <li>Multiple heatmap types: click, scroll, hover/attention, and movement patterns</li>
            <li>Frustration analysis: rage clicks, dead clicks, error tracking</li>
            <li>Form field drop-off analysis with timing and error metrics</li>
            <li>Privacy-first recording with automatic data masking</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
