import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./Technology.css";

const Technology = () => {
  const [activeCategory, setActiveCategory] = useState("mobile");

  const technologies = {
    mobile: {
      title: "Mobile App",
      icon: "fa-mobile-screen-button",
      items: [
        { name: "Flutter", icon: "fa-brands fa-flutter", color: "#02569B" },
        { name: "React Native", icon: "fa-brands fa-react", color: "#61DAFB" },
        { name: "Android Native", icon: "fa-brands fa-android", color: "#3DDC84" },
        { name: "iOS Native", icon: "fa-brands fa-apple", color: "#000000" }
      ]
    },
    frontend: {
      title: "Front-end",
      icon: "fa-desktop",
      items: [
        { name: "ReactJS", icon: "fa-brands fa-react", color: "#61DAFB" },
        { name: "VueJS", icon: "fa-brands fa-vuejs", color: "#4FC08D" },
        { name: "Angular", icon: "fa-brands fa-angular", color: "#DD0031" },
        { name: "PHP", icon: "fa-brands fa-php", color: "#777BB4" }
      ]
    },
    backend: {
      title: "Back-end",
      icon: "fa-server",
      items: [
        { name: "NodeJS", icon: "fa-brands fa-node-js", color: "#339933" },
        { name: "Spring Boot", icon: "fa-brands fa-java", color: "#6DB33F" },
        { name: "Python", icon: "fa-brands fa-python", color: "#3776AB" },
        { name: "Golang", icon: "fa-brands fa-golang", color: "#00ADD8" }
      ]
    },
    game: {
      title: "Game 2D/3D",
      icon: "fa-gamepad",
      items: [
        { name: "Unity", icon: "fa-brands fa-unity", color: "#000000" },
        { name: "Cocos", icon: "fa-solid fa-fire", color: "#55C2E6" },
        { name: "HTML5", icon: "fa-brands fa-html5", color: "#E34F26" }
      ]
    },
    shopping: {
      title: "Shopping Mall",
      icon: "fa-shopping-cart",
      items: [
        { name: "Shopify", icon: "fa-brands fa-shopify", color: "#96BF48" },
        { name: "React Native", icon: "fa-brands fa-react", color: "#61DAFB" },
        { name: "Shopby", icon: "fa-regular fa-message", color: "#FF6B6B" }
      ]
    },
    blockchain: {
      title: "Blockchain",
      icon: "fa-coins",
      items: [
        { name: "NFT", icon: "fa-solid fa-square-nfi", color: "#8247E5" },
        { name: "Dapp", icon: "fa-brands fa-bitcoin", color: "#627EEA" },
        { name: "Defi", icon: "fa-solid fa-globe", color: "#00D395" }
      ]
    }
  };

  const categories = Object.keys(technologies);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="tech-page">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="tech-header">
            <h1 className="tech-title">
              Công nghệ chúng tôi sử dụng
            </h1>
            <p className="tech-subtitle">
              Khám phá các công nghệ hiện đại mà chúng tôi áp dụng để tạo ra những sản phẩm xuất sắc
            </p>
          </div>

          {/* Category Navigation */}
          <div className="tech-nav">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`tech-nav-item ${activeCategory === category ? 'active' : ''}`}
              >
                <i className={`fa-solid ${technologies[category].icon}`}></i>
                <span>{technologies[category].title}</span>
              </button>
            ))}
          </div>

          {/* Technology Cards */}
          <div className="tech-content">
            <div className="tech-grid">
              {technologies[activeCategory].items.map((tech, index) => (
                <div 
                  key={index} 
                  className="tech-card"
                  style={{ '--tech-color': tech.color }}
                >
                  <div className="tech-card-icon">
                    <i className={`${tech.icon}`}></i>
                  </div>
                  <h3 className="tech-card-name">{tech.name}</h3>
                  <div className="tech-card-shine"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Technology;
