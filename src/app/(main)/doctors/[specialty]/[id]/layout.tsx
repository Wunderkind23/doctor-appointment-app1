export const metadata = {
  title: 'Doctor Details - Babcock Health',
  description: 'View doctor profile and book an appointment',
}

interface DoctorDetailLayoutProps {
  children: React.ReactNode
}

export default function DoctorDetailLayout({ children }: DoctorDetailLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">{children}</div>
    </div>
  )
}
