'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Edit,
  Eye,
  Save,
  Undo,
  Redo,
  Settings,
  Layout,
  Type,
  Image,
  MousePointer,
  Palette,
  Code,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Download,
  Upload,
  Copy,
  Trash2,
  Plus,
  Move,
  Grid,
  Layers,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  PaintBucket,
  FileText,
  Link,
  Target
} from 'lucide-react';
import type { LandingPageContent } from '@/services/content';
import { updateContentField, getContent } from '@/services/content';

interface PageElement {
  id: string;
  type: 'hero' | 'header' | 'form' | 'section' | 'testimonial' | 'cta' | 'footer';
  title: string;
  description: string;
  editable: boolean;
  visible: boolean;
  fields: {
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'image' | 'link' | 'color' | 'select';
    value: string;
    options?: string[];
    contentKey?: string;
  }[];
}

const defaultPageElements: PageElement[] = [
  {
    id: 'header',
    type: 'header',
    title: 'Navigation Header',
    description: 'Site header with logo and navigation',
    editable: true,
    visible: true,
    fields: [
      { id: 'logo', label: 'Logo Text', type: 'text', value: 'My Top Agent', contentKey: 'logoText' },
      { id: 'ctaText', label: 'CTA Button Text', type: 'text', value: 'Find My Top Agent Now', contentKey: 'headerCtaText' },
      { id: 'tagline', label: 'Header Tagline', type: 'text', value: '100% Free Service for Kiwi Homeowners', contentKey: 'headerTagline' }
    ]
  },
  {
    id: 'hero',
    type: 'hero',
    title: 'Hero Section',
    description: 'Main hero section with headline and form',
    editable: true,
    visible: true,
    fields: [
      { id: 'headline', label: 'Hero Headline', type: 'textarea', value: 'Sell Your Home Fast With the Top Real Estate Agents {location}', contentKey: 'heroHeadline' },
      { id: 'subheadline', label: 'Hero Subheadline', type: 'textarea', value: 'Our agent matching tool uses data-driven real estate agent reviews to match you with the best property agents from top real estate companies in NZ.', contentKey: 'heroSubheadline' },
      { id: 'formHeadline', label: 'Form Headline', type: 'textarea', value: 'Let\'s Find the <span class="text-primary">Top Agent</span> for Your Property', contentKey: 'addressFormHeadline' },
      { id: 'formSubheadline', label: 'Form Subheadline', type: 'textarea', value: 'Enter your address to get a free, no-obligation appraisal from a top-rated house agent.', contentKey: 'addressFormSubheadline' }
    ]
  },
  {
    id: 'benefits',
    type: 'section',
    title: 'Benefits Section',
    description: 'Why choose us section with benefits',
    editable: true,
    visible: true,
    fields: [
      { id: 'sectionHeadline', label: 'Section Headline', type: 'textarea', value: 'Why Use Our <span class="text-primary">Agent Matching</span> Service?', contentKey: 'benefitsSectionHeadline' },
      { id: 'sectionSubheadline', label: 'Section Subheadline', type: 'textarea', value: 'We analyse sales data and real estate agent reviews to help you find the best property agents. Matching agents based on performance, not promises.', contentKey: 'benefitsSectionSubheadline' },
      { id: 'benefit1Title', label: 'Benefit 1 Title', type: 'text', value: 'Find Agents Faster', contentKey: 'benefit1Title' },
      { id: 'benefit1Description', label: 'Benefit 1 Description', type: 'textarea', value: 'Our real estate agent matching connects you with top-performing local experts quickly. Find property agents near you today.', contentKey: 'benefit1Description' },
      { id: 'benefit2Title', label: 'Benefit 2 Title', type: 'text', value: 'Get a Better Sale Price', contentKey: 'benefit2Title' },
      { id: 'benefit2Description', label: 'Benefit 2 Description', type: 'textarea', value: 'Compare real estate agents who consistently achieve top market prices. Our data helps you choose the best house agent for your needs.', contentKey: 'benefit2Description' },
      { id: 'benefit3Title', label: 'Benefit 3 Title', type: 'text', value: 'Unbiased Agent Reviews', contentKey: 'benefit3Title' },
      { id: 'benefit3Description', label: 'Benefit 3 Description', type: 'textarea', value: 'We provide data-driven real estate agent reviews, so you can make an informed choice and find the best in the business.', contentKey: 'benefit3Description' },
      { id: 'benefit4Title', label: 'Benefit 4 Title', type: 'text', value: 'Completely Free Service', contentKey: 'benefit4Title' },
      { id: 'benefit4Description', label: 'Benefit 4 Description', type: 'textarea', value: 'Our agent matching service is 100% free for homeowners. Compare property brokers NZ-wide with no obligation.', contentKey: 'benefit4Description' }
    ]
  },
  {
    id: 'testimonials',
    type: 'testimonial',
    title: 'Testimonials Section',
    description: 'Customer testimonials and reviews',
    editable: true,
    visible: true,
    fields: [
      { id: 'testimonialsHeadline', label: 'Testimonials Headline', type: 'text', value: 'What Our Customers Say', contentKey: 'testimonialsHeadline' },
      { id: 'testimonialsSubheadline', label: 'Testimonials Subheadline', type: 'textarea', value: 'Real reviews from homeowners who found their perfect agent', contentKey: 'testimonialsSubheadline' }
    ]
  },
  {
    id: 'cta',
    type: 'cta',
    title: 'Call to Action Section',
    description: 'Final call to action section',
    editable: true,
    visible: true,
    fields: [
      { id: 'ctaHeadline', label: 'CTA Headline', type: 'text', value: 'Ready to Find Your Top Agent?', contentKey: 'ctaHeadline' },
      { id: 'ctaSubheadline', label: 'CTA Subheadline', type: 'textarea', value: 'Get started today with our free agent matching service', contentKey: 'ctaSubheadline' },
      { id: 'ctaButtonText', label: 'CTA Button Text', type: 'text', value: 'Get My Free Agent Match', contentKey: 'ctaButtonText' }
    ]
  },
  {
    id: 'footer',
    type: 'footer',
    title: 'Footer Section',
    description: 'Site footer with links and information',
    editable: true,
    visible: true,
    fields: [
      { id: 'footerCopyright', label: 'Copyright Text', type: 'text', value: '© 2024 My Top Agent. All rights reserved.', contentKey: 'footerCopyright' },
      { id: 'footerTagline', label: 'Footer Tagline', type: 'text', value: 'New Zealand\'s Premier Agent Matching Service', contentKey: 'footerTagline' }
    ]
  }
];

export function PageEditor() {
  const [pageElements, setPageElements] = useState<PageElement[]>(defaultPageElements);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [saving, setSaving] = useState(false);
  const [savedFields, setSavedFields] = useState<Set<string>>(new Set());
  const [changes, setChanges] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const selectedElementData = pageElements.find(el => el.id === selectedElement);

  // Load current content from Firestore on mount
  useEffect(() => {
    const loadContent = async () => {
      try {
        const content = await getContent();
        setPageElements(prev => prev.map(element => ({
          ...element,
          fields: element.fields.map(field => ({
            ...field,
            value: field.contentKey && content[field.contentKey] ? content[field.contentKey] : field.value
          }))
        })));
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const handleFieldChange = (elementId: string, fieldId: string, value: string) => {
    setPageElements(prev => prev.map(element => 
      element.id === elementId 
        ? {
            ...element,
            fields: element.fields.map(field => 
              field.id === fieldId ? { ...field, value } : field
            )
          }
        : element
    ));
    setChanges(prev => new Set([...prev, `${elementId}-${fieldId}`]));
  };

  const handleSaveField = async (elementId: string, fieldId: string) => {
    const element = pageElements.find(el => el.id === elementId);
    const field = element?.fields.find(f => f.id === fieldId);
    
    if (!field || !field.contentKey) return;

    setSaving(true);
    try {
      const result = await updateContentField(field.contentKey, field.value);
      if (result.success) {
        setSavedFields(prev => new Set([...prev, `${elementId}-${fieldId}`]));
        setChanges(prev => {
          const newSet = new Set(prev);
          newSet.delete(`${elementId}-${fieldId}`);
          return newSet;
        });
        setTimeout(() => {
          setSavedFields(prev => {
            const newSet = new Set(prev);
            newSet.delete(`${elementId}-${fieldId}`);
            return newSet;
          });
        }, 2000);
      } else {
        alert(`Failed to save: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving field:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
      setEditingField(null);
    }
  };

  const handleSaveAllChanges = async () => {
    setSaving(true);
    try {
      const changedFields = Array.from(changes).map(changeId => {
        const [elementId, fieldId] = changeId.split('-');
        const element = pageElements.find(el => el.id === elementId);
        const field = element?.fields.find(f => f.id === fieldId);
        return { elementId, fieldId, field };
      }).filter(item => item.field?.contentKey);

      for (const { elementId, fieldId, field } of changedFields) {
        if (field?.contentKey) {
          await updateContentField(field.contentKey, field.value);
          setSavedFields(prev => new Set([...prev, `${elementId}-${fieldId}`]));
        }
      }
      
      setChanges(new Set());
      setTimeout(() => setSavedFields(new Set()), 2000);
    } catch (error) {
      console.error('Error saving all changes:', error);
      alert('Failed to save some changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleElementVisibility = (elementId: string) => {
    setPageElements(prev => prev.map(element => 
      element.id === elementId 
        ? { ...element, visible: !element.visible }
        : element
    ));
  };

  const getDeviceIcon = () => {
    switch (device) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'hero': return <Layout className="h-4 w-4" />;
      case 'header': return <Grid className="h-4 w-4" />;
      case 'form': return <FileText className="h-4 w-4" />;
      case 'section': return <Layers className="h-4 w-4" />;
      case 'testimonial': return <Type className="h-4 w-4" />;
      case 'cta': return <Target className="h-4 w-4" />;
      case 'footer': return <Grid className="h-4 w-4" />;
      default: return <Layout className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Page Editor</h3>
          <p className="text-gray-500">Fetching current content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Sidebar - Page Elements */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Page Editor</h2>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPreview(!preview)}
              >
                {preview ? <Edit className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                onClick={handleSaveAllChanges}
                disabled={saving || changes.size === 0}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {saving ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Device Toggle */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {(['desktop', 'tablet', 'mobile'] as const).map((deviceType) => (
              <button
                key={deviceType}
                onClick={() => setDevice(deviceType)}
                className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  device === deviceType
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {deviceType === 'desktop' && <Monitor className="h-4 w-4" />}
                {deviceType === 'tablet' && <Tablet className="h-4 w-4" />}
                {deviceType === 'mobile' && <Smartphone className="h-4 w-4" />}
              </button>
            ))}
          </div>

          {changes.size > 0 && (
            <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-md">
              <div className="flex items-center justify-between">
                <span className="text-sm text-orange-800">
                  {changes.size} unsaved change{changes.size !== 1 ? 's' : ''}
                </span>
                <Button
                  size="sm"
                  onClick={handleSaveAllChanges}
                  disabled={saving}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Save All
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Elements List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {pageElements.map((element) => (
            <motion.div
              key={element.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedElement === element.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => setSelectedElement(element.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-md ${
                    element.visible ? 'bg-gray-100' : 'bg-gray-200'
                  }`}>
                    {getElementIcon(element.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm">{element.title}</h3>
                    <p className="text-xs text-gray-500">{element.description}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleElementVisibility(element.id);
                  }}
                  className={`p-1 rounded ${
                    element.visible ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
              {element.fields.some(field => changes.has(`${element.id}-${field.id}`)) && (
                <div className="mt-2 flex items-center text-xs text-orange-600">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Unsaved changes
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Landing Page Editor</h1>
              <Badge variant="outline" className="flex items-center space-x-1">
                {getDeviceIcon()}
                <span className="capitalize">{device}</span>
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Redo className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Preview Live
              </Button>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                <Globe className="h-4 w-4 mr-2" />
                Publish Changes
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Canvas Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className={`mx-auto bg-white rounded-lg shadow-lg ${
              device === 'mobile' ? 'max-w-sm' :
              device === 'tablet' ? 'max-w-2xl' : 
              'max-w-6xl'
            }`}>
              {preview ? (
                <div className="p-8">
                  <iframe
                    src="/"
                    className="w-full h-[800px] border-0 rounded-lg"
                    title="Landing Page Preview"
                  />
                </div>
              ) : (
                <div className="p-8 space-y-8">
                  {pageElements.filter(el => el.visible).map((element) => (
                    <motion.div
                      key={element.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`relative p-4 rounded-lg border-2 transition-all ${
                        selectedElement === element.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-dashed border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => setSelectedElement(element.id)}
                    >
                      <div className="absolute top-2 left-2 flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {element.title}
                        </Badge>
                        {element.fields.some(field => savedFields.has(`${element.id}-${field.id}`)) && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        {element.fields.some(field => changes.has(`${element.id}-${field.id}`)) && (
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                        )}
                      </div>
                      
                      <div className="mt-8 min-h-[100px] flex items-center justify-center text-gray-500">
                        {getElementIcon(element.type)}
                        <span className="ml-2">{element.description}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Properties */}
          {selectedElementData && !preview && (
            <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{selectedElementData.title}</h3>
                <p className="text-sm text-gray-500">{selectedElementData.description}</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedElementData.fields.map((field) => {
                  const fieldKey = `${selectedElementData.id}-${field.id}`;
                  const hasChanges = changes.has(fieldKey);
                  const isSaved = savedFields.has(fieldKey);
                  const isEditing = editingField === fieldKey;

                  return (
                    <div key={field.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">
                          {field.label}
                        </label>
                        <div className="flex items-center space-x-1">
                          {isSaved && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {hasChanges && <AlertCircle className="h-4 w-4 text-orange-500" />}
                          {isEditing ? (
                            <Button
                              size="sm"
                              onClick={() => handleSaveField(selectedElementData.id, field.id)}
                              disabled={saving}
                              className="bg-orange-500 hover:bg-orange-600 text-white"
                            >
                              {saving ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Save className="h-4 w-4" />
                              )}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingField(fieldKey)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {field.type === 'textarea' ? (
                        <Textarea
                          value={field.value}
                          onChange={(e) => handleFieldChange(selectedElementData.id, field.id, e.target.value)}
                          placeholder={field.label}
                          className={`min-h-[80px] ${hasChanges ? 'border-orange-500' : ''}`}
                          rows={4}
                        />
                      ) : field.type === 'select' ? (
                        <Select
                          value={field.value}
                          onValueChange={(value) => handleFieldChange(selectedElementData.id, field.id, value)}
                        >
                          <SelectTrigger className={hasChanges ? 'border-orange-500' : ''}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          type={field.type}
                          value={field.value}
                          onChange={(e) => handleFieldChange(selectedElementData.id, field.id, e.target.value)}
                          placeholder={field.label}
                          className={hasChanges ? 'border-orange-500' : ''}
                        />
                      )}

                      {field.contentKey && (
                        <p className="text-xs text-gray-500">
                          Content key: {field.contentKey}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}