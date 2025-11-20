'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Bot,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  Brain,
  Zap,
  BarChart3,
  Clock,
  CheckCircle,
  Play,
  Pause,
  Settings,
  Download,
  Mail,
  Phone,
  Calendar,
  Target,
  Users,
  DollarSign,
  Eye,
  Edit,
  Plus,
  Activity,
  FileText,
  Send
} from 'lucide-react';

interface AIInsightsContentProps {
  activeTab: string;
}

export function AIInsightsContent({ activeTab }: AIInsightsContentProps) {
  
  if (activeTab === 'chatbot') {
    return (
      <div className="space-y-6">
        {/* Chatbot Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Total Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">0</div>
              <p className="text-xs text-gray-500">This month</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#f87416' }}>Resolution Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#b45309' }}>0.0%</div>
              <p className="text-xs text-gray-500">Automated resolutions</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Leads Generated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">0</div>
              <p className="text-xs text-gray-500">From chat interactions</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-600">Avg Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">0s</div>
              <p className="text-xs text-gray-500">AI response time</p>
            </CardContent>
          </Card>
        </div>

        {/* Live Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Live Chat Queries</CardTitle>
                <Badge variant="outline" style={{ color: '#f87416', borderColor: '#f87416', backgroundColor: '#f8741610' }}>
                  <Activity className="h-3 w-3 mr-1" />
                  0 Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {([] as any[]).map((chat: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{chat.user}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          chat.status === 'Answered' ? 'default' :
                          chat.status === 'Lead Generated' ? 'outline' :
                          'secondary'
                        } style={{
                          backgroundColor: chat.status === 'Lead Generated' ? '#f8741610' : undefined,
                          color: chat.status === 'Lead Generated' ? '#f87416' : undefined,
                          borderColor: chat.status === 'Lead Generated' ? '#f87416' : undefined
                        }}>
                          {chat.status}
                        </Badge>
                        <span className="text-xs text-gray-500">{chat.time}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">"{chat.query}"</p>
                    <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded italic">
                      AI: {chat.aiResponse}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chatbot Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Bot Status</label>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">Active</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Availability</label>
                <div className="mt-1 text-sm text-gray-600">
                  24/7 • Auto-escalate after 3 failed attempts
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Knowledge Base</label>
                <div className="mt-1 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Property Database</span>
                    <Badge variant="default">Updated</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Market Reports</span>
                    <Badge variant="default">Updated</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Agent Profiles</span>
                    <Badge variant="outline">Syncing</Badge>
                  </div>
                </div>
              </div>

              <Button style={{ backgroundColor: '#f87416' }} className="text-white w-full">
                <Bot className="h-4 w-4 mr-2" />
                Update Knowledge Base
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } else if (activeTab === 'auto-reports') {
    return (
      <div className="space-y-6">
        {/* Auto Reports Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Scheduled Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">0</div>
              <p className="text-xs text-gray-500">Active automations</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#f87416' }}>Reports Generated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#b45309' }}>0</div>
              <p className="text-xs text-gray-500">This month</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Time Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">0h</div>
              <p className="text-xs text-gray-500">Manual work avoided</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-600">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">0.0%</div>
              <p className="text-xs text-gray-500">Successful deliveries</p>
            </CardContent>
          </Card>
        </div>

        {/* Automated Reports List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Automated Reports</CardTitle>
                <p className="text-sm text-gray-500">AI-generated insights and reports</p>
              </div>
              <Button style={{ backgroundColor: '#f87416' }} className="text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Report
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {([] as any[]).map((report: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{report.name}</h3>
                        <p className="text-sm text-gray-500">{report.description}</p>
                      </div>
                      <Badge variant={report.status === 'Active' ? 'default' : 'secondary'}>
                        {report.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      {report.status === 'Active' ? (
                        <Button variant="outline" size="sm">
                          <Pause className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Frequency</p>
                      <p className="font-medium">{report.frequency}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Recipients</p>
                      <p className="font-medium">{report.recipients}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Last Generated</p>
                      <p className="font-medium">{report.lastGenerated}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Latest Insight</p>
                      <p className="font-medium text-orange-600" style={{ color: '#f87416' }}>{report.insights}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } else if (activeTab === 'recommendations') {
    return (
      <div className="space-y-6">
        {/* AI Recommendations Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Active Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">0</div>
              <p className="text-xs text-gray-500">Waiting for action</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#f87416' }}>Implementation Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#b45309' }}>0.0%</div>
              <p className="text-xs text-gray-500">Recommendations acted on</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Revenue Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">+$0</div>
              <p className="text-xs text-gray-500">Additional revenue</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-600">Accuracy Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">0.0%</div>
              <p className="text-xs text-gray-500">Prediction accuracy</p>
            </CardContent>
          </Card>
        </div>

        {/* Smart Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Recommendations</CardTitle>
            <p className="text-sm text-gray-500">Intelligent suggestions to optimize your real estate business</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {([] as any[]).map((recommendation: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900">{recommendation.title}</h3>
                          <Badge variant={
                            recommendation.priority === 'High' ? 'destructive' :
                            recommendation.priority === 'Medium' ? 'outline' :
                            'secondary'
                          } style={{
                            backgroundColor: recommendation.priority === 'Medium' ? '#f8741610' : undefined,
                            color: recommendation.priority === 'Medium' ? '#f87416' : undefined,
                            borderColor: recommendation.priority === 'Medium' ? '#f87416' : undefined
                          }}>
                            {recommendation.priority} Priority
                          </Badge>
                          <Badge variant="outline">{recommendation.category}</Badge>
                        </div>
                        <p className="text-sm text-gray-500">{recommendation.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Dismiss
                      </Button>
                      <Button size="sm" style={{ backgroundColor: '#f87416' }} className="text-white">
                        Implement
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Potential Impact</p>
                      <p className="font-medium text-green-600">{recommendation.impact}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Implementation Effort</p>
                      <p className="font-medium">{recommendation.effort}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Confidence Level</p>
                      <p className="font-medium">{recommendation.confidence}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Type</p>
                      <p className="font-medium">{recommendation.type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } else if (activeTab === 'alerts') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600">Critical Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">0</div>
              <p className="text-xs text-gray-500">Require immediate attention</p>
            </CardContent>
          </Card>
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#f87416' }}>Warning Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#b45309' }}>0</div>
              <p className="text-xs text-gray-500">Performance warnings</p>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Info Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">0</div>
              <p className="text-xs text-gray-500">Informational updates</p>
            </CardContent>
          </Card>
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Resolved Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">0</div>
              <p className="text-xs text-gray-500">Issues resolved</p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Performance Alerts</CardTitle>
                <p className="text-sm text-gray-500">AI-powered monitoring and alerts for your business metrics</p>
              </div>
              <Button style={{ backgroundColor: '#f87416' }} className="text-white">
                <Settings className="h-4 w-4 mr-2" />
                Configure Alerts
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {([] as any[]).map((alert: any, index: number) => (
                <div key={index} className="border rounded-lg p-4" style={{
                  borderLeft: `4px solid ${
                    alert.severity === 'Critical' ? '#ef4444' :
                    alert.severity === 'Warning' ? '#f87416' : '#3b82f6'
                  }`
                }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {alert.severity === 'Critical' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                        {alert.severity === 'Warning' && <AlertTriangle className="h-5 w-5" style={{ color: '#f87416' }} />}
                        <Badge variant={alert.severity === 'Critical' ? 'destructive' : 'outline'} style={{
                          backgroundColor: alert.severity === 'Warning' ? '#f8741610' : undefined,
                          color: alert.severity === 'Warning' ? '#f87416' : undefined,
                          borderColor: alert.severity === 'Warning' ? '#f87416' : undefined
                        }}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500">{alert.timestamp}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button size="sm" style={{ backgroundColor: '#f87416' }} className="text-white">
                        Take Action
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">{alert.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{alert.description}</p>
                    <p className="text-sm font-medium">Recommended Action: {alert.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback for any other tabs
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          AI Insights - {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </h3>
        <p className="text-gray-500">Content for {activeTab} tab is coming soon...</p>
      </div>
    </div>
  );
}