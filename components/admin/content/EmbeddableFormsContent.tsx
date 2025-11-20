'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Copy,
  ExternalLink,
  Code,
  Eye,
  CheckCircle2,
  Settings
} from 'lucide-react';

export function EmbeddableFormsContent() {
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedForm, setSelectedForm] = useState('quiz-form');

  // Get the current domain (for production, this would be your actual domain)
  const domain = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

  const forms = [
    {
      id: 'quiz-form',
      name: 'Quiz Lead Form (5 Steps)',
      description: 'Step-by-step quiz form with Address → Property Type → Value → Bedrooms → Contact',
      url: `${domain}/iframe`,
      height: 700,
      features: [
        'Google Places autocomplete',
        'Smooth animations',
        'Mobile responsive',
        'Auto-advance steps',
        'No back button'
      ]
    }
  ];

  const currentForm = forms.find(f => f.id === selectedForm) || forms[0];

  const generateIframeCode = (refParam: string = 'ghl-campaign') => {
    return `<iframe
  src="${currentForm.url}?ref=${refParam}"
  width="100%"
  height="${currentForm.height}"
  frameborder="0"
  scrolling="auto"
  style="border: none; border-radius: 10px;"
></iframe>`;
  };

  const copyIframeCode = () => {
    const code = generateIframeCode();
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Embeddable Forms</h2>
        <p className="text-gray-600 mt-1">
          Generate iframe codes to embed your forms in GoHighLevel or any website
        </p>
      </div>

      {/* Quick Start Guide */}
      <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🚀 Quick Start: Embed in GoHighLevel
          </h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="font-semibold mr-2">1.</span>
              <span>Copy the iframe code below</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">2.</span>
              <span>Open your GoHighLevel page editor</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">3.</span>
              <span>Add a "Custom HTML" or "Embed" element</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">4.</span>
              <span>Paste the iframe code</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">5.</span>
              <span>Save and publish - all submissions auto-save to your database!</span>
            </li>
          </ol>
        </div>
      </Card>

      {/* Form Selection */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Forms</h3>

          <div className="space-y-4">
            {forms.map((form) => (
              <div
                key={form.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedForm === form.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedForm(form.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{form.name}</h4>
                      {selectedForm === form.id && (
                        <Badge className="bg-orange-500">Selected</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{form.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {form.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Settings className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Iframe Code Generator */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Iframe Code</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(currentForm.url, '_blank')}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                onClick={copyIframeCode}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {copiedCode ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
              <code>{generateIframeCode()}</code>
            </pre>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
              <Code className="w-4 h-4 mr-2" />
              Customize the ?ref= parameter
            </h4>
            <p className="text-sm text-blue-800">
              Change <code className="bg-blue-200 px-2 py-1 rounded">?ref=ghl-campaign</code> to track different campaigns:
            </p>
            <ul className="text-sm text-blue-800 mt-2 space-y-1 ml-4">
              <li>• <code>?ref=facebook-ad-1</code> - Track Facebook ads</li>
              <li>• <code>?ref=google-search</code> - Track Google search</li>
              <li>• <code>?ref=email-campaign</code> - Track email campaigns</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Demo Preview */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('/iframe-demo.html', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Full Demo Page
            </Button>
          </div>

          <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
            <iframe
              src={`${currentForm.url}?ref=admin-preview`}
              width="100%"
              height={currentForm.height}
              style={{ border: 'none' }}
              title="Form Preview"
            />
          </div>
        </div>
      </Card>

      {/* Features & Info */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            What Happens When Someone Submits?
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start">
              <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Auto-saved to Database:</strong> All form data is automatically saved to your Prisma database
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Source Tracking:</strong> The <code>?ref=</code> parameter is saved to identify which campaign the lead came from
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Lead Management:</strong> View all leads in the CRM section with full details
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Real-time Analytics:</strong> Track form performance and conversion rates
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
