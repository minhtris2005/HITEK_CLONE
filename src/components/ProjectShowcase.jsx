// src/components/ProjectShowcase.jsx
import React, { useState, useEffect } from 'react'
import { projectService } from '../services'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'

const ProjectShowcase = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const data = await projectService.getPublicProjects(6)
      setProjects(data)
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Đang tải dự án...</div>
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Dự Án Nổi Bật</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              {project.featured_image && (
                <img 
                  src={project.featured_image} 
                  alt={project.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <CardHeader>
                <CardTitle className="text-xl">{project.title}</CardTitle>
                {project.client_name && (
                  <p className="text-gray-600">Khách hàng: {project.client_name}</p>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {project.tech_stack?.slice(0, 3).map((tech, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Chưa có dự án nào. Hãy thêm dự án đầu tiên trong admin!
          </div>
        )}
      </div>
    </section>
  )
}

export default ProjectShowcase