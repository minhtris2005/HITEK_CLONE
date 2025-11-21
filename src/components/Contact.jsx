import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { supabase } from '@/lib/supabase';
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const validationTimeoutRef = useRef(null);

  // 🆕 HÀM FORMAT SỐ ĐIỆN THOẠI
  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
    if (numbers.length <= 8) return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 10)}`;
  };

  // 🆕 REAL-TIME VALIDATION CHO TỪNG FIELD
  const validateField = (name, value) => {
    const trimmedValue = value.trim();
    
    switch (name) {
      case 'name':
        if (!trimmedValue) return 'Họ tên là bắt buộc';
        if (trimmedValue.length < 2) return 'Tên phải có ít nhất 2 ký tự';
        if (trimmedValue.length > 50) return 'Tên quá dài (tối đa 50 ký tự)';
        if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(trimmedValue)) return 'Tên chỉ được chứa chữ cái và khoảng trắng';
        return '';
        
      case 'email':
        if (!trimmedValue) return 'Email là bắt buộc';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) return 'Email không hợp lệ';
        if (trimmedValue.length > 100) return 'Email quá dài';
        return '';
        
      case 'phone':
        if (!trimmedValue) return 'Số điện thoại là bắt buộc';
        const cleanPhone = trimmedValue.replace(/[\s\-()]/g, '');
        if (!/^(0|\+84|84)[3|5|7|8|9][0-9]{8}$/.test(cleanPhone)) {
          return 'Số điện thoại Việt Nam không hợp lệ (ví dụ: 0912345678)';
        }
        return '';
        
      case 'message':
        if (!trimmedValue) return 'Nội dung là bắt buộc';
        if (trimmedValue.length < 10) return 'Nội dung phải có ít nhất 10 ký tự';
        if (trimmedValue.length > 1000) return 'Nội dung quá dài (tối đa 1000 ký tự)';
        return '';
        
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // 🆕 AUTO-FORMAT SỐ ĐIỆN THOẠI
    let processedValue = value;
    if (name === 'phone') {
      processedValue = formatPhoneNumber(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    
    // 🆕 XÓA LỖI HIỆN TẠI KHI USER BẮT ĐẦU NHẬP
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // 🆕 REAL-TIME VALIDATION SAU KHI USER NGỪNG GÕ 500ms
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }
    
    validationTimeoutRef.current = setTimeout(() => {
      const error = validateField(name, processedValue);
      setErrors(prev => ({ 
        ...prev, 
        [name]: error 
      }));
    }, 500);
  };

  // 🆕 VALIDATION TOÀN BỘ FORM KHI SUBMIT
  const validateForm = () => {
    const newErrors = {};
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedMessage = formData.message.trim();
    
    // Validate từng field
    newErrors.name = validateField('name', trimmedName);
    newErrors.email = validateField('email', trimmedEmail);
    newErrors.phone = validateField('phone', trimmedPhone);
    newErrors.message = validateField('message', trimmedMessage);
    
    // Xóa các field không có lỗi
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) {
        delete newErrors[key];
      }
    });
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 🆕 VALIDATION TRƯỚC KHI GỬI
    console.log('🔍 Đang kiểm tra dữ liệu...');
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      console.log('❌ Dữ liệu không hợp lệ:', formErrors);
      setErrors(formErrors);
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }
    
    console.log('✅ Dữ liệu hợp lệ, bắt đầu gửi...');
    setLoading(true);

    try {
      console.log('🚀 Bắt đầu gửi liên hệ...');

      // 📧 BƯỚC 1: GỬI EMAIL QUA SUPABASE FUNCTION
      console.log('📧 Đang gửi email...');
      const emailResponse = await fetch(
        'https://dqkuvmsvhazyrtursbnc.functions.supabase.co/send-email', 
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            to: 'phamnguyenminhtri249@gmail.com',
            subject: `Liên hệ từ ${formData.name} - Hitek Website`,
            message: `
              THÔNG TIN LIÊN HỆ:
              ────────────────
              👤 Họ tên: ${formData.name}
              📧 Email: ${formData.email}
              📞 Điện thoại: ${formData.phone || 'Không có'}

              📝 Nội dung:
              ${formData.message}

              ────────────────
              Gửi từ website Hitek Clone
            `,
            customerEmail: formData.email,
            customerName: formData.name
          })
        }
      );

      const result = await emailResponse.json();
      console.log('📦 Email response:', result);

      if (!emailResponse.ok) {
        throw new Error(result.error || 'Gửi email thất bại');
      }

      console.log('✅ Gửi email thành công!');

      // 🗄️ BƯỚC 2: LƯU VÀO DATABASE
      console.log('💾 Đang lưu vào database...');
      
      const { data: dbData, error: dbError } = await supabase
        .from('contact_messages')
        .insert([{ 
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
          created_at: new Date().toISOString()
        }])
        .select();

      if (dbError) {
        console.error('❌ Lỗi database:', dbError);
        toast.warning("Tin nhắn đã gửi! Có lỗi nhỏ khi lưu dữ liệu.");
      } else {
        console.log('✅ Lưu database thành công!');
      }

      // ✅ THÀNH CÔNG
      toast.success("Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất.");
      setFormData({ name: '', email: '', phone: '', message: '' });
      setErrors({});

    } catch (error) {
      console.error('💥 Lỗi tổng thể:', error);
      toast.error("Có lỗi xảy ra! Vui lòng thử lại sau.");
    } finally {
      console.log('🏁 Kết thúc quá trình gửi form');
      setLoading(false);
    }
  };

  // 🆕 HÀM LẤY CLASS CSS CHO INPUT
  const getInputClass = (fieldName) => {
    const baseClass = "h-12 transition-colors duration-200";
    if (errors[fieldName]) {
      return `${baseClass} border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200`;
    }
    if (formData[fieldName].trim()) {
      return `${baseClass} border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-200`;
    }
    return baseClass;
  };

  // 🆕 HÀM LẤY CLASS CSS CHO TEXTAREA
  const getTextareaClass = () => {
    const baseClass = "min-h-[150px] transition-colors duration-200";
    if (errors.message) {
      return `${baseClass} border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200`;
    }
    if (formData.message.trim()) {
      return `${baseClass} border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-200`;
    }
    return baseClass;
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container mx-auto px-4">
        <div className="contact-header">
          <h2 className="contact-title">
            Liên hệ với chúng tôi
          </h2>
          <p className="contact-subtitle">
            Sẵn sàng bắt đầu dự án của bạn? Hãy để lại thông tin, chúng tôi sẽ liên hệ ngay
          </p>
        </div>

        <div className="contact-grid">
          <div>
            <h3 className="contact-form-title">Gửi tin nhắn</h3>
            <form onSubmit={handleSubmit} className="contact-form">
              {/* FIELD HỌ TÊN */}
              <div>
                <Input 
                  name="name"
                  placeholder="Họ và tên *" 
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={getInputClass('name')}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.name}
                  </p>
                )}
                <div className="text-right text-sm text-gray-500 mt-1">
                  {formData.name.length}/50 ký tự
                </div>
              </div>

              {/* FIELD EMAIL */}
              <div>
                <Input 
                  name="email"
                  type="email"
                  placeholder="Email *" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={getInputClass('email')}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.email}
                  </p>
                )}
                <div className="text-right text-sm text-gray-500 mt-1">
                  {formData.email.length}/100 ký tự
                </div>
              </div>

              {/* FIELD SỐ ĐIỆN THOẠI */}
              <div>
                <Input 
                  name="phone"
                  type="tel"
                  placeholder="Số điện thoại * (ví dụ: 091 234 5678)" 
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className={getInputClass('phone')}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.phone}
                  </p>
                )}
                <div className="text-right text-sm text-gray-500 mt-1">
                  {formData.phone.replace(/\s/g, '').length}/10 số
                </div>
              </div>

              {/* FIELD NỘI DUNG */}
              <div>
                <Textarea 
                  name="message"
                  placeholder="Nội dung tin nhắn *" 
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className={getTextareaClass()}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.message}
                  </p>
                )}
                <div className="text-right text-sm text-gray-500 mt-1">
                  {formData.message.length}/1000 ký tự
                </div>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full mt-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang gửi...
                  </span>
                ) : (
                  '📨 Gửi tin nhắn'
                )}
              </Button>
            </form>
          </div>

          {/* PHẦN THÔNG TIN LIÊN HỆ */}
          <div>
            <h3 className="contact-info-title">Thông tin liên hệ</h3>
            <div className="contact-info-list">
              <div className="contact-info-item contact-address-row">
                <div className="contact-info-icon">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div className="contact-address-container">
                  <div className="contact-address-item">
                    <h4 className="contact-info-label">Địa chỉ(VN)</h4>
                    <p className="contact-info-text">
                      Lầu 6, Tòa nhà Hải Âu<br />
                      39B Đường Trường Sơn, Quận Tân Bình<br />
                      TP. Hồ Chí Minh
                    </p>
                  </div>
                  <div className="contact-address-item">
                    <h4 className="contact-info-label">Địa chỉ(KR)</h4>
                    <p className="contact-info-text">
                      Room 402, 4th floor, 12, Teheran-ro 70- gil<br />
                      Gangnam-gu, Seoul<br />
                      Republic of Korea
                    </p>
                  </div>
                  <div className="contact-address-item">
                    <h4 className="contact-info-label">Địa chỉ(JP)</h4>
                    <p className="contact-info-text">
                      5F, 3-7 Miyanomae<br />
                      Hiratsuka City, Kanagawa Prefecture<br />
                      Japan
                    </p>
                  </div>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="contact-info-label">Điện thoại</h4>
                  <p className="contact-info-text">
                    +84 28 999 59588
                  </p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="contact-info-label">Email</h4>
                  <p className="contact-info-text">
                    contact@hitek.com.vn
                  </p>
                </div>
              </div>

              <div className="contact-hours">
                <h4 className="contact-hours-label">Giờ làm việc</h4>
                <p className="contact-hours-text">
                  Thứ 2 - Thứ 6: 9:00 - 18:00<br />
                  Thứ 7 - Chủ nhật: Nghỉ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;