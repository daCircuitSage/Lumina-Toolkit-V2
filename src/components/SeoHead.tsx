import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SeoHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  structuredData?: object;
}

const defaultMeta = {
  title: 'Lumina Toolkit - Professional Productivity Suite',
  description: 'Lumina Toolkit - Professional productivity suite with resume builder, ATS checker, PDF converter, age calculator, GPA calculator, AI tools, and more. Free online tools for career development.',
  keywords: 'resume builder, ATS checker, PDF converter, age calculator, GPA calculator, AI tools, cover letter generator, job tracker, interview prep, productivity tools',
  ogImage: 'https://lumintoolkit.com/og-image.png',
  ogType: 'website',
};

export default function SeoHead({
  title,
  description,
  keywords,
  ogImage,
  ogType,
  canonicalUrl,
  noindex = false,
  structuredData
}: SeoHeadProps) {
  const location = useLocation();
  
  // Auto-generate self-referencing canonical URL based on current route
  const autoCanonicalUrl = `https://lumintoolkit.com${location.pathname}`;
  const finalCanonicalUrl = canonicalUrl || autoCanonicalUrl;
  
  const finalTitle = title ? `${title} | Lumina Toolkit` : defaultMeta.title;
  const finalDescription = description || defaultMeta.description;
  const finalKeywords = keywords || defaultMeta.keywords;
  const finalOgImage = ogImage || defaultMeta.ogImage;
  const finalOgType = ogType || defaultMeta.ogType;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content="Lumina Toolkit" />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content={finalOgType} />
      <meta property="og:url" content={finalCanonicalUrl} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Lumina Toolkit" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalOgImage} />
      <meta name="twitter:domain" content="lumintoolkit.com" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={finalCanonicalUrl} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
