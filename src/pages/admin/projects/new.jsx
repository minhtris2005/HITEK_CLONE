// src/pages/admin/projects/new.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import ProjectForm from '../../../components/admin/ProjectForm'

const NewProject = () => {
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate('/admin/projects')
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Thêm Dự án Mới</h1>
        <p className="text-gray-600">Thêm dự án mới vào portfolio</p>
      </div>
      
      <ProjectForm onSuccess={handleSuccess} />
    </div>
  )
}

export default NewProject