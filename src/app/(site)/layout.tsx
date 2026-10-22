import { SiteFooter, SiteHeader } from "@/components/site/chrome";
import { company } from "@/content/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: company.name,
  description: "Polymer granules stockist and distributor",
  foundingDate: String(company.since),
  telephone: company.phone.tel,
  address: {
    "@type": "PostalAddress",
    streetAddress: "K/23, Sonal Heavy Industrial Estate, Kachpada, Ramchandra Lane Extension",
    addressLocality: "Malad West, Mumbai",
    postalCode: "400064",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
  geo: { "@type": "GeoCoordinates", latitude: 19.189572, longitude: 72.839198 },
  taxID: company.gst,
};

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
