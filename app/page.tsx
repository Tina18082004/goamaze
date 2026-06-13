import Navbar             from "@/components/Navbar";
import Hero               from "@/components/Hero";
import FeaturedCollections from "@/components/FeaturedCollections";
import ProductGrid         from "@/components/ProductGrid";
import InspirationGallery  from "@/components/InspirationGallery";
import Testimonials        from "@/components/Testimonials";
import AboutBrand          from "@/components/AboutBrand";
import FAQ                 from "@/components/FAQ";
import NewsletterCTA       from "@/components/NewsletterCTA";
import Footer              from "@/components/Footer";

export default function Home() {
  return (
    <main style={{ background: "var(--bg-primary)", overflowX: "hidden" }}>
      <Navbar />
      <Hero />
      <FeaturedCollections />
      <ProductGrid />
      <InspirationGallery />
      <Testimonials />
      <AboutBrand />
      <FAQ />
      <NewsletterCTA />
      <Footer />
    </main>
  );
}
