"use client";

import React from "react";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <div className="bg-background">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">{title}</h1>
          
          {lastUpdated && (
            <p className="text-sm text-muted-foreground mb-8 italic">
              Last updated: {lastUpdated}
            </p>
          )}
          
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <style jsx global>{`
              .prose h2 {
                color: #3b82f6;
                font-size: 1.75rem;
                margin-top: 2rem;
                margin-bottom: 1rem;
                font-weight: 700;
                border-bottom: 1px solid #e5e7eb;
                padding-bottom: 0.5rem;
              }
              
              .prose h3 {
                color: #4b5563;
                font-size: 1.4rem;
                margin-top: 1.5rem;
                margin-bottom: 0.75rem;
                font-weight: 600;
              }
              
              .prose p {
                margin-top: 1rem;
                margin-bottom: 1rem;
                line-height: 1.7;
                color: #4b5563;
              }
              
              .prose ul {
                margin-top: 1rem;
                margin-bottom: 1rem;
                padding-left: 1.5rem;
              }
              
              .prose li {
                margin-top: 0.5rem;
                margin-bottom: 0.5rem;
              }
              
              .prose strong {
                color: #111827;
                font-weight: 600;
              }
              
              .dark .prose h2 {
                color: #60a5fa;
                border-bottom-color: #374151;
              }
              
              .dark .prose h3 {
                color: #e5e7eb;
              }
              
              .dark .prose p {
                color: #d1d5db;
              }
              
              .dark .prose strong {
                color: #f9fafb;
              }
            `}</style>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 