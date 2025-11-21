import { Brain, Boxes, Code, TestTube, Rocket, Wrench, MessageSquare, Sparkles, Github, Terminal, Cloud, Database, Shield, Activity, AlertCircle, Zap } from "lucide-react";
import "./AIProcess.css";

const AIProcess = () => {
  const processes = [
    {
      icon: Brain,
      title: "Phân tích yêu cầu",
      description: "Hiểu rõ nhu cầu và mục tiêu của dự án",
      aiTools: [
        { name: "ChatGPT", icon: MessageSquare },
        { name: "Claude AI", icon: Sparkles },
        { name: "Gemini", icon: Zap },
        { name: "Perplexity", icon: Brain }
      ]
    },
    {
      icon: Boxes,
      title: "Thiết kế hệ thống",
      description: "Xây dựng kiến trúc và thiết kế giải pháp",
      aiTools: [
        { name: "Figma AI", icon: Boxes },
        { name: "v0.dev", icon: Code },
        { name: "Uizard", icon: Sparkles },
        { name: "Galileo AI", icon: Brain }
      ]
    },
    {
      icon: Code,
      title: "Lập trình (Coding)",
      description: "Phát triển code với sự hỗ trợ của AI",
      aiTools: [
        { name: "GitHub Copilot", icon: Github },
        { name: "Cursor", icon: Terminal },
        { name: "Tabnine", icon: Code },
        { name: "Codeium", icon: Zap }
      ]
    },
    {
      icon: TestTube,
      title: "Kiểm thử phần mềm",
      description: "Đảm bảo chất lượng và tìm lỗi tự động",
      aiTools: [
        { name: "TestRigor", icon: TestTube },
        { name: "Applitools", icon: Activity },
        { name: "Mabl", icon: Shield },
        { name: "Functionize", icon: AlertCircle }
      ]
    },
    {
      icon: Rocket,
      title: "Triển khai (Deploy)",
      description: "Đưa sản phẩm lên môi trường production",
      aiTools: [
        { name: "Vercel AI", icon: Rocket },
        { name: "Railway", icon: Cloud },
        { name: "Netlify", icon: Zap },
        { name: "AWS AI", icon: Database }
      ]
    },
    {
      icon: Wrench,
      title: "Bảo trì & vận hành",
      description: "Giám sát và cải thiện hệ thống liên tục",
      aiTools: [
        { name: "DataDog AI", icon: Activity },
        { name: "New Relic", icon: Shield },
        { name: "Sentry", icon: AlertCircle },
        { name: "PagerDuty", icon: Wrench }
      ]
    }
  ];

  return (
    <section id="ai-process" className="ai-process-section">
      <div className="container mx-auto px-4">
        <div className="ai-process-header">
          <h2 className="ai-process-title">
            Quy trình ứng dụng AI
          </h2>
          <p className="ai-process-subtitle">
            Tận dụng sức mạnh của AI trong từng bước phát triển phần mềm
          </p>
        </div>

        <div className="ai-process-grid">
          {processes.map((process, index) => {
            const Icon = process.icon;
            return (
              <div 
                key={index}
                className="ai-process-card"
              >
                <div className="ai-process-icon-wrapper">
                  <div className="ai-process-icon">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <span className="ai-process-number">{index + 1}</span>
                </div>
                
                <h3 className="ai-process-card-title">{process.title}</h3>
                <p className="ai-process-card-description">{process.description}</p>
                
                <div className="ai-tools-grid">
                  {process.aiTools.map((tool, toolIndex) => {
                    const ToolIcon = tool.icon;
                    return (
                      <div key={toolIndex} className="ai-tool-item">
                        <ToolIcon className="ai-tool-icon" />
                        <span className="ai-tool-name">{tool.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="ai-process-cta">
          <div className="ai-process-cta-content">
            <h3 className="ai-process-cta-title">Sẵn sàng chuyển đổi số với AI?</h3>
            <p className="ai-process-cta-text">
              Hãy để chúng tôi đồng hành cùng bạn trong hành trình ứng dụng AI vào doanh nghiệp
            </p>
            <button className="ai-process-cta-button">
              Tư vấn ngay
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIProcess;
