'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, FileText, AlertCircle } from 'lucide-react';

interface LegalPage {
  id: string;
  type: string;
  title: string;
  content: {
    sections: Array<{
      title: string;
      content: string | string[];
    }>;
  };
  version: string;
  created_at: string;
  updated_at: string;
}

interface LegalPageDisplayProps {
  type: 'terms' | 'privacy';
}

function LegalPageDisplay({ type }: LegalPageDisplayProps) {
  const [page, setPage] = useState<LegalPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/legal/${type}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${type} page`);
        }

        const data = await response.json();
        setPage(data.page);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [type]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading {type === 'terms' ? 'Terms of Service' : 'Privacy Policy'}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-800">Error Loading Page</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </CardContent>
      </Card>
    );
  }

  if (!page) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-yellow-600" />
            <CardTitle className="text-yellow-800">Page Not Found</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-yellow-700">
            The {type === 'terms' ? 'Terms of Service' : 'Privacy Policy'} page could not be found.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold text-gray-900">
                {page.title}
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 mt-2">
                MarketCode - Digital Marketplace Platform
              </CardDescription>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="mb-2">
                Version {page.version}
              </Badge>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                Last updated: {new Date(page.updated_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Content */}
      <Card>
        <CardContent className="p-8">
          <div className="prose prose-lg max-w-none">
            {page.content.sections.map((section, index) => (
              <section key={index} className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  {section.title}
                </h2>
                
                {Array.isArray(section.content) ? (
                  <ul className="space-y-2 text-gray-700 leading-relaxed">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <span className="h-2 w-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700 leading-relaxed">
                    {section.content}
                  </p>
                )}
              </section>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card className="bg-gray-50">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-gray-600">
            This document was last updated on {new Date(page.updated_at).toLocaleDateString()}.
            <br />
            If you have any questions, please contact us at{' '}
            <a href="mailto:legal@marketcode.com" className="text-blue-600 hover:underline">
              legal@marketcode.com
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export { LegalPageDisplay };
export default LegalPageDisplay;
