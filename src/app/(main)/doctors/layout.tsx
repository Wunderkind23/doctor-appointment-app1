export const metadata = {
  title: 'Find Doctors - Babcock Health',
  description: 'Browse and book appointments with top healthcare providers',
}

interface DoctorsLayoutProps {
  children: React.ReactNode
}

export default function DoctorsLayout({ children }: DoctorsLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">{children}</div>
    </div>
  )
}
