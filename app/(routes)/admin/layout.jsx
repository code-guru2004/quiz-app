import React from 'react'
import Sidebar from './_components/Sidebar'

function AdminLayout({children}) {
  return (
    <div className="flex">
    <Sidebar />
    <main className="ml-64 flex-1 p-6 bg-gray-100 dark:bg-gray-800 min-h-screen">
      {children}
    </main>
  </div>
  )
}

export default AdminLayout