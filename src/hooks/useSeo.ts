import { useEffect } from 'react';

interface SeoData {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  structuredData?: object;
}

export function useSeo(seoData: SeoData) {
  useEffect(() => {
    // Update document title
    if (seoData.title) {
      document.title = `${seoData.title} | Lumina Toolkit`;
    }

    // Update or create meta description
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Update or create property meta tags (OG/Twitter)
    const updatePropertyTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Update meta tags
    if (seoData.description) {
      updateMetaTag('description', seoData.description);
    }

    if (seoData.keywords) {
      updateMetaTag('keywords', seoData.keywords);
    }

    if (seoData.noindex) {
      updateMetaTag('robots', 'noindex, nofollow');
    }

    // Update OG tags
    if (seoData.title) {
      updatePropertyTag('og:title', `${seoData.title} | Lumina Toolkit`);
    }

    if (seoData.description) {
      updatePropertyTag('og:description', seoData.description);
    }

    if (seoData.ogImage) {
      updatePropertyTag('og:image', seoData.ogImage);
    }

    if (seoData.ogType) {
      updatePropertyTag('og:type', seoData.ogType);
    }

    if (seoData.canonicalUrl) {
      updatePropertyTag('og:url', seoData.canonicalUrl);
      
      // Update canonical link
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = seoData.canonicalUrl;
    }

    // Update structured data
    if (seoData.structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(seoData.structuredData);
    }

    // Update Twitter tags
    if (seoData.title) {
      let twitterTitle = document.querySelector('meta[name="twitter:title"]') as HTMLMetaElement;
      if (!twitterTitle) {
        twitterTitle = document.createElement('meta');
        twitterTitle.name = 'twitter:title';
        document.head.appendChild(twitterTitle);
      }
      twitterTitle.content = `${seoData.title} | Lumina Toolkit`;
    }

    if (seoData.description) {
      let twitterDesc = document.querySelector('meta[name="twitter:description"]') as HTMLMetaElement;
      if (!twitterDesc) {
        twitterDesc = document.createElement('meta');
        twitterDesc.name = 'twitter:description';
        document.head.appendChild(twitterDesc);
      }
      twitterDesc.content = seoData.description;
    }

    if (seoData.ogImage) {
      let twitterImage = document.querySelector('meta[name="twitter:image"]') as HTMLMetaElement;
      if (!twitterImage) {
        twitterImage = document.createElement('meta');
        twitterImage.name = 'twitter:image';
        document.head.appendChild(twitterImage);
      }
      twitterImage.content = seoData.ogImage;
    }
  }, [seoData]);
}
