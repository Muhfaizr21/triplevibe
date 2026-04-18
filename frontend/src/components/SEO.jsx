import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title = "TripleVibe | Solusi Software Engineering Profesional", 
  description = "TripleVibe membangun solusi perangkat lunak dengan presisi arsitektural. Pengembangan web skala enterprise, aplikasi mobile, cloud infra, hingga data modern.", 
  image = "http://localhost:5173/triple.jpg", 
  url = "http://localhost:5173", 
  type = "website",
  jsonLd = null 
}) {
  return (
    <Helmet>
      {/* Standar Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph (OG) - Facebook & LinkedIn */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="TripleVibe" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Schema.org / JSON-LD / Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
