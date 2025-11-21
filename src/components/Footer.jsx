import { Facebook, Linkedin, Twitter, Youtube } from "lucide-react";
import { useLocation } from "react-router-dom";
import "./Footer.css";
import topapp from "@/assets/footer/app-development.png";
import clutch from "@/assets/footer/clutch.png";
import frame from "@/assets/footer/frame.png";
import trustpilot from "@/assets/footer/trustpilot-logo.png";
import Contact from './Contact';

const Footer = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      {!isHomePage && <Contact />}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            {/* Left Section - Brand Info */}
            <div>
              <h3 className="footer-logo">
                Hitek
              </h3>
              <p className="footer-description">
                Đối tác công nghệ tin cậy cho sự phát triển bền vững của doanh nghiệp bạn.
              </p>
              <div className="footer-social">
                <a href="#" className="footer-social-link">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="footer-social-link">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="footer-social-link">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="footer-social-link">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Right Section - Partner Logos */}
            <div className="footer-logos">
              <a href="https://www.goodfirms.co/company/hitek-group-jsc" target="_blank" rel="noopener noreferrer">
                <img src={topapp} alt="App Development" className="footer-logo-img" />
              </a>

              <a href="https://clutch.co/profile/hitek-vietnam?utm_source=clutch_top_company_badge&utm_medium=image_embed&badge=34616" target="_blank" rel="noopener noreferrer">
                <img src={clutch} alt="Clutch Rating" className="footer-logo-img" />
              </a>

              <a href="https://www.designrush.com/agency/profile/hitek-group-jsc" target="_blank" rel="noopener noreferrer">
                <img src={frame} alt="Frame Company" className="footer-logo-img" />
              </a>

              <a href="https://www.trustpilot.com/review/hitek.com.vn" target="_blank" rel="noopener noreferrer">
                <img src={trustpilot} alt="Trustpilot Reviews" className="footer-logo-img" />
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2024 Hitek. Bản quyền thuộc về công ty.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;