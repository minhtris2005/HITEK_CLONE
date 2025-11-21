import { useTheme } from "next-themes";
import "./Certifications.css";
import aws from "@/assets/certification/aws.png";
import cup from "@/assets/certification/cup.png";
import designrush from "@/assets/certification/designrush.png";
import hitek from "@/assets/certification/hitek.png";
import ibac from "@/assets/certification/ibac.png";
import iso from "@/assets/certification/iso.png";
import pmp from "@/assets/certification/pmp.png";
import iso2 from "@/assets/certification/iso2.png";

const Certifications = () => {
  const { theme } = useTheme();

  const certifications = [
    {
      id: 1,
      title: "AWS Partner",
      image: aws
    },
    {
      id: 2,
      title: "CUP Certification",
      image: cup
    },
    {
      id: 3,
      title: "DesignRush Award",
      image: designrush
    },
    {
      id: 4,
      title: "HiTek Certification",
      image: hitek
    },
    {
      id: 5,
      title: "IBAC Certified",
      image: ibac
    },
    {
      id: 6,
      title: "ISO 9001",
      image: iso
    },
    {
      id: 7,
      title: "ISO 27001",
      image: iso2
    },
    {
      id: 8,
      title: "PMP Certified",
      image: pmp
    }
  ];

  return (
    <section id="certifications" className={`certifications-section ${theme === 'dark' ? 'dark' : 'light'}`}>
      <div className="container mx-auto px-4">
        <div className="certifications-header">
          <h2 className="certifications-title">Chứng nhận & Giải thưởng</h2>
          <p className="certifications-subtitle">
            Những chứng nhận quốc tế khẳng định chất lượng và uy tín của chúng tôi
          </p>
        </div>

        <div className="certifications-grid">
          {certifications.map((cert) => (
            <div 
              key={cert.id}
              className="certification-card"
            >
              <div className="certification-image-container">
                <img 
                  src={cert.image} 
                  alt={cert.title}
                  className="certification-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="certification-fallback">
                  {cert.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;