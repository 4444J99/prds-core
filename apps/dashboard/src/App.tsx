import { Routes, Route, NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Layout } from './components/Layout'
import { DashboardPage } from './pages/DashboardPage'
import { ProspectsPage } from './pages/ProspectsPage'
import { ProspectDetailPage } from './pages/ProspectDetailPage'
import { DealsPage } from './pages/DealsPage'
import { DocumentsPage } from './pages/DocumentsPage'
import { SettingsPage } from './pages/SettingsPage'
import { LoginPage } from './pages/LoginPage'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Toaster } from 'sonner'

const navigation = [
  { name: 'Dashboard', href: '/', icon: 'dashboard' },
  { name: 'Prospects', href: '/prospects', icon: 'search' },
  { name: 'Deals', href: '/deals', icon: 'kanban' },
  { name: 'Documents', href: '/documents', icon: 'file' },
  { name: 'Settings', href: '/settings', icon: 'settings' }
]

function PrivateRoutes() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <Layout navigation={navigation}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/prospects" element={<ProspectsPage />} />
        <Route path="/prospects/:id" element={<ProspectDetailPage />} />
        <Route path="/deals" element={<DealsPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Layout>
  )
}

export function App() {
  return (
    <AuthProvider>
      <PrivateRoutes />
      <Toaster position="top-right" />
    </AuthProvider>
  )
}