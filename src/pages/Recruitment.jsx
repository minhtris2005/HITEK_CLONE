import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import './Recruitment.css';
import { supabase } from '@/lib/supabase'; // Thêm import
import { toast } from 'sonner'; // Thêm import
const Recruitment = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('all');
  // 🆕 STATE CHO FORM TUYỂN DỤNG
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    message: '',
    cv: null
  });
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [applicationErrors, setApplicationErrors] = useState({});
  // 🆕 HÀM XỬ LÝ THAY ĐỔI FORM
  const handleApplicationChange = (e) => {
  const { name, value, files } = e.target;
  
  let processedValue = value;
  
  // 🆕 AUTO-FORMAT SỐ ĐIỆN THOẠI KHI NHẬP
  if (name === 'phone') {
    processedValue = formatPhoneNumber(value);
  }
  
  if (name === 'cv') {
    setApplicationForm(prev => ({ ...prev, [name]: files[0] }));
  } else {
    setApplicationForm(prev => ({ ...prev, [name]: processedValue }));
  }
  
  // Xóa lỗi khi user bắt đầu nhập
  if (applicationErrors[name]) {
    setApplicationErrors(prev => ({ ...prev, [name]: '' }));
  }
  
  // 🆕 REAL-TIME VALIDATION CHO SỐ ĐIỆN THOẠI
  if (name === 'phone' && processedValue.trim()) {
    const error = validatePhoneNumber(processedValue.trim());
    setApplicationErrors(prev => ({ 
      ...prev, 
      [name]: error 
    }));
  }
};

// 🆕 HÀM FORMAT SỐ ĐIỆN THOẠI ĐẸP
const formatPhoneNumber = (value) => {
  // Chỉ giữ số
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length === 0) return '';
  
  // Format: XXX XXX XXXX hoặc XXXX XXX XXX
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
  if (numbers.length <= 8) return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6)}`;
  return `${numbers.slice(0, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7, 10)}`;
};
  // 🆕 HÀM VALIDATION CHO FORM TUYỂN DỤNG
  const validateApplicationForm = () => {
    const newErrors = {};
    
    if (!applicationForm.name.trim()) newErrors.name = 'Họ tên là bắt buộc';
    if (!applicationForm.email.trim()) newErrors.email = 'Email là bắt buộc';
    if (!applicationForm.phone.trim()) newErrors.phone = 'Số điện thoại là bắt buộc';
    if (!applicationForm.position) newErrors.position = 'Vui lòng chọn vị trí';
    if (!applicationForm.cv) newErrors.cv = 'Vui lòng tải lên CV';
    
    // Validate email format
    if (applicationForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicationForm.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    // 🆕 VALIDATE SỐ ĐIỆN THOẠI CHẶT CHẼ
    if (applicationForm.phone.trim()) {
      const phoneError = validatePhoneNumber(applicationForm.phone.trim());
      if (phoneError) {
        newErrors.phone = phoneError;
      }
    }
    return newErrors;
  };

  // 🆕 HÀM VALIDATE SỐ ĐIỆN THOẠI VIỆT NAM
const validatePhoneNumber = (phone) => {
  // Xóa khoảng trắng và ký tự đặc biệt
  const cleanPhone = phone.replace(/[\s\-()+. ]/g, '');
  
  console.log('📞 Phone validation:', { original: phone, clean: cleanPhone });
  
  // Kiểm tra độ dài
  if (cleanPhone.length < 10) return 'Số điện thoại phải có ít nhất 10 số';
  if (cleanPhone.length > 11) return 'Số điện thoại quá dài (tối đa 11 số)';
  
  // Kiểm tra chỉ chứa số
  if (!/^\d+$/.test(cleanPhone)) {
    return 'Số điện thoại chỉ được chứa số và khoảng trắng';
  }
  
  // 🆕 KIỂM TRA ĐẦU SỐ VIỆT NAM
  const validPrefixes = [
    '032', '033', '034', '035', '036', '037', '038', '039', // Mobi
    '070', '076', '077', '078', '079', // Mobi
    '081', '082', '083', '084', '085', // Vinaphone
    '056', '058', '059', // Vietnamobile
    '052', '055', // Viettel
    '087', '089', // Reddi
    '088', // Vinaphone
    '091', '094', // Vinaphone
    '092', '093', '095', '096', '097', '098', '099' // Viettel
  ];
  
  let phonePrefix = '';
  if (cleanPhone.startsWith('84')) {
    phonePrefix = cleanPhone.substring(2, 5); // +84 xxx
  } else if (cleanPhone.startsWith('0')) {
    phonePrefix = cleanPhone.substring(0, 3); // 0xxx
  } else {
    return 'Số điện thoại phải bắt đầu bằng 0 hoặc +84';
  }
  
  // Kiểm tra đầu số hợp lệ
  if (!validPrefixes.includes(phonePrefix)) {
    return `Đầu số ${phonePrefix} không hợp lệ. Ví dụ: 091, 092, 093, 094, 095, 096, 097, 098, 099`;
  }
  
  return ''; // Không có lỗi
};
  // 🆕 HÀM GỬI FORM TUYỂN DỤNG
  const handleApplicationSubmit = async (e) => {
    e.preventDefault();

    console.log('🔍 Bắt đầu validate form...');
    const errors = validateApplicationForm();
    if (Object.keys(errors).length > 0) {
      setApplicationErrors(errors);
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }
    
    setApplicationLoading(true);

    try {
      console.log('🚀 Bắt đầu gửi đơn ứng tuyển...');

      // 🆕 BƯỚC 1: UPLOAD FILE CV LÊN STORAGE
    let cvUrl = '';
    if (applicationForm.cv) {
      console.log('📎 Đang upload CV...');
      
      // Tạo tên file unique
      const fileExt = applicationForm.cv.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `cv-files/${fileName}`;

      // Upload file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('job-applications') // Tên bucket
        .upload(filePath, applicationForm.cv);

      if (uploadError) {
        console.error('❌ Lỗi upload CV:', uploadError);
        throw new Error('Không thể upload CV');
      }

      console.log('✅ Upload CV thành công:', filePath);
      
      // 🆕 Lấy URL download (cần cấu hình RLS policy)
      const { data: urlData } = supabase.storage
        .from('job-applications')
        .getPublicUrl(filePath);
      
      cvUrl = urlData.publicUrl;
    }
       // 📧 BƯỚC 2: GỬI EMAIL VỚI LINK DOWNLOAD CV
      const emailResponse = await fetch(
      'https://dqkuvmsvhazyrtursbnc.functions.supabase.co/send-email', 
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: 'phamnguyenminhtri249@gmail.com',
          subject: `Đơn ứng tuyển ${applicationForm.position} - ${applicationForm.name}`,
          message: `
            🎯 THÔNG TIN ỨNG VIÊN:
            ────────────────
            👤 Họ tên: ${applicationForm.name}
            📧 Email: ${applicationForm.email}
            📞 Điện thoại: ${applicationForm.phone}
            💼 Vị trí ứng tuyển: ${applicationForm.position}

            📝 Lời nhắn:
            ${applicationForm.message || 'Không có lời nhắn'}

            📎 CV ĐÍNH KÈM:
            File: ${applicationForm.cv?.name}
            ${cvUrl ? `Download: ${cvUrl}` : 'Chưa có file'}

            ────────────────
            Gửi từ trang tuyển dụng Hitek
          `,
          customerEmail: applicationForm.email,
          customerName: applicationForm.name
        })
      }
    );

      const result = await emailResponse.json();
      console.log('📦 Email response:', result);

      if (!emailResponse.ok) {
        throw new Error(result.error || 'Gửi email thất bại');
      }

      // 🗄️ LƯU VÀO DATABASE
      console.log('💾 Đang lưu vào database...');
      
      const { data: dbData, error: dbError } = await supabase
        .from('job_applications') // Tạo bảng mới cho ứng tuyển
        .insert([{ 
          name: applicationForm.name.trim(),
          email: applicationForm.email.trim(),
          phone: applicationForm.phone.trim(),
          position: applicationForm.position,
          message: applicationForm.message.trim(),
          cv_file_name: applicationForm.cv?.name || '',
          created_at: new Date().toISOString()
        }])
        .select();

      if (dbError) {
        console.error('❌ Lỗi database:', dbError);
        toast.warning("Đơn ứng tuyển đã gửi! Có lỗi nhỏ khi lưu dữ liệu.");
      } else {
        console.log('✅ Lưu database thành công!');
      }

      // ✅ THÀNH CÔNG
      toast.success("Đơn ứng tuyển đã gửi thành công! Chúng tôi sẽ liên hệ sớm.");
      
      // Reset form
      setApplicationForm({
        name: '',
        email: '',
        phone: '',
        position: '',
        message: '',
        cv: null
      });
      setApplicationErrors({});

    } catch (error) {
      console.error('💥 Lỗi tổng thể:', error);
      toast.error("Có lỗi xảy ra! Vui lòng thử lại sau.");
    } finally {
      console.log('🏁 Kết thúc quá trình gửi đơn ứng tuyển');
      setApplicationLoading(false);
    }
  };
  // Hàm scroll đến section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Dữ liệu mẫu
  const timelineData = [
    {
      year: "2018",
      title: "Thành lập Hitek",
      description: "Bắt đầu hành trình với 5 thành viên sáng lập, tập trung vào phát triển phần mềm web"
    },
    {
      year: "2019",
      title: "Mở rộng đội ngũ",
      description: "Phát triển lên 20 thành viên, bắt đầu triển khai các dự án mobile app"
    },
    {
      year: "2020",
      title: "Vượt qua đại dịch",
      description: "Chuyển đổi thành công sang mô hình remote work, tăng trưởng 150%"
    },
    {
      year: "2021",
      title: "Phát triển AI",
      description: "Thành lập bộ phận AI/ML, triển khai các giải pháp trí tuệ nhân tạo"
    },
    {
      year: "2022",
      title: "Quốc tế hóa",
      description: "Mở rộng thị trường sang Nhật Bản, Hàn Quốc và Châu Âu"
    },
    {
      year: "2023",
      title: "100+ thành viên",
      description: "Đạt mốc 100 nhân sự, trở thành công ty công nghệ hàng đầu Việt Nam"
    }
  ];

  const benefitsData = [
    {
      icon: "💼",
      title: "Lương thưởng cạnh tranh",
      description: "Thu nhập lên đến 2000$, review lương 6 tháng/lần"
    },
    {
      icon: "🏥",
      title: "Bảo hiểm sức khỏe",
      description: "Bảo hiểm sức khỏe cao cấp cho bạn và người thân"
    },
    {
      icon: "🎓",
      title: "Đào tạo & Phát triển",
      description: "Ngân sách đào tạo 1000$/năm, conference trong và ngoài nước"
    },
    {
      icon: "🏖️",
      title: "Nghỉ phép linh hoạt",
      description: "15 ngày phép năm, nghỉ ốm không giới hạn, work from home"
    },
    {
      icon: "⚽",
      title: "Hoạt động team building",
      description: "Team building hàng quý, du lịch hàng năm, party cuối năm"
    },
    {
      icon: "💻",
      title: "Thiết bị làm việc",
      description: "Macbook Pro, màn hình 4K, và các thiết bị hiện đại nhất"
    }
  ];

  const positionsData = {
    all: [
      {
        id: 1,
        title: "Senior Frontend Developer",
        department: "Technology",
        type: "Full-time",
        location: "Hồ Chí Minh",
        experience: "3-5 years",
        salary: "$1500 - $2000",
        skills: ["React", "TypeScript", "Next.js", "Vue.js"],
        description: "Chúng tôi đang tìm kiếm Senior Frontend Developer có kinh nghiệm để tham gia vào đội ngũ phát triển sản phẩm core."
      },
      {
        id: 2,
        title: "Backend Engineer (Node.js)",
        department: "Technology",
        type: "Full-time",
        location: "Hà Nội",
        experience: "2-4 years",
        salary: "$1200 - $1800",
        skills: ["Node.js", "MongoDB", "Redis", "Docker"],
        description: "Tham gia phát triển hệ thống backend với kiến trúc microservices, xử lý hàng triệu request mỗi ngày."
      }
    ],
    technology: [
      {
        id: 1,
        title: "Senior Frontend Developer",
        department: "Technology",
        type: "Full-time",
        location: "Hồ Chí Minh",
        experience: "3-5 years",
        salary: "$1500 - $2000",
        skills: ["React", "TypeScript", "Next.js", "Vue.js"],
        description: "Chúng tôi đang tìm kiếm Senior Frontend Developer có kinh nghiệm để tham gia vào đội ngũ phát triển sản phẩm core."
      },
      {
        id: 2,
        title: "Backend Engineer (Node.js)",
        department: "Technology",
        type: "Full-time",
        location: "Hà Nội",
        experience: "2-4 years",
        salary: "$1200 - $1800",
        skills: ["Node.js", "MongoDB", "Redis", "Docker"],
        description: "Tham gia phát triển hệ thống backend với kiến trúc microservices, xử lý hàng triệu request mỗi ngày."
      }
    ],
    design: [
      {
        id: 3,
        title: "UI/UX Designer",
        department: "Design",
        type: "Full-time",
        location: "Remote",
        experience: "2+ years",
        salary: "$1000 - $1500",
        skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
        description: "Thiết kế trải nghiệm người dùng cho các sản phẩm công nghệ hàng đầu của chúng tôi."
      }
    ],
    product: [
      {
        id: 5,
        title: "Product Manager",
        department: "Product",
        type: "Full-time",
        location: "Hà Nội",
        experience: "4+ years",
        salary: "$1800 - $2500",
        skills: ["Product Strategy", "Data Analysis", "Agile", "Stakeholder Management"],
        description: "Định hướng chiến lược sản phẩm và dẫn dắt team phát triển các tính năng mới."
      }
    ]
  };

  return (
    <div className={`recruitment-page ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Hero Section - Video Full Hero */}
      <section className="recruitment-hero">
        {/* Background Video */}
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
          <div className="hero-overlay"></div>
        </div>

        {/* Content */}
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Cùng Chúng Tôi Kiến Tạo Tương Lai</h1>
            <p className="hero-subtitle">
              Tham gia vào đội ngũ những người tiên phong, nơi ý tưởng của bạn được trân trọng 
              và phát triển thành những sản phẩm công nghệ hàng đầu
            </p>
            <div className="hero-actions">
              <button 
                className="btn-primary"
                onClick={() => scrollToSection('positions-section')}
              >
                Xem Vị Trí Tuyển Dụng
              </button>
              <button 
                className="btn-secondary"
                onClick={() => scrollToSection('contact-section')}
              >
                Gửi CV Ứng Tuyển
              </button>
            </div>
          </div>
          
          {/* YouTube Video Side */}
          <div className="hero-video-side">
            <div className="video-wrapper">
              <iframe
                className="video-frame"
                src="https://www.youtube.com/embed/AZCccvYmurM?rel=0&modestbranding=1&autoplay=1&mute=1&loop=1&playlist=AZCccvYmurM"
                title="Giới thiệu môi trường làm việc Hitek"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="container">
          <h2 className="section-title">Hành Trình Của Chúng Tôi</h2>
          <p className="section-subtitle">
            Từ những bước đi đầu tiên đến vị thế hiện tại - cùng nhìn lại chặng đường phát triển đầy tự hào
          </p>
          
          <div className="timeline-grid">
            {timelineData.map((item, index) => (
              <div key={index} className="timeline-card">
                <div className="timeline-year">{item.year}</div>
                <div className="timeline-content">
                  <h3 className="timeline-title">{item.title}</h3>
                  <p className="timeline-description">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <h2 className="section-title">Phúc Lợi Tại Hitek</h2>
          <p className="section-subtitle">
            Chúng tôi tin rằng những nhân tài xứng đáng nhận được điều kiện làm việc tốt nhất
          </p>
          
          <div className="benefits-grid">
            {benefitsData.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-icon">{benefit.icon}</div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Positions Section */}
      <section className="positions-section" id="positions-section">
        <div className="container">
          <h2 className="section-title">Vị Trí Đang Tuyển Dụng</h2>
          <p className="section-subtitle">
            Khám phá cơ hội nghề nghiệp và cùng chúng tôi tạo ra những sản phẩm công nghệ xuất sắc
          </p>
          
          {/* Filter Tabs */}
          <div className="positions-filter">
            <button 
              className={`filter-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              Tất Cả
            </button>
            <button 
              className={`filter-btn ${activeTab === 'technology' ? 'active' : ''}`}
              onClick={() => setActiveTab('technology')}
            >
              Công Nghệ
            </button>
            <button 
              className={`filter-btn ${activeTab === 'design' ? 'active' : ''}`}
              onClick={() => setActiveTab('design')}
            >
              Thiết Kế
            </button>
            <button 
              className={`filter-btn ${activeTab === 'product' ? 'active' : ''}`}
              onClick={() => setActiveTab('product')}
            >
              Sản Phẩm
            </button>
          </div>
          
          {/* Positions Grid */}
          <div className="positions-grid">
            {positionsData[activeTab].map((position) => (
              <div key={position.id} className="position-card">
                <div className="position-header">
                  <h3 className="position-title">{position.title}</h3>
                  <span className="position-department">{position.department}</span>
                </div>
                
                <div className="position-meta">
                  <div className="meta-item">
                    <i className="fas fa-briefcase"></i>
                    <span>{position.type}</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{position.location}</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-clock"></i>
                    <span>{position.experience}</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-dollar-sign"></i>
                    <span>{position.salary}</span>
                  </div>
                </div>
                
                <p className="position-description">{position.description}</p>
                
                <div className="position-skills">
                  {position.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
                
                <div className="position-actions">
                  <button 
                    className="btn-apply"
                    onClick={() => scrollToSection('contact-section')}
                  >
                    Ứng Tuyển Ngay
                  </button>
                  <button className="btn-details">Xem Chi Tiết</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section - FORM ĐÃ SỬA */}
<section className="contact-section" id="contact-section">
  <div className="container">
    <h2 className="section-title">Ứng Tuyển Ngay</h2>
    <p className="section-subtitle">
      Gửi CV của bạn và cùng chúng tôi kiến tạo tương lai
    </p>
    
    <div className="contact-content">
      <div className="contact-info">
        <h3>Thông Tin Liên Hệ</h3>
        <div className="contact-item first-item">
          <i className="fas fa-envelope"></i>
          <div>
            <strong>Email:</strong>
            <span>careers@hitek.com.vn</span>
          </div>
        </div>
        <div className="contact-item">
          <i className="fas fa-phone"></i>
          <div>
            <strong>Điện thoại:</strong>
            <span>+84 28 9999 8888</span>
          </div>
        </div>
        <div className="contact-item">
          <i className="fas fa-map-marker-alt"></i>
          <div>
            <strong>Địa chỉ:</strong>
            <span>123 Nguyễn Văn Linh, Quận 7, TP.HCM</span>
          </div>
        </div>
      </div>
      
      {/* 🆕 FORM TUYỂN DỤNG VỚI CHỨC NĂNG GỬI MAIL */}
      <div className="contact-form">
        <h3>Gửi CV Ứng Tuyển</h3>
        <form onSubmit={handleApplicationSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Họ và tên *</label>
              <input 
                type="text" 
                name="name"
                placeholder="Nguyễn Văn A" 
                value={applicationForm.name}
                onChange={handleApplicationChange}
                required 
                className={applicationErrors.name ? 'error' : ''}
              />
              {applicationErrors.name && (
                <span className="error-text">{applicationErrors.name}</span>
              )}
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input 
                type="email" 
                name="email"
                placeholder="your@email.com" 
                value={applicationForm.email}
                onChange={handleApplicationChange}
                required 
                className={applicationErrors.email ? 'error' : ''}
              />
              {applicationErrors.email && (
                <span className="error-text">{applicationErrors.email}</span>
              )}
            </div>
          </div>

          {/* 🎯 HÀNG 2: SỐ ĐIỆN THOẠI + VỊ TRÍ ỨNG TUYỂN */}
          <div className="form-row">
            <div className="form-group">
              <label>Số điện thoại *</label>
              <input 
                type="tel" 
                name="phone"
                placeholder="091 234 5678" 
                value={applicationForm.phone}
                onChange={handleApplicationChange}
                required 
                className={applicationErrors.phone ? 'error' : 'phone-input'}
              />
              {applicationErrors.phone && (
                <span className="error-text">
                  ⚠️ {applicationErrors.phone}
                </span>
              )}
              <div className="phone-counter">
                {applicationForm.phone.replace(/\s/g, '').length}/10-11 số
                {applicationForm.phone && !applicationErrors.phone && (
                  <span className="phone-valid">✓ Hợp lệ</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Vị trí ứng tuyển *</label>
              <select 
                name="position"
                value={applicationForm.position}
                onChange={handleApplicationChange}
                required
                className={applicationErrors.position ? 'error' : ''}
              >
                <option value="">Chọn vị trí</option>
                <option value="Senior Frontend Developer">Senior Frontend Developer</option>
                <option value="Backend Engineer">Backend Engineer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Product Manager">Product Manager</option>
              </select>
              {applicationErrors.position && (
                <span className="error-text">{applicationErrors.position}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Tin nhắn (Optional)</label>
            <textarea 
              name="message"
              placeholder="Giới thiệu ngắn về bản thân và kinh nghiệm..." 
              rows="4"
              value={applicationForm.message}
              onChange={handleApplicationChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Tải lên CV *</label>
            <div className={`file-upload ${applicationErrors.cv ? 'error' : ''}`}>
              <input 
                type="file" 
                name="cv"
                accept=".pdf,.doc,.docx" 
                onChange={handleApplicationChange}
                required 
              />
              <span>
                {applicationForm.cv ? applicationForm.cv.name : 'Chọn file CV (PDF, DOC, DOCX)'}
              </span>
            </div>
            {applicationErrors.cv && (
              <span className="error-text">{applicationErrors.cv}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="btn-submit"
            disabled={applicationLoading}
          >
            {applicationLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang gửi...
              </span>
            ) : (
              '📨 Gửi Đơn Ứng Tuyển'
            )}
          </button>
        </form>
      </div>
    </div>
  </div>
</section>
    </div>
  );
};

export default Recruitment;