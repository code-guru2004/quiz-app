import Contact from "@/components/shared/Contact";
import Features from "@/components/shared/Features";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import Hero from "@/components/shared/Hero";
import Pricing from "@/components/shared/Pricing";
import Testimonials from "@/components/shared/Testimonials";

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Header />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        {/* <Pricing /> */}
        <Contact />
      </main>
      <Footer />
    </div>
  )
}