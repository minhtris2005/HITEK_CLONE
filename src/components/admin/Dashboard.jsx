import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import './Dashboard.css'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    publishedProjects: 0,
    featuredProjects: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // Lấy tất cả projects từ Supabase
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching projects:', error)
        throw error
      }

      console.log('Projects from Supabase:', projects)
      
      const totalProjects = projects?.length || 0
      const publishedProjects = projects?.filter(p => p.is_published).length || 0
      const featuredProjects = projects?.filter(p => p.is_featured).length || 0

      setStats({
        totalProjects,
        publishedProjects,
        featuredProjects
      })
    } catch (error) {
      console.error('Error loading stats:', error)
      // Fallback data nếu có lỗi
      setStats({
        totalProjects: 0,
        publishedProjects: 0,
        featuredProjects: 0
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-wrapper">
          <div className="dashboard-loading">
            <div className="dashboard-loading-spinner"></div>
            <div>Đang tải thống kê...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">Quản lý nội dung website của bạn</p>
        </div>
        
        {/* Stats Cards */}
        <div className="dashboard-stats">
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-header">
              <h3 className="dashboard-stat-title">Tổng Dự Án</h3>
              <div className="dashboard-stat-icon dashboard-stat-icon-blue">
                📁
              </div>
            </div>
            <div className="dashboard-stat-content">
              <div className="dashboard-stat-value">{stats.totalProjects}</div>
              <p className="dashboard-stat-description">Tất cả dự án trong hệ thống</p>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-header">
              <h3 className="dashboard-stat-title">Dự Án Đã Xuất Bản</h3>
              <div className="dashboard-stat-icon dashboard-stat-icon-green">
                🌐
              </div>
            </div>
            <div className="dashboard-stat-content">
              <div className="dashboard-stat-value">{stats.publishedProjects}</div>
              <p className="dashboard-stat-description">Đang hiển thị công khai</p>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-header">
              <h3 className="dashboard-stat-title">Dự Án Nổi Bật</h3>
              <div className="dashboard-stat-icon dashboard-stat-icon-yellow">
                ⭐
              </div>
            </div>
            <div className="dashboard-stat-content">
              <div className="dashboard-stat-value">{stats.featuredProjects}</div>
              <p className="dashboard-stat-description">Đánh dấu là nổi bật</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-actions">
          <div className="dashboard-action-card">
            <h3 className="dashboard-action-title">
              <span className="dashboard-action-icon">📊</span>
              Quản lý Dự Án
            </h3>
            <p className="dashboard-action-text">Thêm, sửa, xóa các dự án portfolio</p>
            <Link to="/admin/projects" className="dashboard-action-btn dashboard-action-btn-primary">
              Quản lý Dự Án
            </Link>
          </div>

          <div className="dashboard-action-card">
            <h3 className="dashboard-action-title">
              <span className="dashboard-action-icon">➕</span>
              Thêm Dự Án Mới
            </h3>
            <p className="dashboard-action-text">Tạo dự án mới cho portfolio</p>
            <Link to="/admin/projects/new" className="dashboard-action-btn dashboard-action-btn-outline dashboard-action-btn-green">
              + Thêm Dự Án
            </Link>
          </div>

          <div className="dashboard-action-card">
            <h3 className="dashboard-action-title">
              <span className="dashboard-action-icon">📱</span>
              Xem Website
            </h3>
            <p className="dashboard-action-text">Xem trang chủ với dự án đã thêm</p>
            <Link to="/projects" className="dashboard-action-btn dashboard-action-btn-outline dashboard-action-btn-purple">
              👁️ Xem Dự Án
            </Link>
          </div>
        </div>

        {/* Recent Projects Summary */}
        <div className="dashboard-summary">
          <h3 className="dashboard-summary-title">
            <span>📋</span>
            Tổng Quan Dự Án
          </h3>
          
          {stats.totalProjects === 0 ? (
            <div className="dashboard-empty">
              <div className="dashboard-empty-icon">📁</div>
              <h4 className="dashboard-empty-title">Chưa có dự án nào</h4>
              <p className="dashboard-empty-text">Hãy bắt đầu bằng cách thêm dự án đầu tiên!</p>
              <Link to="/admin/projects/new" className="dashboard-summary-btn">
                + Thêm Dự Án Đầu Tiên
              </Link>
            </div>
          ) : (
            <div className="dashboard-summary-content">
              <div className="dashboard-summary-stats">
                <div className="dashboard-summary-stat">
                  <span className="dashboard-summary-stat-label">Tổng số dự án:</span>
                  <span className="dashboard-summary-stat-value dashboard-summary-stat-value-blue">
                    {stats.totalProjects}
                  </span>
                </div>
                <div className="dashboard-summary-stat">
                  <span className="dashboard-summary-stat-label">Đã xuất bản:</span>
                  <span className="dashboard-summary-stat-value dashboard-summary-stat-value-green">
                    {stats.publishedProjects}
                  </span>
                </div>
                <div className="dashboard-summary-stat">
                  <span className="dashboard-summary-stat-label">Nổi bật:</span>
                  <span className="dashboard-summary-stat-value dashboard-summary-stat-value-yellow">
                    {stats.featuredProjects}
                  </span>
                </div>
              </div>
              <div className="dashboard-summary-action">
                <Link to="/admin/projects" className="dashboard-summary-btn">
                  📊 Xem Chi Tiết Tất Cả Dự Án
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard