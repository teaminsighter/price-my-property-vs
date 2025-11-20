'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  Target,
  DollarSign,
  Users,
  MousePointer,
  Smartphone,
  Globe,
  BarChart3,
} from "lucide-react";

export default function AttributionPage() {
  const [selectedModel, setSelectedModel] = useState('linear');

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attribution & Source Analysis</h1>
        <p className="text-muted-foreground">
          Multi-touch attribution modeling and campaign performance tracking
        </p>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Touch Points Tracked</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Across all customer journeys
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Touch Points</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.0</div>
            <p className="text-xs text-muted-foreground">
              Per conversion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attribution Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0</div>
            <p className="text-xs text-muted-foreground">
              Total attributed revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cross-Device Leads</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">
              Multi-device conversions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="models" className="space-y-4">
        <TabsList>
          <TabsTrigger value="models">Attribution Models</TabsTrigger>
          <TabsTrigger value="sources">Source Performance</TabsTrigger>
          <TabsTrigger value="journeys">Customer Journeys</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Analysis</TabsTrigger>
        </TabsList>

        {/* Attribution Models Tab */}
        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attribution Model Comparison</CardTitle>
              <CardDescription>Compare how different models attribute credit to marketing channels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Model Selector */}
                <div className="flex gap-2 flex-wrap">
                  {['First Touch', 'Last Touch', 'Linear', 'Time Decay', 'Position-Based'].map((model) => (
                    <button
                      key={model}
                      onClick={() => setSelectedModel(model.toLowerCase().replace(' ', '_'))}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedModel === model.toLowerCase().replace(' ', '_')
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {model}
                    </button>
                  ))}
                </div>

                {/* Channel Attribution */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Channel Attribution ({selectedModel.replace('_', ' ')} model)</h3>

                  {[
                    { channel: 'Google Organic', conversions: 0, credit: 0, value: '$0' },
                    { channel: 'Google Ads', conversions: 0, credit: 0, value: '$0' },
                    { channel: 'Facebook Ads', conversions: 0, credit: 0, value: '$0' },
                    { channel: 'Direct', conversions: 0, credit: 0, value: '$0' },
                    { channel: 'Referral', conversions: 0, credit: 0, value: '$0' },
                  ].map((item) => (
                    <div key={item.channel} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{item.channel}</span>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{item.conversions} conversions</span>
                            <span className="font-medium text-foreground">{item.credit}% credit</span>
                            <span className="font-medium text-foreground">{item.value}</span>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${item.credit}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Model Insights</CardTitle>
                <CardDescription>How this model works</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Linear Attribution</strong></p>
                  <p className="text-muted-foreground">
                    Equal credit distributed across all touchpoints in the customer journey.
                    Best for understanding the full marketing mix contribution.
                  </p>
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <p className="font-medium mb-1">Use Case:</p>
                    <p className="text-xs text-muted-foreground">
                      When you want to value all marketing interactions equally and understand
                      the complete customer journey without bias toward first or last touch.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Journey Length</CardTitle>
                <CardDescription>Touch points before conversion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { touchPoints: '1 touch', percent: 0, count: 0 },
                    { touchPoints: '2-3 touches', percent: 0, count: 0 },
                    { touchPoints: '4-6 touches', percent: 0, count: 0 },
                    { touchPoints: '7+ touches', percent: 0, count: 0 },
                  ].map((item) => (
                    <div key={item.touchPoints} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{item.touchPoints}</span>
                          <span className="text-sm text-muted-foreground">{item.count} leads ({item.percent}%)</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${item.percent}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Source Performance Tab */}
        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Source Performance Metrics</CardTitle>
              <CardDescription>Comparing traffic sources and conversion efficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Source</th>
                      <th className="text-right py-3 px-4 font-medium">Sessions</th>
                      <th className="text-right py-3 px-4 font-medium">Leads</th>
                      <th className="text-right py-3 px-4 font-medium">Conv. Rate</th>
                      <th className="text-right py-3 px-4 font-medium">Avg. Lead Score</th>
                      <th className="text-right py-3 px-4 font-medium">Revenue</th>
                      <th className="text-right py-3 px-4 font-medium">ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { source: 'Google Organic', sessions: 0, leads: 0, convRate: 0.00, score: 0, revenue: 0, roi: 0 },
                      { source: 'Google Ads', sessions: 0, leads: 0, convRate: 0.00, score: 0, revenue: 0, roi: 0 },
                      { source: 'Facebook Ads', sessions: 0, leads: 0, convRate: 0.00, score: 0, revenue: 0, roi: 0 },
                      { source: 'Direct', sessions: 0, leads: 0, convRate: 0.00, score: 0, revenue: 0, roi: 0 },
                      { source: 'LinkedIn', sessions: 0, leads: 0, convRate: 0.00, score: 0, revenue: 0, roi: 0 },
                      { source: 'Referral', sessions: 0, leads: 0, convRate: 0.00, score: 0, revenue: 0, roi: 0 },
                    ].map((row) => (
                      <tr key={row.source} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{row.source}</td>
                        <td className="py-3 px-4 text-right">{row.sessions.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">{row.leads}</td>
                        <td className="py-3 px-4 text-right">{row.convRate.toFixed(2)}%</td>
                        <td className="py-3 px-4 text-right">{row.score}/100</td>
                        <td className="py-3 px-4 text-right">${row.revenue.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">
                          {row.roi > 0 ? (
                            <span className="text-green-600">{row.roi}%</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Journeys Tab */}
        <TabsContent value="journeys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sample Customer Journeys</CardTitle>
              <CardDescription>Multi-touch paths leading to conversion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[].length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No customer journeys to display
                  </div>
                )}
                {[].map((journey: any) => (
                  <div key={journey.leadId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">{journey.leadId}</h4>
                        <p className="text-sm text-muted-foreground">{journey.touchPoints.length} touch points • {journey.value}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {journey.touchPoints.map((tp: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                              idx === 0 ? 'bg-green-100 text-green-700' :
                              idx === journey.touchPoints.length - 1 ? 'bg-blue-100 text-blue-700' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {idx + 1}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-sm font-medium">{tp.source}</span>
                                <span className="text-sm text-muted-foreground ml-2">• {tp.action}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">{tp.date}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Campaign Analysis Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>Attribution by marketing campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[].length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No campaigns to display
                  </div>
                )}
                {[].map((campaign: any) => (
                  <div key={campaign.campaign} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{campaign.campaign}</h4>
                        <p className="text-sm text-muted-foreground">{campaign.source}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">+{campaign.roi}%</div>
                        <p className="text-xs text-muted-foreground">ROI</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Leads</p>
                        <p className="font-medium">{campaign.leads}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Spend</p>
                        <p className="font-medium">${campaign.spend.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Revenue</p>
                        <p className="font-medium">${campaign.revenue.toLocaleString()}</p>
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
      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-100">Multi-Touch Attribution Active</CardTitle>
          <CardDescription className="text-blue-700 dark:text-blue-300">
            Advanced attribution modeling is tracking all customer touchpoints across your marketing channels
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 dark:text-blue-200">
          <ul className="list-disc list-inside space-y-1">
            <li>5 attribution models: First-Touch, Last-Touch, Linear, Time-Decay, Position-Based</li>
            <li>Cross-device tracking with device fingerprinting</li>
            <li>Source performance comparison and ROI calculation</li>
            <li>Full customer journey visualization</li>
            <li>Campaign-level attribution analysis</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
