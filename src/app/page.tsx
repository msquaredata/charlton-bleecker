import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import InvestmentCriteria from "@/components/sections/InvestmentCriteria";
import WhyUs from "@/components/sections/WhyUs";
import HowItWorks from "@/components/sections/HowItWorks";
import Team from "@/components/sections/Team";
import Blog from "@/components/sections/Blog";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <InvestmentCriteria />
        <WhyUs />
        <HowItWorks />
        <Team />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
