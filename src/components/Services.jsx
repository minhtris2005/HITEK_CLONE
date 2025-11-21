import { useRef, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import softwareDev from "@/assets/services/software-development.jpg";
import dataManagement from "@/assets/services/data-management.jpg";
import cloudComputing from "@/assets/services/cloud-computing.jpg";
import cybersecurity from "@/assets/services/cybersecurity.jpg";
import mobileApps from "@/assets/services/mobile-apps.jpg";
import businessAnalytics from "@/assets/services/business-analytics.jpg";
import "./Services.css";

const Services = () => {
  const scrollContainerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const { theme } = useTheme();
  
  const services = [
    {
      image: softwareDev,
      title: "Phát triển phần mềm",
      description: "Xây dựng ứng dụng web và phần mềm tùy chỉnh theo nhu cầu doanh nghiệp",
      link: "/services/software-development"
    },
    {
      image: dataManagement,
      title: "Quản lý dữ liệu",
      description: "Giải pháp lưu trữ, xử lý và phân tích dữ liệu quy mô lớn",
      link: "/services/data-management"
    },
    {
      image: cloudComputing,
      title: "Điện toán đám mây",
      description: "Triển khai và quản lý hạ tầng cloud cho doanh nghiệp",
      link: "/services/cloud-computing"
    },
    {
      image: cybersecurity,
      title: "An ninh mạng",
      description: "Bảo vệ hệ thống và dữ liệu khỏi các mối đe dọa an ninh",
      link: "/services/cybersecurity"
    },
    {
      image: mobileApps,
      title: "Ứng dụng di động",
      description: "Phát triển ứng dụng iOS và Android chuyên nghiệp",
      link: "/services/mobile-apps"
    },
    {
      image: businessAnalytics,
      title: "Phân tích kinh doanh",
      description: "Công cụ BI và dashboard để ra quyết định dựa trên dữ liệu",
      link: "/services/business-analytics"
    }
  ];

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollTimeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollLeft = container.scrollLeft;
        const cardWidth = container.querySelector('.service-card')?.offsetWidth || 0;
        const gap = 24;
        const index = Math.round(scrollLeft / (cardWidth + gap));
        setActiveIndex(Math.min(index, services.length - 1));
      }, 50);
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [services.length]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setHasMoved(false);
    const container = scrollContainerRef.current;
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
    container.style.cursor = 'grabbing';
    container.style.userSelect = 'none';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const container = scrollContainerRef.current;
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    
    if (Math.abs(walk) > 5) {
      setHasMoved(true);
    }
    
    container.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const container = scrollContainerRef.current;
    container.style.cursor = 'grab';
    container.style.userSelect = '';
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      const container = scrollContainerRef.current;
      container.style.cursor = 'grab';
      container.style.userSelect = '';
    }
  };

  const handleCardClick = (index, link) => {
    if (!hasMoved) {
      window.location.href = link;
    }
  };

  const scrollToService = (index) => {
    if (hasMoved) return;
    
    const container = scrollContainerRef.current;
    const cardWidth = container.querySelector('.service-card')?.offsetWidth || 0;
    const gap = 24;
    const scrollPosition = index * (cardWidth + gap);
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  };

  return (
    <section 
      id="services" 
      className={`services-section ${theme === 'dark' ? 'dark' : 'light'}`}
      data-theme={theme}
    >
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="services-header">
          <div className="services-text-content">
            <span className="services-label">Dịch vụ</span>
            <h2 className="services-title">
              của chúng tôi
            </h2>
          </div>
          <div className="services-description">
            <p className="services-subtitle">
              Chúng tôi cung cấp các dịch vụ có thể giúp doanh nghiệp cải thiện khả năng hiển thị 
              và danh tiếng trực tuyến, mở rộng thị trường và tăng doanh thu thông qua các chiến lược số hiệu quả.
            </p>
          </div>
        </div>

        {/* Scrollable Cards */}
        <div 
          ref={scrollContainerRef}
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
                className={`service-card ${activeIndex === index ? 'active' : ''}`}
                onClick={() => handleCardClick(index, service.link)}
              >
                <div className="service-image-wrapper">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="service-image"
                  />
                </div>
                <div className="service-content">
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="services-navigation">
          {services.map((_, index) => (
            <button
              key={index}
              className={`nav-dot ${activeIndex === index ? 'active' : ''}`}
              onClick={() => scrollToService(index)}
              aria-label={`Đi tới dịch vụ ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;