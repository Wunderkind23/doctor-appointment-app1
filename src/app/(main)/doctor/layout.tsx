import { Stethoscope } from 'lucide-react'
import { PageHeader } from '@/components/page-header'

export const metadata = {
  title: 'Doctor Dashboard - Babcock Health',
  description: 'Manage your appointments and availability',
}

interface DoctorDashboardLayoutProps {
  children: React.ReactNode
}

export default function DoctorDashboardLayout({ children }: DoctorDashboardLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader icon={<Stethoscope />} title="Doctor Dashboard" />
      {children}
    </div>
  )
}
