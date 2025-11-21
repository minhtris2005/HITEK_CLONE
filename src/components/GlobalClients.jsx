import { useTheme } from "next-themes";
import "./GlobalClients.css";
import ahappi from "@/assets/customer/ahappi.png";
import ajoo from "@/assets/customer/ajoo.png";
import busan from "@/assets/customer/busan.png";
import huyndai from "@/assets/customer/huyndai.png";
import korea1 from "@/assets/customer/image-11.png";
import korea2 from "@/assets/customer/image-19.png";
import innoex from "@/assets/customer/innoex.png";
import reatrip from "@/assets/customer/reatrip.png";
import seegene from "@/assets/customer/seegene.png";
import woojoo from "@/assets/customer/woojoo.png";

const GlobalClients = () => {
  const { theme } = useTheme();

  const brands = [
    { id: 1, name: "ahappi", logo: ahappi },
    { id: 2, name: "ajoo", logo: ajoo, needsFix: true }, // Thêm flag needsFix
    { id: 3, name: "busan", logo: busan },
    { id: 4, name: "huyndai", logo: huyndai },
    { id: 5, name: "korea1", logo: korea1, needsFix: true }, // Thêm flag needsFix
    { id: 6, name: "korea2", logo: korea2 },
    { id: 7, name: "innoex", logo: innoex },
    { id: 8, name: "reatrip", logo: reatrip },
    { id: 9, name: "seegene", logo: seegene },
    { id: 10, name: "woojoo", logo: woojoo }
  ];

  // Các vị trí điểm chớp trên bản đồ (tọa độ %)
  const pulsePoints = [
    { id: 1, top: '44%', left: '26%' },  // Bắc Mỹ
    { id: 2, top: '27%', left: '27%' },  // Bắc Mỹ
    { id: 3, top: '35%', left: '50%' },  // Châu Âu
    { id: 4, top: '47%', left: '76%' },  // Trung Đông
    { id: 5, top: '40%', left: '78%' },  // Châu Á
    { id: 6, top: '59%', left: '72%' },  // Đông Nam Á
    { id: 7, top: '80%', left: '80%' }, // Châu Úc
  ];

  return (
    <section id="clients" className={`clients-section ${theme === 'dark' ? 'dark' : 'light'}`}>
      <div className="container mx-auto px-4">
        <div className="clients-header">
          <h2 className="clients-title">Khách hàng toàn cầu</h2>
          <p className="clients-subtitle">
            Đồng hành cùng các thương hiệu hàng đầu thế giới
          </p>
        </div>

        <div className="clients-content">
          {/* Map Section với các điểm chớp */}
          <div className="map-section">
            <div className="map-container">
              <img 
                src="https://hitek.com.vn/wp-content/uploads/2024/09/map-1-1.png" 
                alt="Bản đồ khách hàng toàn cầu"
                className="global-map"
              />
              
              {/* Các điểm chớp trên bản đồ */}
              <div className="pulse-points">
                {pulsePoints.map((point) => (
                  <div
                    key={point.id}
                    className="pulse-point"
                    style={{
                      top: point.top,
                      left: point.left,
                      animationDelay: `${point.id * 0.2}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Brands Grid */}
          <div className="brands-section">
            <h3 className="brands-title">Đối tác & Khách hàng</h3>
            <div className="brands-grid">
              {brands.map((brand) => (
                <div key={brand.id} className="brand-card">
                  <div className="brand-logo-container">
                    <img 
                      src={brand.logo} 
                      alt={brand.name}
                      className={`brand-logo ${brand.needsFix ? 'dark-fix' : ''}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalClients;