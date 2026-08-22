import { useEffect } from "react";

export function AxionFavicon() {
  useEffect(() => {
    // Check if link rel="icon" exists, if not create one
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.getElementsByTagName("head")[0].appendChild(link);
    }

    // Modern SVG favicon string representing the 2x2 Axion logo
    const svgFavicon = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect x="4" y="4" width="42" height="42" rx="12" fill="#4DA3FF" />
        <rect x="54" y="4" width="42" height="42" rx="12" fill="#0D3B8F" />
        <rect x="4" y="54" width="42" height="42" rx="12" fill="#0D3B8F" />
        <rect x="54" y="54" width="42" height="42" rx="12" fill="#4DA3FF" />
      </svg>
    `.trim();

    // Convert SVG to data URI
    const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svgFavicon)}`;

    // Set favicon attributes
    link.type = "image/svg+xml";
    link.href = dataUri;

    // Set page title for general polish if needed
    document.title = "AXION TECHNOLOGIES | Transforming Businesses Through Intelligent Technology";
  }, []);

  return null;
}

export default AxionFavicon;
