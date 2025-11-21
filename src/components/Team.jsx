import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Facebook } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import "./Team.css";
import s1 from "@/assets/team/s1.jpg";
import s2 from "@/assets/team/s2.png";
import s3 from "@/assets/team/s3.png";
import s4 from "@/assets/team/s4.png";

const Team = () => {
  const team = [
    {
      name: "Trần Anh Khôi",
      role: "Chủ tịch - Người sáng lập",
      image: s1,
      initials: "TAK",
      bio: "Với hơn 15 năm kinh nghiệm trong ngành công nghệ, anh Khôi đã dẫn dắt công ty đạt được nhiều thành tựu đáng tự hào.",
      email: "...",
      phone: "...",
      facebook: "https://facebook.com"
    },
    {
      name: "Oh Sean Beom",
      role: "Giám đốc kinh doanh tại Hàn Quốc",
      image: s2,
      initials: "TTB",
      bio: <>- 10+ năm kinh nghiệm phát triển mobile app/web.<br />
      - 5+ năm kinh nghiệm quản lý team, leadership.<br />
      - Đảm nhận trách nhiệm chính trong quản lý tiến độ, lên kế hoạch về timeline, budget, nhân sự.<br />
      - Quản lý team nước ngoài từ xa, lên kế hoạch phát triển bản thân cho nhân viên, quản lý khối lượng công việc, tổ chức các tài liệu kỹ thuật, phát triển dự án.<br />
      - Kinh nghiệm làm việc trong môi trường quốc tế: Nhật, Việt Nam, Hàn Quốc, Châu Âu</>,
      email: "...",
      phone: "...",
      facebook: "https://facebook.com"
    },
    {
      name: "Lê Quốc Vũ",
      role: "Giám đốc công nghệ công ty Hitek Software",
      image: s3,
      initials: "LVC",
      bio: <>- 7+ năm kinh nghiệm phát triển phần mềm và thiết kế hệ thống.<br />
      - 2+ năm kinh nghiệm trong thiết kế và triển khai hệ thống IOT, xây dựng bản mẫu.<br />
      - Cử nhân chuyên ngành kỹ thuật phần mềm.<br />
      - Tham gia viết các báo cáo khoa học công nghệ 2016.<br />
      - Giải nhất cuộc thi phần mềm mã nguồn mở 2015.<br />
      - Giải nhì cuộc thi lập trình quốc tế ACM/ICPC 2014.<br />
      - Chịu trách nhiệm xây dựng và thiết kế kiến trúc hệ thống phần mềm, định hướng kĩ thuật.</>,
      email: "...",
      phone: "...",
      facebook: "https://facebook.com"
    },
    {
      name: "Lâm Thứ Tiên",
      role: "GIám đốc công ty Hitek Capital",
      image: s4,
      initials: "PTD",
      bio: <>- Sáng lập và là Chủ tịch HĐQT Công ty cổ phần Đầu tư Công nghệ số Rồng Việt  (Rovi Group).<br />
      - Cổ đông sáng lập và Thành viên HĐQT Công ty cổ phần Công nghệ Mọi Người Cùng Vui.<br />
      - Từng đảm nhận vị trí Tổng giám đốc Công ty cổ phần đầu tư Thengroup.<br />
      - Từng đảm nhận vị trí Giám đốc thương mại Công ty TNHH Dịch vụ Mọi Người Cùng Vui.<br />
      - Từng là Nhà sáng lập và điều hành chuỗi hệ thống Điện thoại bình dân (2012).</>,
      email: "...",
      phone: "...",
      facebook: "https://facebook.com"
    }
  ];

  return (
    <section id="team" className="team-section">
      <div className="container mx-auto px-4">
        <div className="team-header">
          <h2 className="team-title">
            Đội ngũ của chúng tôi
          </h2>
          <p className="team-subtitle">
            Những con người tài năng đang làm nên sự khác biệt
          </p>
        </div>

        <div className="team-grid">
          {team.map((member, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <div className="team-card">
                  <div className="team-card-content">
                    <Avatar className="team-avatar">
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback className="team-avatar-fallback">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="team-member-name">{member.name}</h3>
                    <p className="team-member-role">{member.role}</p>
                  </div>
                  <div className="team-card-divider" />
                </div>
              </DialogTrigger>
              
              <DialogContent className="team-dialog">
                <div className="team-dialog-grid">
                  {/* Left side - Full Size Image and Facebook */}
                  <div className="team-dialog-left">
                    <div className="team-dialog-image-container">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="team-dialog-image"
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      className="team-facebook-btn"
                      onClick={() => window.open(member.facebook, '_blank')}
                    >
                      <Facebook className="h-5 w-5 mr-2" />
                      Facebook
                    </Button>
                  </div>
                  
                  {/* Right side - Info */}
                  <div className="team-dialog-right">
                    <div className="team-dialog-header">
                      <h2 className="team-dialog-name">{member.name}</h2>
                      <p className="team-dialog-role">{member.role}</p>
                    </div>
                    <div className="team-dialog-divider" />
                    <div className="team-dialog-content">
                      <p className="team-dialog-bio">{member.bio}</p>
                      <div className="team-dialog-contact">
                        <div className="team-dialog-contact-item">
                          <span className="team-dialog-label">Email:</span>
                          <span className="team-dialog-value">{member.email}</span>
                        </div>
                        <div className="team-dialog-contact-item">
                          <span className="team-dialog-label">Điện thoại:</span>
                          <span className="team-dialog-value">{member.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;