
'use client';

import React from 'react';

interface StructuredDataProps {
  locale: string;
}

/**
 * Industrial Schema.org Injection
 * Provides machine-readable context for search engines.
 */
export function StructuredData({ locale }: StructuredDataProps) {
  const baseUrl = 'https://docflow.pro';
  
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "DOCFLOW Professional",
    "url": `${baseUrl}/${locale}`,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/${locale}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "DOCFLOW Document Intelligence",
    "url": `${baseUrl}/${locale}`,
    "applicationCategory": "BusinessApplication, Productivity",
    "operatingSystem": "All",
    "abstract": "High-performance, local-first document intelligence workspace. Securely merge, split, compress, and sign PDF documents.",
    "browserRequirements": "Requires JavaScript and HTML5",
    "featureList": [
      "Merge PDF",
      "Split PDF",
      "Compress PDF",
      "Digital Signatures",
      "AI Paraphrasing",
      "AI Summarization"
    ],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "DOCFLOW Pro",
    "operatingSystem": "Any",
    "applicationCategory": "Productivity",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1250"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
    </>
  );
}
