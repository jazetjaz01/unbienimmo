import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/api/", "/auth/", "/protected", "/actualite/addpost"],
    },
    sitemap: "https://www.unbienimmo.com/sitemap.xml",
    host: "https://www.unbienimmo.com",
  };
}
