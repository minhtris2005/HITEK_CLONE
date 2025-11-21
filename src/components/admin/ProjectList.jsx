import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Link } from "react-router-dom";
import "./ProjectList.css";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else setProjects(data || []);
    setLoading(false);
  }

  async function deleteProject(id) {
    if (!confirm("Bạn có chắc muốn xóa dự án này?")) return;

    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) alert("Lỗi: " + error.message);
    else {
      alert("✅ Đã xóa dự án thành công!");
      fetchProjects();
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { className: "project-list-badge project-list-badge-status-completed", label: "✅ Hoàn thành" },
      "in-progress": { className: "project-list-badge project-list-badge-status-in-progress", label: "🔄 Đang làm" },
      planned: { className: "project-list-badge project-list-badge-status-planned", label: "📅 Kế hoạch" }
    };
    
    const config = statusConfig[status] || statusConfig.completed;
    return <span className={config.className}>{config.label}</span>;
  };

  const getFeaturedBadge = (isFeatured) => {
    return isFeatured ? (
      <span className="project-list-badge project-list-badge-featured">⭐ Nổi bật</span>
    ) : null;
  };

  const getPublishedBadge = (isPublished) => {
    const className = isPublished 
      ? "project-list-badge project-list-badge-published"
      : "project-list-badge project-list-badge-private";
    
    const label = isPublished ? "🌐 Công khai" : "🔒 Riêng tư";
    
    return <span className={className}>{label}</span>;
  };

  const formatDate = (project) => {
    const date = project.updated_at || project.created_at;
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('vi-VN');
    
    if (project.updated_at && project.updated_at !== project.created_at) {
      return (
        <div className="project-list-date">
          <div>{formattedDate}</div>
          <div className="project-list-date-updated">(Đã cập nhật)</div>
        </div>
      );
    }
    
    return <div className="project-list-date">{formattedDate}</div>;
  };

  if (loading) {
    return (
      <div className="project-list-container">
        <div className="project-list-wrapper">
          <div className="project-list-card">
            <div className="project-list-loading">Đang tải dự án...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-list-container">
      <div className="project-list-wrapper">
        <div className="project-list-card">
          {/* Header */}
          <div className="project-list-header">
            <div className="project-list-header-content">
              <h1 className="project-list-title">📊 Quản lý Dự Án</h1>
              <p className="project-list-subtitle">
                Quản lý tất cả dự án trong portfolio của bạn
              </p>
            </div>
            <Link to="/admin/projects/new" className="project-list-add-btn">
              <span>➕</span>
              Thêm Dự Án Mới
            </Link>
          </div>

          {/* Table */}
          <div className="project-list-content">
            {projects.length === 0 ? (
              <div className="project-list-empty">
                <div className="project-list-empty-icon">📁</div>
                <h3 className="project-list-empty-title">Chưa có dự án nào</h3>
                <p className="project-list-empty-text">
                  Hãy bắt đầu bằng cách thêm dự án đầu tiên!
                </p>
                <Link to="/admin/projects/new" className="project-list-add-btn">
                  <span>➕</span>
                  Thêm Dự Án Đầu Tiên
                </Link>
              </div>
            ) : (
              <div className="project-list-table-container">
                <table className="project-list-table">
                  <thead className="project-list-thead">
                    <tr>
                      <th className="project-list-th" style={{ minWidth: "300px" }}>
                        Dự Án
                      </th>
                      <th className="project-list-th" style={{ whiteSpace: "nowrap" }}>
                        Trạng thái
                      </th>
                      <th className="project-list-th" style={{ whiteSpace: "nowrap" }}>
                        Xuất bản
                      </th>
                      <th className="project-list-th" style={{ whiteSpace: "nowrap", minWidth: "140px" }}>
                        Ngày cập nhật
                      </th>
                      <th className="project-list-th project-list-th-center" style={{ whiteSpace: "nowrap", minWidth: "150px" }}>
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="project-list-tbody">
                    {projects.map((project) => (
                      <tr key={project.id}>
                        {/* Project Column */}
                        <td className="project-list-td">
                          <div className="project-list-project-cell">
                            {project.featured_image && (
                              <img 
                                src={project.featured_image} 
                                alt={project.title}
                                className="project-list-image"
                              />
                            )}
                            <div className="project-list-project-info">
                              <div className="project-list-project-title">
                                {project.title}
                              </div>
                              <div className="project-list-project-slug">
                                {project.slug}
                              </div>
                              {project.client_name && (
                                <div className="project-list-client">
                                  👤 {project.client_name}
                                </div>
                              )}
                              {getFeaturedBadge(project.is_featured)}
                            </div>
                          </div>
                        </td>

                        {/* Status Column */}
                        <td className="project-list-td project-list-td-middle">
                          {getStatusBadge(project.status)}
                        </td>

                        {/* Published Column */}
                        <td className="project-list-td project-list-td-middle">
                          {getPublishedBadge(project.is_published)}
                        </td>

                        {/* Date Column */}
                        <td className="project-list-td project-list-td-middle">
                          {formatDate(project)}
                        </td>

                        {/* Actions Column */}
                        <td className="project-list-td project-list-td-middle">
                          <div className="project-list-actions">
                            <Link
                              to={`/admin/projects/edit/${project.id}`}
                              className="project-list-btn project-list-btn-edit"
                            >
                              <span>✏️</span>
                              Sửa
                            </Link>
                            <button
                              onClick={() => deleteProject(project.id)}
                              className="project-list-btn project-list-btn-delete"
                            >
                              <span>🗑️</span>
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Summary */}
            {projects.length > 0 && (
              <div className="project-list-summary">
                <div className="project-list-summary-content">
                  <span className="project-list-summary-text">
                    Hiển thị <strong>{projects.length}</strong> dự án
                  </span>
                  <Link to="/admin" className="project-list-summary-link">
                    ← Quay lại Dashboard
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}