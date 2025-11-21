import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate, useParams } from "react-router-dom";
import "./ProjectForm.css";

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(!!id);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    featured_image: "",
    gallery: [],
    tech_stack: [],
    category: "Web Development", // Thêm field category với giá trị mặc định
    client_name: "",
    project_url: "",
    github_url: "",
    start_date: "",
    end_date: "",
    status: "completed",
    is_featured: false,
    is_published: true,
  });

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  async function fetchProject() {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        const formatDateForInput = (dateString) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        };

        setForm({
          title: data.title || "",
          slug: data.slug || "",
          description: data.description || "",
          content: data.content || "",
          featured_image: data.featured_image || "",
          gallery: data.gallery || [],
          tech_stack: data.tech_stack || [],
          category: data.category || "Web Development", // Thêm category
          client_name: data.client_name || "",
          project_url: data.project_url || "",
          github_url: data.github_url || "",
          start_date: formatDateForInput(data.start_date),
          end_date: formatDateForInput(data.end_date),
          status: data.status || "completed",
          is_featured: data.is_featured || false,
          is_published: data.is_published !== undefined ? data.is_published : true,
        });
      }
    } catch (err) {
      console.error("Error fetching project:", err);
      alert("Lỗi khi tải dữ liệu: " + err.message);
    } finally {
      setFormLoading(false);
    }
  }

  // Upload image function
  const uploadImage = async (file, folder = 'projects') => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      console.log('Uploading file:', file.name, 'to:', filePath);

      const { data, error } = await supabase.storage
        .from('project-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error details:', error);
        throw error;
      }

      console.log('Upload successful:', data);

      const { data: urlData } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      console.log('Public URL:', urlData.publicUrl);
      return urlData.publicUrl;

    } catch (error) {
      console.error('Upload failed:', error);
      throw new Error(`Upload thất bại: ${error.message}`);
    }
  };

  // Xử lý upload ảnh đại diện
  const handleFeaturedImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước ảnh không được vượt quá 5MB!');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const imageUrl = await uploadImage(file, 'featured');
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setForm(prev => ({ ...prev, featured_image: imageUrl }));
      
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);

    } catch (error) {
      setUploading(false);
      setUploadProgress(0);
      alert('Lỗi upload ảnh: ' + error.message);
    }
  };

  // Xử lý upload nhiều ảnh
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (files.length + form.gallery.length > 10) {
      alert('Tối đa 10 ảnh cho gallery!');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = files.map(async (file, index) => {
        if (!file.type.startsWith('image/')) {
          throw new Error(`File ${file.name} không phải là ảnh!`);
        }

        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`Ảnh ${file.name} vượt quá 5MB!`);
        }

        return await uploadImage(file, 'gallery');
      });

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const uploadedUrls = await Promise.all(uploadPromises);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      setForm(prev => ({
        ...prev,
        gallery: [...prev.gallery, ...uploadedUrls]
      }));

      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);

    } catch (error) {
      setUploading(false);
      setUploadProgress(0);
      alert('Lỗi upload ảnh: ' + error.message);
    }
  };

  // Xóa ảnh khỏi gallery
  const removeGalleryImage = (index) => {
    setForm(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    if (type === 'featured' && files.length === 1) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      const dt = new DataTransfer();
      dt.items.add(files[0]);
      input.files = dt.files;
      handleFeaturedImageUpload({ target: input });
    } else if (type === 'gallery') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = true;
      const dt = new DataTransfer();
      files.forEach(file => dt.items.add(file));
      input.files = dt.files;
      handleGalleryUpload({ target: input });
    }
  };

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleArrayChange(name, value) {
    setForm(prev => ({
      ...prev,
      [name]: value.split(",").map((v) => v.trim()).filter(v => v),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = {
        ...form,
        updated_at: new Date().toISOString(),
      };

      if (id) {
        const { error } = await supabase
          .from("projects")
          .update(formData)
          .eq("id", id);
        
        if (error) throw error;
        alert("✅ Cập nhật dự án thành công!");
      } else {
        const { error } = await supabase
          .from("projects")
          .insert([formData]);
        
        if (error) throw error;
        alert("✅ Tạo dự án thành công!");
      }
      navigate("/admin/projects");
    } catch (err) {
      console.error("Submit error:", err);
      alert("❌ Lỗi: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  if (formLoading) {
    return (
      <div className="project-form-container">
        <div className="project-form-wrapper">
          <div className="project-form-card">
            <div className="project-form-loading">
              <div>Đang tải dữ liệu dự án...</div>
              <div>ID: {id}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-form-container">
      <div className="project-form-wrapper">
        <div className="project-form-card">
          <div className="project-form-header">
            <h1 className="project-form-title">
              {id ? "✏️ Chỉnh sửa Dự Án" : "➕ Thêm Dự Án Mới"}
            </h1>
            <p className="project-form-subtitle">
              {id ? `Đang chỉnh sửa dự án ID: ${id}` : "Tạo dự án mới cho portfolio"}
            </p>
          </div>

          <div className="project-form-content">
            <form className="project-form" onSubmit={handleSubmit}>
              {/* Basic Information - ĐÃ THÊM CATEGORY */}
              <div className="project-form-grid project-form-grid-2">
                <div className="project-form-group">
                  <label className="project-form-label project-form-label-required">
                    Tiêu đề
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Nhập tiêu đề dự án"
                    className="project-form-input"
                    required
                  />
                </div>

                <div className="project-form-group">
                  <label className="project-form-label project-form-label-required">
                    Danh mục
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="project-form-select"
                    required
                  >
                    <option value="Web Development">🌐 Web Development</option>
                    <option value="Mobile App">📱 Mobile App</option>
                    <option value="E-commerce">🛒 E-commerce</option>
                    <option value="AI Solution">🤖 AI Solution</option>
                    <option value="Business Solution">💼 Business Solution</option>
                    <option value="Backend Development">⚙️ Backend Development</option>
                    <option value="Other">🔧 Other</option>
                  </select>
                </div>
              </div>

              {/* Slug */}
              <div className="project-form-group">
                <label className="project-form-label project-form-label-required">
                  Slug
                </label>
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="ten-du-an"
                  className="project-form-input"
                  required
                />
                <p className="project-form-help-text">URL-friendly version của tiêu đề</p>
              </div>

              {/* Description */}
              <div className="project-form-group">
                <label className="project-form-label">Mô tả ngắn</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Mô tả ngắn gọn về dự án..."
                  rows="3"
                  className="project-form-textarea"
                />
              </div>

              {/* Content */}
              <div className="project-form-group">
                <label className="project-form-label">Nội dung đầy đủ</label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  placeholder="Mô tả chi tiết về dự án, công nghệ sử dụng, tính năng..."
                  rows="6"
                  className="project-form-textarea project-form-textarea-large"
                />
              </div>

              {/* Ảnh đại diện */}
              <div className="project-form-group">
                <label className="project-form-label">Ảnh đại diện</label>
                
                <div 
                  className="project-form-upload-area"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'featured')}
                  onClick={() => document.getElementById('featured-upload').click()}
                >
                  <div className="project-form-upload-icon">📁</div>
                  <p className="project-form-upload-text">
                    Kéo thả ảnh vào đây hoặc click để chọn
                  </p>
                  <button type="button" className="project-form-upload-btn">
                    Chọn ảnh
                  </button>
                  <input
                    id="featured-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFeaturedImageUpload}
                    className="project-form-file-input"
                  />
                </div>

                {uploading && (
                  <div className="project-form-upload-progress">
                    <div 
                      className="project-form-upload-progress-bar"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}

                {form.featured_image && (
                  <div className="project-form-preview-container">
                    <img 
                      src={form.featured_image} 
                      alt="Preview" 
                      className="project-form-featured-preview"
                    />
                    <p className="project-form-preview-text">Ảnh đại diện</p>
                  </div>
                )}
              </div>

              {/* Gallery */}
              <div className="project-form-group">
                <label className="project-form-label">Thư viện ảnh dự án</label>
                
                <div 
                  className="project-form-upload-area"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'gallery')}
                  onClick={() => document.getElementById('gallery-upload').click()}
                >
                  <div className="project-form-upload-icon">🖼️</div>
                  <p className="project-form-upload-text">
                    Kéo thả nhiều ảnh vào đây hoặc click để chọn
                  </p>
                  <button type="button" className="project-form-upload-btn">
                    Chọn nhiều ảnh
                  </button>
                  <input
                    id="gallery-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                    className="project-form-file-input"
                  />
                </div>

                {form.gallery.length > 0 && (
                  <div className="project-form-gallery">
                    {form.gallery.map((url, index) => (
                      <div key={index} className="project-form-gallery-item">
                        <img 
                          src={url} 
                          alt={`Gallery ${index + 1}`}
                          className="project-form-gallery-img"
                        />
                        <button
                          type="button"
                          className="project-form-gallery-remove"
                          onClick={() => removeGalleryImage(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Client & URLs */}
              <div className="project-form-grid project-form-grid-2">
                <div className="project-form-group">
                  <label className="project-form-label">Tên khách hàng</label>
                  <input
                    name="client_name"
                    value={form.client_name}
                    onChange={handleChange}
                    placeholder="Tên công ty/khách hàng"
                    className="project-form-input"
                  />
                </div>

                <div className="project-form-group">
                  <label className="project-form-label">Project URL</label>
                  <input
                    name="project_url"
                    value={form.project_url}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="project-form-input"
                  />
                </div>
              </div>

              {/* GitHub & Tech Stack */}
              <div className="project-form-grid project-form-grid-2">
                <div className="project-form-group">
                  <label className="project-form-label">GitHub URL</label>
                  <input
                    name="github_url"
                    value={form.github_url}
                    onChange={handleChange}
                    placeholder="https://github.com/username/repo"
                    className="project-form-input"
                  />
                </div>

                <div className="project-form-group">
                  <label className="project-form-label">Tech Stack</label>
                  <input
                    name="tech_stack"
                    value={form.tech_stack.join(", ")}
                    onChange={(e) => handleArrayChange("tech_stack", e.target.value)}
                    placeholder="React, Node.js, MongoDB, ..."
                    className="project-form-input"
                  />
                  <p className="project-form-help-text">Phân cách bằng dấu phẩy</p>
                </div>
              </div>

              {/* Dates */}
              <div className="project-form-grid project-form-grid-2">
                <div className="project-form-group">
                  <label className="project-form-label">Ngày bắt đầu</label>
                  <input
                    type="date"
                    name="start_date"
                    value={form.start_date || ""}
                    onChange={handleChange}
                    className="project-form-input"
                  />
                </div>

                <div className="project-form-group">
                  <label className="project-form-label">Ngày kết thúc</label>
                  <input
                    type="date"
                    name="end_date"
                    value={form.end_date || ""}
                    onChange={handleChange}
                    className="project-form-input"
                  />
                </div>
              </div>

              {/* Status & Settings */}
              <div className="project-form-grid project-form-grid-2">
                <div className="project-form-group">
                  <label className="project-form-label">Trạng thái</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="project-form-select"
                  >
                    <option value="completed">✅ Hoàn thành</option>
                    <option value="in-progress">🔄 Đang thực hiện</option>
                    <option value="planned">📅 Kế hoạch</option>
                  </select>
                </div>

                <div className="project-form-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="project-form-checkbox-group">
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={form.is_featured}
                      onChange={handleChange}
                      className="project-form-checkbox"
                    />
                    <label className="project-form-checkbox-label">
                      ⭐ Dự án nổi bật
                    </label>
                  </div>

                  <div className="project-form-checkbox-group">
                    <input
                      type="checkbox"
                      name="is_published"
                      checked={form.is_published}
                      onChange={handleChange}
                      className="project-form-checkbox"
                    />
                    <label className="project-form-checkbox-label">
                      🌐 Hiển thị công khai
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="project-form-actions">
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="project-form-btn project-form-btn-primary"
                >
                  {loading ? (
                    <>
                      <div className="project-form-spinner"></div>
                      Đang xử lý...
                    </>
                  ) : id ? (
                    "💾 Cập nhật Dự Án"
                  ) : (
                    "🚀 Tạo Dự Án Mới"
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate("/admin/projects")}
                  className="project-form-btn project-form-btn-outline"
                >
                  ↩️ Quay lại
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}