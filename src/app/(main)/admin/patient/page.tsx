'use client'

import { Users } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MakeStudent } from '../components/Make-student'
import { StudentManagement } from '../components/Student-management'

export default function PatientManagementPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Users className="h-8 w-8" />
          Patient Management
        </h1>
        <p className="text-muted-foreground mt-2">Manage patients, activity, and accounts</p>
      </div>

      {/* add patient tabs or tables here */}
      <Tabs defaultValue="student" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="student">Student</TabsTrigger>
          <TabsTrigger value="make-student">External Patient</TabsTrigger>
        </TabsList>

        <TabsContent value="student" className="border-none p-0 mt-6">
          <StudentManagement />
        </TabsContent>

        <TabsContent value="make-student" className="border-none p-0 mt-6">
          <MakeStudent />
        </TabsContent>

        <TabsContent value="payouts" className="border-none p-0 mt-6">
          {/* {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading payouts...</div>
          ) : (
            <PendingPayouts payouts={payouts} />
          )} */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
