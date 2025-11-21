// src/services/projectService.js
import { supabase } from '../lib/supabase'

export const projectService = {
  // Lấy tất cả projects
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_categories (
          categories (*)
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Lấy project theo ID
  async getProjectById(id) {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_categories (
          categories (*)
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Lấy projects public (cho trang chủ)
  async getPublicProjects(limit = 6) {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_categories (
          categories (*)
        )
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  },

  // Tạo project mới
  async createProject(projectData, categoryIds = []) {
    // 1. Tạo project
    const { data: project, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single()

    if (error) throw error

    // 2. Thêm categories
    if (categoryIds.length > 0) {
      const projectCategories = categoryIds.map(categoryId => ({
        project_id: project.id,
        category_id: categoryId
      }))

      const { error: categoryError } = await supabase
        .from('project_categories')
        .insert(projectCategories)

      if (categoryError) throw categoryError
    }

    return project
  },

  // Cập nhật project
  async updateProject(id, projectData, categoryIds = []) {
    // 1. Update project
    const { data: project, error } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // 2. Update categories (nếu có)
    if (categoryIds !== undefined) {
      // Xóa categories cũ
      await supabase
        .from('project_categories')
        .delete()
        .eq('project_id', id)

      // Thêm categories mới
      if (categoryIds.length > 0) {
        const projectCategories = categoryIds.map(categoryId => ({
          project_id: id,
          category_id: categoryId
        }))

        const { error: categoryError } = await supabase
          .from('project_categories')
          .insert(projectCategories)

        if (categoryError) throw categoryError
      }
    }

    return project
  },

  // Xóa project
  async deleteProject(id) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}