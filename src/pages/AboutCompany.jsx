import { useTheme } from "next-themes";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRef, useState, useEffect } from "react";
import "./AboutCompany.css";
import photo from "@/assets/activity/photo.jpg";
import photo2 from "@/assets/activity/photo2.jpg";
import photo3 from "@/assets/activity/photo3.jpg";
import photo4 from "@/assets/activity/photo4.jpg";
import s2 from "@/assets/team/s2.png";
import s3 from "@/assets/team/s3.png";
import s4 from "@/assets/team/s4.png";
const AboutCompany = () => {
  const { theme } = useTheme();
  const membersScrollRef = useRef(null);
  const activitiesScrollRef = useRef(null);
  const [activeMemberIndex, setActiveMemberIndex] = useState(0);
  const [activeActivityIndex, setActiveActivityIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Drag state
  const [isDraggingMembers, setIsDraggingMembers] = useState(false);
  const [isDraggingActivities, setIsDraggingActivities] = useState(false);
  const [startXMembers, setStartXMembers] = useState(0);
  const [startXActivities, setStartXActivities] = useState(0);
  const [scrollLeftMembers, setScrollLeftMembers] = useState(0);
  const [scrollLeftActivities, setScrollLeftActivities] = useState(0);

  const keyMembers = [
    {
      name: "Oh Sean Beom",
      position: "Giám đốc kinh doanh tại Hàn Quốc",
      description: "10+ năm kinh nghiệm phát triển mobile app/web.",
      image: s2
    },
    {
      name: "Lê Quốc Vũ",
      position: "Giám đốc công nghệ công ty Hitek Software",
      description: "7+ năm kinh nghiệm phát triển phần mềm và thiết kế hệ thống.",
      image: s3
    },
    {
      name: "Lâm Thứ Tiên",
      position: "Giám đốc công ty Hitek Capital",
      description: "Sáng lập và là Chủ tịch HĐQT Công ty cổ phần Đầu tư Công nghệ số Rồng Việt (Rovi Group).",
      image: s4
    }
  ];

  const activities = [
    {
      image: photo,
      title: "Hoạt Động Cộng Đồng"
    },
    {
      image: photo2, 
      title: "Hoạt Động Cộng Đồng"
    },
    {
      image: photo3,
      title: "Hoạt Động Cộng Đồng"
    },
    {
      image: photo4,
      title: "Hoạt Động Cộng Đồng"
    },
    {
      image: photo,
      title: "Hoạt Động Cộng Đồng"
    },
    {
      image: photo1,
      title: "Hoạt Động Cộng Đồng"
    }
  ];

  // Sửa hàm handleImageClick để kiểm tra có phải là click thật không
  const handleImageClick = (image, title) => {
    setSelectedImage({ image, title });
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  // Drag functions for members
  const handleMouseDownMembers = (e) => {
    setIsDraggingMembers(true);
    setStartXMembers(e.pageX - membersScrollRef.current.offsetLeft);
    setScrollLeftMembers(membersScrollRef.current.scrollLeft);
  };

  const handleMouseLeaveMembers = () => {
    setIsDraggingMembers(false);
  };

  const handleMouseUpMembers = () => {
    setIsDraggingMembers(false);
  };

  const handleMouseMoveMembers = (e) => {
    if (!isDraggingMembers) return;
    e.preventDefault();
    const x = e.pageX - membersScrollRef.current.offsetLeft;
    const walk = (x - startXMembers) * 2;
    membersScrollRef.current.scrollLeft = scrollLeftMembers - walk;
  };

  // Drag functions for activities
  const handleMouseDownActivities = (e) => {
    setIsDraggingActivities(true);
    setStartXActivities(e.pageX - activitiesScrollRef.current.offsetLeft);
    setScrollLeftActivities(activitiesScrollRef.current.scrollLeft);
  };

  const handleMouseLeaveActivities = () => {
    setIsDraggingActivities(false);
  };

  const handleMouseUpActivities = () => {
    setIsDraggingActivities(false);
  };

  const handleMouseMoveActivities = (e) => {
    if (!isDraggingActivities) return;
    e.preventDefault();
    const x = e.pageX - activitiesScrollRef.current.offsetLeft;
    const walk = (x - startXActivities) * 2;
    activitiesScrollRef.current.scrollLeft = scrollLeftActivities - walk;
  };

  // Scroll tracking for members
  useEffect(() => {
    const container = membersScrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.offsetWidth;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveMemberIndex(Math.min(index, keyMembers.length - 1));
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [keyMembers.length]);

  // Scroll tracking for activities
  useEffect(() => {
    const container = activitiesScrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = 413;
      const gap = 20;
      const index = Math.round(scrollLeft / (cardWidth + gap));
      setActiveActivityIndex(Math.min(index, activities.length - 1));
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [activities.length]);

  // Scroll functions for members
  const scrollToMember = (index) => {
    const container = membersScrollRef.current;
    const scrollPosition = index * container.offsetWidth;
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  };

  const scrollNextMember = () => {
    const nextIndex = Math.min(activeMemberIndex + 1, keyMembers.length - 1);
    scrollToMember(nextIndex);
  };

  const scrollPrevMember = () => {
    const prevIndex = Math.max(activeMemberIndex - 1, 0);
    scrollToMember(prevIndex);
  };

  // Scroll functions for activities - dịch 1 ảnh mỗi lần
const scrollToActivity = (index) => {
  const container = activitiesScrollRef.current;
  const cardWidth = 413;
  const gap = 20;
  const scrollPosition = index * (cardWidth + gap);
  container.scrollTo({
    left: scrollPosition,
    behavior: 'smooth'
  });
};

  const scrollNextActivity = () => {
  const nextIndex = Math.min(activeActivityIndex + 1, activities.length - 1);
  scrollToActivity(nextIndex);
};

const scrollPrevActivity = () => {
  const prevIndex = Math.max(activeActivityIndex - 1, 0);
  scrollToActivity(prevIndex);
};

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className={`about-company ${theme === 'dark' ? 'dark' : 'light'}`}>
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="company-header text-center mb-16">
            <h1 className="company-title">
              Thông Tin Công Ty
            </h1>
            <p className="company-subtitle">
              Khám phá hành trình, giá trị và đội ngũ đằng sau sự thành công của chúng tôi
            </p>
          </div>

          {/* Tầm Nhìn */}
          <section className="text-section mb-20">
            <div className="section-number">01</div>
            <h2 className="section-heading">TẦM NHÌN</h2>
            <div className="content-text">
              <p className="text-lg mb-4">
                <strong>Mục tiêu dài hạn của Hitek là trở thành một công ty phần mềm hàng đầu Thế giới!</strong>
              </p>
              <p>
                Hitek Software luôn cố gắng không ngừng làm mới công nghệ mỗi ngày để đạt được mục tiêu trở thành công ty phần mềm hàng đầu Thế giới.
              </p>
            </div>
          </section>

          {/* Thông Điệp với ảnh bên phải */}
          <section className="text-section mb-20">
            <div className="section-number">02</div>
            <div className="message-with-image">
              <div className="message-content">
                <h2 className="section-heading">THÔNG ĐIỆP</h2>
                <div className="message-header mb-6">
                  <h3 className="message-title">CHỦ TỊCH</h3>
                </div>
                <div className="message-text">
                  <p className="text-lg mb-4">
                    <strong>MỤC TIÊU DÀI HẠN CỦA HITEK LÀ TRỞ THÀNH MỘT CÔNG TY PHẦN MỀM HÀNG ĐẦU THẾ GIỚI!</strong>
                  </p>
                  <p className="mb-4">
                    May mắn có cơ hội làm việc với nhiều khách hàng trên toàn thế giới ở giai đoạn tiến khởi nghiệp, tôi đã tích lũy cho mình được rất nhiều kinh nghiệm để có thể dễ dàng nắm bắt nhu cầu của khách hàng ở mỗi nước, mỗi lĩnh vực mà họ hướng đến. Tôi đã và đang xây dựng Hitek Software lớn mạnh hơn từng ngày bằng những kinh nghiệm đó.
                  </p>
                  <p className="mb-4">
                    Hitek Software là tập hợp những năng lượng trẻ, đầy nhiệt huyết, luôn sẵn sàng tìm kiếm và thích nghi với những công nghệ mới. Do đó, chúng tôi tự tin rằng, với thế mạnh cập nhật nhanh những công nghệ mới, kiến thức mới sẽ giúp khách hàng của Hitek thỏa mãn với những nhu cầu mà họ đưa ra.
                  </p>
                  <p className="mb-6">
                    Bên cạnh nguồn nhân lực dồi dào, chúng tôi còn sở hữu những chuyên viên tư vấn thạo ngoại ngữ - hiểu biết rộng về công nghệ, điều này sẽ giúp xóa bỏ mọi rào cản giữa Hitek và khách hàng ngoại quốc. Đây cũng là công thức để Hitek Software tiếp cận và đồng hành cùng nhiều khách hàng trên toàn thế giới trong hơn 5 năm qua.
                  </p>
                  <div className="signature">
                    <p className="font-semibold">Chủ tịch - Người sáng lập</p>
                    <p className="text-lg font-bold">Trần Anh Khôi</p>
                  </div>
                </div>
              </div>
              <div className="message-image">
                <div className="image-placeholder">
                  <img src="https://hitek.com.vn/wp-content/uploads/2022/10/z3789463508646_b9883fa34acd4adf7ac881f25e94dbd2.jpg" alt="" className="company-image" />
                </div>
              </div>
            </div>
          </section>

          {/* Thông Tin Công Ty */}
          <section className="text-section mb-20">
            <div className="section-number">03</div>
            <h2 className="section-heading">THÔNG TIN CÔNG TY</h2>
            <div className="content-text">
              <div className="info-grid">
                <div className="info-list">
                  <div className="info-item">
                    <strong>Tên công ty:</strong>
                    <span>HITEK SOFTWARE JSC</span>
                  </div>
                  <div className="info-item">
                    <strong>Ngày thành lập:</strong>
                    <span>05/2018</span>
                  </div>
                  <div className="info-item">
                    <strong>Nhân sự:</strong>
                    <span>100+ nhân viên</span>
                  </div>
                  <div className="info-item">
                    <strong>Vốn điều lệ:</strong>
                    <span>17,4 tỷ VNĐ</span>
                  </div>
                  <div className="info-item">
                    <strong>Lĩnh vực kinh doanh:</strong>
                    <span>Phát triển phần mềm, Ứng dụng di động, Giải pháp công nghệ</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Thành Tựu */}
          <section className="text-section mb-20">
            <div className="section-number">04</div>
            <h2 className="section-heading">THÀNH TỰU</h2>
            <div className="content-text">
              <div className="achievement-list">
                <div className="achievement-item">
                  <span className="achievement-bullet">●</span>
                  Top 20 công ty khởi nghiệp nổi bật tại Việt Nam 2021
                </div>
                <div className="achievement-item">
                  <span className="achievement-bullet">●</span>
                  Trở thành hội viên Hội Tin học thành phố Hồ Chí Minh - HCA 2022
                </div>
                <div className="achievement-item">
                  <span className="achievement-bullet">●</span>
                  Trở thành hội viên Hiệp hội Phần mềm và Dịch vụ CNTT Việt Nam VINASA 2022
                </div>
                <div className="achievement-item">
                  <span className="achievement-bullet">●</span>
                  Đạt chứng chỉ ISTQB (International Software Testing Qualifications Board) 2022
                </div>
                <div className="achievement-item">
                  <span className="achievement-bullet">●</span>
                  Đạt chứng chỉ PMP - Project Management Professional 2023
                </div>
                <div className="achievement-item">
                  <span className="achievement-bullet">●</span>
                  Đạt chứng chỉ ISO 27001:2022 theo tiêu chuẩn quốc tế về thông tin và quản lý an toàn thông tin 2023
                </div>
                <div className="achievement-item">
                  <span className="achievement-bullet">●</span>
                  Đạt chứng chỉ AWS – AWS Certification 2023
                </div>
                <div className="achievement-item">
                  <span className="achievement-bullet">●</span>
                  Đạt chứng chỉ ISO 9001:2015 về Hệ thống Quản lý Chất lượng 2023
                </div>
              </div>
            </div>
          </section>

          {/* Thành Viên Chủ Chốt */}
          <section className="text-section mb-20">
            <div className="section-number">05</div>
            <h2 className="section-heading">THÀNH VIÊN CHỦ CHỐT</h2>
            
            <div className="scroll-section-with-arrows">
              <button 
                className="nav-arrow prev"
                onClick={scrollPrevMember}
                disabled={activeMemberIndex === 0}
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              
              <div className="members-scroll-container">
                <div 
                  ref={membersScrollRef}
                  className="members-scroll-content"
                  onMouseDown={handleMouseDownMembers}
                  onMouseLeave={handleMouseLeaveMembers}
                  onMouseUp={handleMouseUpMembers}
                  onMouseMove={handleMouseMoveMembers}
                  style={{ cursor: isDraggingMembers ? 'grabbing' : 'grab' }}
                >
                  {keyMembers.map((member, index) => (
                    <div 
                      key={index}
                      className={`member-card ${activeMemberIndex === index ? 'active' : ''}`}
                    >
                      <div className="member-avatar-large">
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="member-avatar-img"
                        />
                      </div>
                      <div className="member-info">
                        <h3 className="member-name-large">{member.name}</h3>
                        <p className="member-position-large">{member.position}</p>
                        <p className="member-description-large">{member.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                className="nav-arrow next"
                onClick={scrollNextMember}
                disabled={activeMemberIndex === keyMembers.length - 1}
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>

            <div className="scroll-navigation">
              {keyMembers.map((_, index) => (
                <button
                  key={index}
                  className={`nav-dot ${activeMemberIndex === index ? 'active' : ''}`}
                  onClick={() => scrollToMember(index)}
                />
              ))}
            </div>
          </section>

          {/* Các Hoạt Động - ĐÃ SỬA */}
          <section className="text-section">
            <div className="section-number">06</div>
            <h2 className="section-heading">CÁC HOẠT ĐỘNG</h2>
            
            <div className="activities-scroll-section">
              <button 
                className="nav-arrow prev"
                onClick={scrollPrevActivity}
                disabled={activeActivityIndex === 0}
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              
              <div className="activities-scroll-container">
                <div 
                  ref={activitiesScrollRef}
                  className="activities-scroll-content"
                >
                  {activities.map((activity, index) => (
                    <div 
                      key={index}
                      className="activity-image-card"
                      onClick={(e) => handleImageClick(activity.image, activity.title, e)}
                    >
                      <div className="activity-image-placeholder">
                        <img 
                          src={activity.image} 
                          alt={activity.title}
                          className="activity-image"
                        />
                        <div className="activity-overlay">
                          <span className="activity-title">{activity.title}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
              className="nav-arrow next"
              onClick={scrollNextActivity}
              disabled={activeActivityIndex >= activities.length - 3}
            >
               <i className="fa-solid fa-chevron-right"></i>
            </button>
            </div>

            {/* ĐÃ XÓA PHÂN TRANG Ở PHẦN HOẠT ĐỘNG */}
          </section>
        </div>
      </main>

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseModal}>
              <i className="fa-solid fa-times"></i>
            </button>
            <img 
              src={selectedImage.image} 
              alt={selectedImage.title}
              className="modal-image"
            />
            <div className="modal-title">{selectedImage.title}</div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AboutCompany;