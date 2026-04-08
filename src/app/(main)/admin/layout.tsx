// 'use client'

// import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { AlertCircle, Users, CreditCard } from 'lucide-react'

// export default function AdminLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Vertical tabs on larger screens / Horizontal tabs on mobile */}
//       <Tabs defaultValue="pending" className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <TabsList className="md:col-span-1 bg-muted/30 border h-14 md:h-40 flex sm:flex-row md:flex-col w-full p-2 md:p-1 rounded-md md:space-y-2 sm:space-x-2 md:space-x-0">
//           <TabsTrigger
//             value="doctor"
//             className="flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full"
//           >
//             <AlertCircle className="h-4 w-4 mr-2 hidden md:inline" />
//             <span>Doctor Management</span>
//           </TabsTrigger>

//           <TabsTrigger
//             value="Patient Management"
//             className="flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full"
//           >
//             <Users className="h-4 w-4 mr-2 hidden md:inline" />
//             <span>Patient Management</span>
//           </TabsTrigger>
//         </TabsList>

//         <div className="md:col-span-3">{children}</div>
//       </Tabs>
//     </div>
//   )
// }

'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, Users } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const activeTab = pathname.includes('/patient') ? 'patient' : 'doctor'

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs value={activeTab} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <TabsList className="md:col-span-1 bg-muted/30 border h-14 md:h-40 flex sm:flex-row md:flex-col w-full p-2 md:p-1 rounded-md md:space-y-2 sm:space-x-2 md:space-x-0">
          <TabsTrigger
            value="doctor"
            onClick={() => router.push('/admin')}
            className="flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full"
          >
            <AlertCircle className="h-4 w-4 mr-2 hidden md:inline" />
            Doctor Management
          </TabsTrigger>

          <TabsTrigger
            value="patient"
            onClick={() => router.push('/admin/patient')}
            className="flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full"
          >
            <Users className="h-4 w-4 mr-2 hidden md:inline" />
            Patient Management
          </TabsTrigger>
        </TabsList>

        <div className="md:col-span-3">{children}</div>
      </Tabs>
    </div>
  )
}
