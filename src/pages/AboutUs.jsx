import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './AboutUs.css';

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const milestones = [
    {
      year: "2018",
      title: "Thành lập công ty",
      description: "Hitek được thành lập chỉ với 5 kỹ sư phần mềm, làm việc tự do, tập trung vào phát triển web và ứng dụng di động cho thị trường Việt Nam."
    },
    {
      year: "2019",
      title: "Mở rộng quy mô",
      description: "Lần đầu nhận được hợp đồng gia công phần mềm cho thị trường Hàn Quốc, Hitek đã thay đổi chiến lược kinh doanh mở rộng sang thị trường nước ngoài."
    },
    {
      year: "2019",
      title: "Đối tác quốc tế",
      description: "Hợp tác với các đối tác lớn từ Nhật Bản, Hàn Quốc và SingaporeChúng tôi tiếp tục phát triển công nghệ tại Hàn Quốc. Gần 90% các dự án đến từ thị trường này."
    },
    {
      year: "2022-Nay",
      title: "200+ Dự án",
      description: "Hitek cung cấp các dịch vụ gia công phần mềm và cung cấp phần mềm cho các khách hàng đến từ Mỹ, Canada, Đức, Hàn, Úc, Nhật."
    },
  ];

  const achievements = [
    {
      icon: "fa-trophy",
      number: "200+",
      label: "Dự án thành công"
    },
    {
      icon: "fa-users",
      number: "150+",
      label: "Đội ngũ chuyên gia"
    },
    {
      icon: "fa-handshake",
      number: "100+",
      label: "Đối tác tin tưởng"
    },
    {
      icon: "fa-star",
      number: "98%",
      label: "Khách hàng hài lòng"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-hero-title">Về Chúng Tôi</h1>
          <p className="about-hero-subtitle">
            Đồng hành cùng doanh nghiệp trong hành trình chuyển đổi số
          </p>
        </div>
      </section>

      {/* Video Section */}
      <section className="about-video-section">
        <div className="container">
          <h2 className="section-title">Hành Trình Của Chúng Tôi</h2>
          <div className="video-wrapper">
            <iframe
              className="video-frame"
              src="https://www.youtube.com/embed/GAJVDvyOr8c"
              title="Giới thiệu Hitek"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="achievements-section">
        <div className="container">
          <h2 className="section-title">Thành Tựu Nổi Bật</h2>
          <div className="achievements-grid">
            {achievements.map((achievement, index) => (
              <div key={index} className="achievement-card">
                <i className={`fas ${achievement.icon} achievement-icon`}></i>
                <div className="achievement-number">{achievement.number}</div>
                <div className="achievement-label">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="milestones-section">
        <div className="container">
          <h2 className="section-title">Các Mốc Quan Trọng</h2>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-content">
                  <h3 className="timeline-title">{milestone.title}</h3>
                  <p className="timeline-description">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
