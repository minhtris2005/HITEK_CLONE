// src/services/storageService.js
import { supabase } from '../lib/supabase'

export const storageService = {
  async uploadImage(file, folder = 'projects') {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    const { data, error } = await supabase.storage
      .from('project-images')
      .upload(filePath, file)

    if (error) throw error

    // Lấy public URL
    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath)

    return publicUrl
  },

  async uploadMultipleImages(files, folder = 'projects') {
    const uploadPromises = files.map(file => this.uploadImage(file, folder))
    return Promise.all(uploadPromises)
  },

  async deleteImage(filePath) {
    const { error } = await supabase.storage
      .from('project-images')
      .remove([filePath])

    if (error) throw error
  }
}