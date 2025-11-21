// src/pages/admin/projects/edit/[id].jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { projectService } from '../../../../services'
import ProjectForm from '../../../../components/admin/ProjectForm'
import { toast } from '../../../../components/ui/use-toast'

const EditProject = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProject()
  }, [id])

  const loadProject = async () => {
    try {
      const data = await projectService.getProjectById(id)
      setProject(data)
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải dự án",
        variant: "destructive"
      })
      navigate('/admin/projects')
    } finally {
      setLoading(false)
    }
  }

  const handleSuccess = () => {
    navigate('/admin/projects')
  }

  if (loading) {
    return <div className="container mx-auto p-6">Đang tải...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Chỉnh sửa Dự án</h1>
        <p className="text-gray-600">Chỉnh sửa thông tin dự án</p>
      </div>
      
      <ProjectForm project={project} onSuccess={handleSuccess} />
    </div>
  )
}

export default EditProject