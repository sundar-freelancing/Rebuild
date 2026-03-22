import { Helmet } from "react-helmet-async";

const SEO = ({ title, description, url, image, type = "website" }) => {
  const siteName = "ReBuild | Premium Solutions";
  const defaultTitle = siteName;
  const defaultDescription = "ReBuild - Premium building and restoration services.";
  
  const formattedTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const metaDescription = description || defaultDescription;
  const metaUrl = url ? `https://www.rebuilditsolutions.com${url}` : "https://www.rebuilditsolutions.com";

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{formattedTitle}</title>
      <meta name="description" content={metaDescription} />

      {/* Open Graph Meta Tags (For Social Media Previews) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={metaUrl} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};

export default SEO;
