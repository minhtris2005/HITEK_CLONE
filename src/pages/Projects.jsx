import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, ExternalLink, Github, Calendar, User, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState(['all']);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, selectedCategory]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Lấy dữ liệu từ Supabase
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_published', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      console.log('Dữ liệu từ Supabase:', data);
      setProjects(data || []);
      
      // Extract unique categories
      const uniqueCategories = ['all', ...new Set(data?.map(project => project.category).filter(Boolean) || [])];
      setCategories(uniqueCategories);
      
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu dự án:', error);
      setError('Không thể tải dữ liệu dự án. Vui lòng thử lại sau.');
      
      // Fallback data
      const mockProjects = getMockProjects();
      setProjects(mockProjects);
      const uniqueCategories = ['all', ...new Set(mockProjects.map(project => project.category))];
      setCategories(uniqueCategories);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.tech_stack?.some(tech => 
          tech.toLowerCase().includes(searchLower)
        ) ||
        (project.client_name && project.client_name.toLowerCase().includes(searchLower)) ||
        (project.category && project.category.toLowerCase().includes(searchLower))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    setFilteredProjects(filtered);
  };

  const getMockProjects = () => {
    return [
      {
        id: '1',
        title: 'Website Thương Mại Điện Tử ABC',
        description: 'Phát triển website thương mại điện tử với đầy đủ tính năng mua sắm và thanh toán.',
        featured_image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop',
        tech_stack: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe'],
        category: 'Web Development',
        client_name: 'Công ty ABC',
        project_url: 'https://example.com',
        github_url: 'https://github.com/example',
        is_featured: true,
        is_published: true,
        created_at: '2024-01-15T00:00:00.000Z'
      }
    ];
  };

  // Hàm lấy màu cho category badge
  const getCategoryColor = (category) => {
    const colorMap = {
      'Web Development': 'blue',
      'Mobile App': 'green', 
      'E-commerce': 'purple',
      'AI Solution': 'red',
      'Business Solution': 'orange',
      'Backend Development': 'indigo',
      'Other': 'gray'
    };
    return colorMap[category] || 'gray';
  };

  // Hàm lấy icon cho category
  const getCategoryIcon = (category) => {
    const iconMap = {
      'Web Development': '🌐',
      'Mobile App': '📱',
      'E-commerce': '🛒',
      'AI Solution': '🤖',
      'Business Solution': '💼',
      'Backend Development': '⚙️',
      'Other': '🔧'
    };
    return iconMap[category] || '🔧';
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="projects-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải dự án...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="projects-page">
        {/* Hero Section */}
        <section className="projects-hero">
          <div className="container">
            <h1 className="projects-title">Dự Án Của Chúng Tôi</h1>
            <p className="projects-subtitle">
              Khám phá những dự án tiêu biểu mà chúng tôi đã thực hiện với sự sáng tạo và công nghệ tiên tiến
            </p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="projects-filters">
          <div className="container">
            <div className="filters-container">
              <div className="search-box">
                <Search className="search-icon" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo tên, mô tả, công nghệ, khách hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="category-filters">
                <Filter className="filter-icon" />
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className="category-btn"
                  >
                    {category === 'all' ? 'Tất cả' : `${getCategoryIcon(category)} ${category}`}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Error Banner */}
        {error && (
          <div className="error-banner">
            <div className="container">
              <div className="error-content">
                <AlertCircle className="error-icon" />
                <span>{error}</span>
                <Button variant="outline" size="sm" onClick={fetchProjects}>
                  Thử lại
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        <section className="projects-grid-section">
          <div className="container">
            {filteredProjects.length === 0 ? (
              <div className="no-projects">
                <h3>Không tìm thấy dự án nào</h3>
                <p>Hãy thử tìm kiếm với từ khóa khác hoặc danh mục khác</p>
                {projects.length === 0 && !loading && (
                  <Button onClick={fetchProjects} className="retry-btn">
                    Tải lại dự án
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="projects-stats">
                  <h3>
                    Tìm thấy <span className="highlight">{filteredProjects.length}</span> dự án
                    {error && <span className="error-text"> (Dữ liệu mẫu)</span>}
                  </h3>
                </div>

                <div className="projects-grid">
                  {filteredProjects.map(project => {
                    const category = project.category || 'Other';
                    const categoryColor = getCategoryColor(category);
                    const categoryIcon = getCategoryIcon(category);
                    
                    return (
                      <Card key={project.id} className="project-card">
                        <div className="project-image-container">
                          <img
                            src={project.featured_image || 'https://images.unsplash.com/photo-1556656882-b068e8f3f241?w=500&h=300&fit=crop'}
                            alt={project.title}
                            className="project-image"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1556656882-b068e8f3f241?w=500&h=300&fit=crop';
                            }}
                          />
                          <div className="project-overlay">
                            <div className="project-actions">
                              {project.project_url && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="action-btn"
                                  onClick={() => window.open(project.project_url, '_blank')}
                                >
                                  <ExternalLink className="btn-icon" />
                                  Demo
                                </Button>
                              )}
                              {project.github_url && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="action-btn"
                                  onClick={() => window.open(project.github_url, '_blank')}
                                >
                                  <Github className="btn-icon" />
                                  Code
                                </Button>
                              )}
                            </div>
                          </div>
                          {project.is_featured && (
                            <Badge className="featured-badge">⭐ Nổi bật</Badge>
                          )}
                        </div>

                        <CardContent className="project-content">
                          <div className="project-meta">
                            <Badge 
                              variant="secondary" 
                              className={`project-category project-category-${categoryColor}`}
                            >
                              {categoryIcon} {category}
                            </Badge>
                            {project.created_at && (
                              <div className="project-date">
                                <Calendar className="date-icon" />
                                {new Date(project.created_at).toLocaleDateString('vi-VN', {
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </div>
                            )}
                          </div>

                          <h3 className="project-title">{project.title}</h3>

                          {project.client_name && (
                            <div className="project-client">
                              <User className="client-icon" />
                              <span>{project.client_name}</span>
                            </div>
                          )}

                          <p className="project-description">{project.description}</p>

                          {project.tech_stack && project.tech_stack.length > 0 && (
                            <div className="project-technologies">
                              {project.tech_stack.slice(0, 4).map((tech, index) => (
                                <span key={index} className="tech-tag">
                                  {tech}
                                </span>
                              ))}
                              {project.tech_stack.length > 4 && (
                                <span className="tech-tag-more">
                                  +{project.tech_stack.length - 4}
                                </span>
                              )}
                            </div>
                          )}

                          <div className="project-footer">
                            <Button className="view-details-btn" asChild>
                              <Link to={`/projects/${project.id}`}>
                                Xem chi tiết
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Projects;