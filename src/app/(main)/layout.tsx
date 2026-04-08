import React from 'react'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <div className="max-w-7xl border mx-auto my-20 px-4 sm:px-6 lg:px-8">{children}</div>
}
