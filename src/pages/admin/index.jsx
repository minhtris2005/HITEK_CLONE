// src/pages/admin/index.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'

const AdminDashboard = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quản lý Dự án</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Quản lý portfolio dự án</p>
            <Link to="/admin/projects">
              <Button>Quản lý Dự án</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thống kê</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Xem thống kê website</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cài đặt</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Cài đặt hệ thống</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard