import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import "./Hero.css";

const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="hero-section">
      {/* Background Video with Overlay */}
      <div className="hero-video-container">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hero-video"
        >
          <source src="https://hitek.com.vn/wp-content/uploads/2024/10/home-page-hitek-software.mp4" type="video/mp4" />
        </video>

      </div>

      {/* Content */}
      <div className="hero-content">
        <span className="hero-title">THÚC ĐẨY SÁNG TẠO, TĂNG TỐC ĐỔI MỚI, ĐỒNG HÀNH PHÁT TRIỂN, NÂNG TẦM THÀNH CÔNG</span>
        <span className="hero-slogan"><br />_ Chất lượng là danh dự _</span>
        <Button 
            variant="secondary"
            onClick={scrollToContact}
            className="hero-buttons"
          >
            Khám phá những khả năng của Việt Nam
            <ArrowRight className="hero-buttons__icon" />
        </Button>
      </div>

      {/* Scroll Indicator */}
      {/* <div className="hero-scroll-indicator">
        <div className="hero-scroll-mouse">
          <div className="hero-scroll-wheel" />
        </div>
      </div> */}
    </section>
  );
};

export default Hero;
