import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Mono } from "next/font/google";
import { profile } from "../content/profile";
import { site } from "../lib/site";
import "./globals.css";

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const themeScript = `(function(){try{var t=localStorage.getItem("gr-theme");if(t==="gruvbox"||t==="kanagawa"||t==="night")document.documentElement.dataset.theme=t;}catch(e){}})();`;

const shareImage = {
  url: "/opengraph.png",
  width: 1200,
  height: 630,
  alt: "Gabriel Rocha, full stack developer in Brazil",
} as const;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: profile.name, url: profile.github }],
  creator: profile.name,
  publisher: profile.name,
  category: "portfolio",
  keywords: [
    "Gabriel Rocha",
    "full stack",
    "TypeScript",
    "Node.js",
    "Next.js",
    "Java",
    "Python",
    "Brazil",
  ],
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      "pt-BR": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: site.locale,
    alternateLocale: [...site.alternateLocale],
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [shareImage],
  },
  appleWebApp: {
    capable: true,
    title: site.name,
    statusBarStyle: "black-translucent",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: site.url,
  image: `${site.url}${profile.portrait}`,
  jobTitle: "Full stack developer",
  email: profile.email,
  address: {
    "@type": "PostalAddress",
    addressCountry: "BR",
  },
  affiliation: {
    "@type": "Organization",
    name: profile.org,
  },
  sameAs: [profile.github, profile.linkedin, profile.instagram],
  knowsAbout: [...profile.focus, "Java", "Python"],
};

export const viewport: Viewport = {
  themeColor: "#14120b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={mono.className} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replaceAll("<", "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
