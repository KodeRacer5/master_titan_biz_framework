import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  type?: string;
  image?: string;
}

export function SEO({ 
  title, 
  description, 
  canonical = 'https://titansurgical.com', 
  type = 'website',
  image = 'https://raw.githubusercontent.com/KodeRacer5/sandiegodentalassets/refs/heads/main/titan_main_hero.png'
}: SEOProps) {
  const fullTitle = `${title} | Titan Surgical Systems`;
  
  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      
      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
      <meta name="theme-color" content="#1a1a1a" media="(prefers-color-scheme: dark)" />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Titan Surgical Systems" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@TitanSurgical" />

      {/* JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": "https://titansurgical.com/#organization",
          "name": "Titan Surgical Systems",
          "url": "https://titansurgical.com",
          "logo": {
            "@type": "ImageObject",
            "url": image,
            "width": 1200,
            "height": 630
          },
          "description": description,
          "sameAs": [
            "https://www.linkedin.com/company/titan-surgical-systems",
            "https://twitter.com/TitanSurgical",
            "https://www.facebook.com/TitanSurgicalSystems"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-800-123-4567",
            "contactType": "sales",
            "areaServed": "US",
            "availableLanguage": "English"
          }
        })}
      </script>
    </Helmet>
  );
}