import { Globe, Network, User} from "lucide-react";
import "./About.css";

const About = () => {
  const values = [
    {
      icon: User,
      title: "Trưởng phòng quản lý dự án là người Hàn Quốc, đảm bảo chất lượng của từng dự án",
      description: "Một quy trình nghiêm ngặt được thiết lập ngay từ đầu dưới sự giám sát của Trưởng phòng quản lý dự án. Quy trình này được áp dụng cho tất cả các dự án, đảm bảo tiến độ dự án được duy trì tối ưu.​"
    },
    {
      icon: Network,
      title: "Chúng tôi luôn có sự phối hợp tuyệt vời",
      description: "Để đảm bảo quá trình triển khai dự án diễn ra suôn sẻ, minh bạch và chính xác, đội ngũ của Hitek bao gồm các Quản lý dự án thông thạo tiếng Hàn. Họ có thể truyền đạt nhanh chóng và chính xác thông tin từ Trưởng phòng PM đến các phòng ban liên quan. Sự hòa hợp về văn hóa giữa hai quốc gia đã giúp chúng tôi hiểu và làm việc hiệu quả hơn với nhau."
    },
    {
      icon: Globe,
      title: "Khách hàng có thể hoàn toàn yên tâm khi làm việc với Quản lý tại Hàn Quốc",
      description: "Tại Hitek, khách hàng chỉ cần làm việc với Quản lý người Hàn Quốc để hiểu được chất lượng và tiến độ của dự án, thay vì phải làm việc trực tiếp với toàn bộ nhóm người Hàn Quốc. Điều này rút ngắn đáng kể thời gian giao tiếp giữa khách hàng và nhóm phát triển ứng dụng, không gây bất tiện cho khách hàng."
    }
  ];

  return (
    <section id="about" className="about-section">
      <div className="container mx-auto px-4">
        <div className="about-header">
          <h2 className="about-title">
            Làm việc linh hoạt với
            <span className="about-title-highlight"> Hitek Software</span>
          </h2>
          <p className="about-subtitle">
            Hitek là công ty phần mềm quốc tế với đội ngũ quản lý người Hàn Quốc và đội ngũ kỹ sư chuyên nghiệp tại Việt Nam. Đội ngũ người Hàn Quốc giám sát quản lý và phát triển quy trình, góp phần vào sự tăng trưởng và thành công ổn định của Hitek Software thông qua quản lý chặt chẽ và tiêu chuẩn chuyên môn cao.
          </p>
        </div>

        <div className="about-values">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div 
                key={index}
                className="about-value-card"
              >
                <div className="about-value-icon">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="about-value-title">{value.title}</h3>
                <p className="about-value-description">{value.description}</p>
              </div>
            );
          })}
        </div>

        <div className="about-story">
          <div className="about-story-grid">
            <div>
              <h3 className="about-story-title">
                Thành tựu của chúng tôi
              </h3>
              <p className="about-story-text">
                Cảm ơn sự tin tưởng của
              </p>
              <p className="about-story-text">
                Khách hàng
              </p>
            </div>
            <div className="about-stats">
              <div className="about-stat">
                <div className="about-stat-number">06+</div>
                <div className="about-stat-label">Nhiều năm kinh nghiệm đã mang lại cho chúng 
                  tôi kiến ​​thức sâu rộng về nhiều ngành, cho phép chúng tôi cung cấp giải pháp trải nghiệm số tốt nhất cho khách hàng.</div>
              </div>
              <div className="about-stat">
                <div className="about-stat-number">80+</div>
                <div className="about-stat-label">Hơn 80 khách hàng toàn cầu từ khắp nơi trên
                   thế giới, bao gồm Hàn Quốc, Nhật Bản, Canada, Úc và nhiều nơi khác.</div>
              </div>
              <div className="about-stat">
                <div className="about-stat-number">100+</div>
                <div className="about-stat-label">Các dự án hoàn thành cho khách hàng, mang lại trải nghiệm chuyển đổi số vượt trội.</div>
              </div>
              <div className="about-stat">
                <div className="about-stat-number">100+</div>
                <div className="about-stat-label">Đội ngũ tài năng bao gồm một số chuyên gia
                   kỹ thuật số, nhà tư duy chiến lược, nhà thiết kế và nhà phát triển sáng tạo nhất trong ngành.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
