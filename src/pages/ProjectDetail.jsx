import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, ExternalLink, Github, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('Không tìm thấy dự án');
      }

      setProject(data);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu dự án:', error);
      setError('Không thể tải thông tin dự án. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

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

  const formatDate = (dateString) => {
    if (!dateString) return 'Đang cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Gallery navigation functions
  const nextGallery = () => {
    if (project?.gallery?.length) {
      const maxStartIndex = Math.max(0, project.gallery.length - 3);
      setGalleryStartIndex(prev => 
        prev >= maxStartIndex ? 0 : prev + 1
      );
    }
  };

  const prevGallery = () => {
    if (project?.gallery?.length) {
      const maxStartIndex = Math.max(0, project.gallery.length - 3);
      setGalleryStartIndex(prev => 
        prev === 0 ? maxStartIndex : prev - 1
      );
    }
  };

  // Lightbox functions
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  const nextLightboxImage = () => {
    const allImages = [project.featured_image, ...(project.gallery || [])].filter(Boolean);
    setLightboxIndex((prev) => 
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevLightboxImage = () => {
    const allImages = [project.featured_image, ...(project.gallery || [])].filter(Boolean);
    setLightboxIndex((prev) => 
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        nextLightboxImage();
      } else if (e.key === 'ArrowLeft') {
        prevLightboxImage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="project-detail-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin dự án...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !project) {
    return (
      <>
        <Navbar />
        <div className="project-detail-error">
          <div className="error-container">
            <h2>Không tìm thấy dự án</h2>
            <p>{error || 'Dự án không tồn tại hoặc đã bị xóa.'}</p>
            <Button onClick={() => navigate('/projects')} className="back-btn">
              <ArrowLeft className="btn-icon" />
              Quay lại danh sách dự án
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const category = project.category || 'Other';
  const categoryColor = getCategoryColor(category);
  const categoryIcon = getCategoryIcon(category);
  const allImages = [project.featured_image, ...(project.gallery || [])].filter(Boolean);
  const displayedGalleryImages = project.gallery ? project.gallery.slice(galleryStartIndex, galleryStartIndex + 3) : [];

  return (
    <>
      <Navbar />
      <div className="project-detail-page">
        {/* Back Button */}
        <div className="project-detail-header">
          <div className="container">
            <Button variant="ghost" onClick={() => navigate('/projects')} className="back-btn">
              <ArrowLeft className="btn-icon" />
              Quay lại danh sách dự án
            </Button>
          </div>
        </div>

        {/* Project Content */}
        <div className="container">
          <div className="project-detail-content">
            {/* Main App Image */}
            {project.featured_image && (
              <div className="project-main-image-section">
                <div className="project-main-image">
                  <img
                    src={project.featured_image}
                    alt={project.title}
                    className="main-app-img"
                  />
                  
                  {/* Zoom Button */}
                  <button 
                    className="zoom-btn"
                    onClick={() => openLightbox(0)}
                    title="Phóng to ảnh"
                  >
                    <ZoomIn className="zoom-icon" />
                  </button>
                </div>
              </div>
            )}

            {/* Project Info */}
            <div className="project-info-section">
              <div className="project-info-header">
                <div className="project-meta">
                  <Badge className={`project-category project-category-${categoryColor}`}>
                    {categoryIcon} {category}
                  </Badge>
                  
                  <div className="project-dates">
                    {project.created_at && (
                      <div className="project-date">
                        <Calendar className="date-icon" />
                        Đăng ngày: {formatDate(project.created_at)}
                      </div>
                    )}
                  </div>
                </div>

                <h1 className="project-title">{project.title}</h1>

                {project.client_name && (
                  <div className="project-client">
                    <User className="client-icon" />
                    <span>Khách hàng: {project.client_name}</span>
                  </div>
                )}
              </div>

              {/* Project Actions */}
              <div className="project-actions">
                {project.project_url && (
                  <Button asChild className="project-action-btn">
                    <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="btn-icon" />
                      Xem Demo
                    </a>
                  </Button>
                )}
                {project.github_url && (
                  <Button variant="outline" asChild className="project-action-btn">
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                      <Github className="btn-icon" />
                      Mã Nguồn
                    </a>
                  </Button>
                )}
              </div>

              {/* Project Description */}
              <Card className="project-description-card">
                <CardContent>
                  <h3 className="description-title">Mô tả dự án</h3>
                  <div className="description-content">
                    {project.description ? (
                      <p>{project.description}</p>
                    ) : (
                      <p className="no-description">Chưa có mô tả chi tiết cho dự án này.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Full Content */}
              {project.content && (
                <Card className="project-content-card">
                  <CardContent>
                    <h3 className="content-title">Chi tiết dự án</h3>
                    <div className="content-text">
                      {project.content}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tech Stack */}
              {project.tech_stack && project.tech_stack.length > 0 && (
                <Card className="project-tech-card">
                  <CardContent>
                    <h3 className="tech-title">Công nghệ sử dụng</h3>
                    <div className="tech-stack">
                      {project.tech_stack.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="tech-badge">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Thư viện ảnh dự án với navigation */}
              {project.gallery && project.gallery.length > 0 && (
                <Card className="project-gallery-card">
                  <CardContent>
                    <div className="gallery-header">
                      <h3 className="gallery-title">Thư viện ảnh dự án</h3>
                      <p className="gallery-subtitle">Nhấn vào ảnh để phóng to</p>
                    </div>
                    
                    <div className="gallery-grid-container">
                      <div className="gallery-navigation">
                        <button 
                          className="gallery-nav-arrow gallery-prev-arrow"
                          onClick={prevGallery}
                          disabled={project.gallery.length <= 3}
                        >
                          <ChevronLeft className="gallery-arrow-icon" />
                        </button>
                        
                        <div className="gallery-grid">
                          {displayedGalleryImages.map((image, index) => (
                            <div 
                              key={galleryStartIndex + index} 
                              className="gallery-item"
                              onClick={() => openLightbox(galleryStartIndex + index + 1)}
                            >
                              <img
                                src={image}
                                alt={`Gallery image ${galleryStartIndex + index + 1}`}
                                className="gallery-grid-img"
                              />
                              <div className="gallery-overlay">
                                <ZoomIn className="gallery-zoom-icon" />
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <button 
                          className="gallery-nav-arrow gallery-next-arrow"
                          onClick={nextGallery}
                          disabled={project.gallery.length <= 3}
                        >
                          <ChevronRight className="gallery-arrow-icon" />
                        </button>
                      </div>
                      
                      <div className="gallery-counter">
                        {galleryStartIndex + 1}-{Math.min(galleryStartIndex + 3, project.gallery.length)} / {project.gallery.length}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Project Status */}
              {/* Project Status */}
<div className="project-status-info">
  <div className="status-item">
    <span className="status-label">Trạng thái:</span>
    <Badge variant={project.status === 'completed' ? 'default' : 'outline'}>
      {project.status === 'completed' ? '✅ Đã hoàn thành' : 
       project.status === 'in-progress' ? '🔄 Đang thực hiện' : '📅 Kế hoạch'}
    </Badge>
  </div>
  
  {project.is_featured && (
    <div className="status-item">
      <span className="status-label">Đánh giá:</span>
      <Badge 
        variant="default" 
        style={{
          background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
          color: 'white',
          border: 'none',
          fontWeight: '600'
        }}
      >
        ⭐ Dự án nổi bật
      </Badge>
    </div>
  )}
</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Lightbox Modal */}
      {lightboxOpen && allImages.length > 0 && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close-btn" onClick={closeLightbox}>
              <X className="close-icon" />
            </button>
            
            <div className="lightbox-image-container">
              <img
                src={allImages[lightboxIndex]}
                alt={`Lightbox image ${lightboxIndex + 1}`}
                className="lightbox-image"
              />
            </div>

            {allImages.length > 1 && (
              <>
                <button className="lightbox-nav-btn lightbox-prev-btn" onClick={prevLightboxImage}>
                  <ChevronLeft className="lightbox-nav-icon" />
                </button>
                <button className="lightbox-nav-btn lightbox-next-btn" onClick={nextLightboxImage}>
                  <ChevronRight className="lightbox-nav-icon" />
                </button>

                <div className="lightbox-indicator">
                  {lightboxIndex + 1} / {allImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectDetail;