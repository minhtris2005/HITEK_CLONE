import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import AIProcess from "@/components/AIProcess";
import Services from "@/components/Services";
import Team from "@/components/Team";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Certifications from "@/components/Certifications";
import GlobalClients from "@/components/GlobalClients";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <AIProcess />
      <Services />
      <About />
      <Certifications />
      <GlobalClients />
      <Team />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;