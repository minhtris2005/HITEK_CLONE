import { Button } from "@/components/ui/button";
import { Menu, Sun, Moon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { useNavigate, useLocation } from "react-router-dom";
import './Navbar.css';
import vietnam from "../assets/vietnam.png";
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navbar = () => {
  const [hoverAbout, setHoverAbout] = useState(false);
  const [hoverServices, setHoverServices] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const servicesScrollRef = useRef(null);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  const services = [
    {
      title: "Dịch vụ phát triển phần mềm tại các quốc gia lân cận",
      description: "Phát triển phần mềm tại các quốc gia lân cận đề cập đến việc sản xuất phần mềm tại các quốc gia gần với thị trưởng tiêu thụ và thường có múi giờ tương tự, hơn hết sự khác biệt sẽ luôn nằm ở mức tối thiểu.",
    },
    {
      title: "Dịch vụ phát triển mobile app",
      description: "Là một công ty phát triển ứng dụng di động hàng đầu, chúng tôi có nhiều năm kinh nghiệm trong việc tạo ra các ứng dụng sáng tạo",
    },
    {
      title: "SEO & Marketing",
      description: "Tối ưu website để tăng hiệu quả marketing và tiếp cận khách hàng.",
    },
    {
      title: "Tư vấn công nghệ",
      description: "Giúp doanh nghiệp ứng dụng công nghệ vào chiến lược phát triển.",
    },
    {
      title: "Giải pháp AI",
      description: "Triển khai các mô hình trí tuệ nhân tạo nâng cao hiệu suất làm việc.",
    }
  ];

  // Hàm điều hướng
  const handleNavigation = (path) => {
    // Nếu là route liên hệ, scroll xuống phần contact trong trang chủ
    if (path === "/contact") {
      navigate("/");
      
      // Scroll xuống phần contact sau khi trang chủ load
      setTimeout(() => {
        const contactSection = document.getElementById("contact");
        if (contactSection) {
          contactSection.scrollIntoView({ 
            behavior: "smooth",
            block: "start"
          });
        }
      }, 100);
    } else {
      navigate(path); // Điều hướng bình thường cho các route khác
    }
  };

  // Hàm kiểm tra xem route có đang active không
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // Scroll tracking for services
  useEffect(() => {
    const container = servicesScrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.querySelector('.service-card')?.offsetWidth || 0;
      const gap = 16;
      const index = Math.round(scrollLeft / (cardWidth + gap));
      setActiveServiceIndex(Math.min(index, services.length - 1));
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [services.length]);
  

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setHasMoved(false);
    const container = servicesScrollRef.current;
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
    container.style.cursor = 'grabbing';
    container.style.userSelect = 'none';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const container = servicesScrollRef.current;
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    
    // If moved more than 5px, consider it a drag
    if (Math.abs(walk) > 5) {
      setHasMoved(true);
    }
    
    container.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const container = servicesScrollRef.current;
    container.style.cursor = 'grab';
    container.style.userSelect = '';
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      const container = servicesScrollRef.current;
      container.style.cursor = 'grab';
      container.style.userSelect = '';
    }
  };

  const scrollToService = (index) => {
    // Only scroll if it wasn't a drag
    if (hasMoved) return;
    
    const container = servicesScrollRef.current;
    const cardWidth = container.querySelector('.service-card')?.offsetWidth || 0;
    const gap = 16;
    const scrollPosition = index * (cardWidth + gap);
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  };

  return (
    <nav className={`navbar ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <img 
          src="https://hitek.com.vn/wp-content/uploads/2022/08/logo-140x38.avif" 
          alt="Hitek Logo" 
          className="navbar-logo" 
          onClick={() => handleNavigation("/")}
          style={{cursor: 'pointer'}}
        />
        
        {/* Desktop Menu */}
        <div className="navbar-desktop">
          <button
            onClick={() => handleNavigation("/")}
            className={`navbar-link ${isActiveRoute("/") ? "active" : ""}`}
          >
            TRANG CHỦ
          </button>

          {/* About dropdown */}
          <div
            className="navbar-item"
            onMouseEnter={() => setHoverAbout(true)}
            onMouseLeave={() => setHoverAbout(false)}
          >
            <button
              className={`navbar-link ${hoverAbout ? "active" : ""}`}
            >
              VỀ HITEK <i className="fa-solid fa-chevron-down"></i>
            </button>

            {hoverAbout && (
              <div
                className="navbar-dropdown"
                onMouseEnter={() => setHoverAbout(true)}
                onMouseLeave={() => setHoverAbout(false)}
              >
                <button
                  onClick={() => handleNavigation("/aboutcompany")}
                  className="navbar-dropdown-item"
                >
                  Thông tin công ty
                </button>
                <button
                  onClick={() => handleNavigation("/aboutus")}
                  className="navbar-dropdown-item"
                >
                  Về chúng tôi
                </button>
              </div>
            )}
          </div>

          {/* Services mega menu */}
          <div
            className="navbar-item"
            onMouseEnter={() => setHoverServices(true)}
            onMouseLeave={() => setHoverServices(false)}
          >
            <button
              className={`navbar-link ${hoverServices ? "active" : ""}`}
            >
              DỊCH VỤ <i className="fa-solid fa-chevron-down"></i>
            </button>

            {hoverServices && (
              <div
                className="services-mega-menu"
                onMouseEnter={() => setHoverServices(true)}
                onMouseLeave={() => setHoverServices(false)}
              >
                <div 
                  ref={servicesScrollRef}
                  className="services-scroll-container"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="services-scroll-content">
                    {services.map((service, index) => (
                      <div 
                        key={index}
                        className={`service-card ${activeServiceIndex === index ? 'active' : 'inactive'}`}
                      >
                        <h4 className="service-title">{service.title}</h4>
                        <p className="service-text">{service.description}</p>
                        <Button className="service-btn" size="sm">Xem chi tiết</Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Dots */}
                <div className="services-navigation">
                  {services.map((_, index) => (
                    <button
                      key={index}
                      className={`nav-dot ${activeServiceIndex === index ? 'active' : ''}`}
                      onClick={() => scrollToService(index)}
                      aria-label={`Đi tới dịch vụ ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => handleNavigation("/technology")}
            className={`navbar-link ${isActiveRoute("/technology") ? "active" : ""}`}
          >
            CÔNG NGHỆ
          </button>
          
          <button
            onClick={() => handleNavigation("/projects")}
            className={`navbar-link ${isActiveRoute("/projects") ? "active" : ""}`}
          >
            DỰ ÁN
          </button>
          
          <button
            onClick={() => handleNavigation("/recruitment")}
            className={`navbar-link ${isActiveRoute("/recruitment") ? "active" : ""}`}
          >
            TUYỂN DỤNG
          </button>

          {/* Nút Liên hệ mới */}
          <button
            onClick={() => handleNavigation("/contact")}
            className={`navbar-link ${isActiveRoute("/contact") ? "active" : ""}`}
          >
            LIÊN HỆ
          </button>
            
          {/* Language */}
          <div className="navbar-language">
            <img src={vietnam} alt="VN" className="navbar-language-logo"/>
            VI <i className="fa-solid fa-chevron-down"></i>
          </div>
            
          {/* Admin Link */}
          <button
            onClick={() => handleNavigation("/admin")}
            className={`navbar-link ${isActiveRoute("/admin") ? "active" : ""}`}
            style={{ marginLeft: '10px' }}
          >
            <i className="fa-solid fa-lock"></i> ADMIN
          </button>
            
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="theme-toggle"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;