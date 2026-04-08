'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PendingDoctors } from './components/pending-doctors'
import { VerifiedDoctors } from './components/verified-doctors'
import { PendingPayouts } from './components/pending-payouts'
import { ShieldCheck } from 'lucide-react'

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="h-8 w-8" />
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage doctors, verify credentials, and approve payouts
        </p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending Doctors</TabsTrigger>
          <TabsTrigger value="doctors">Verified Doctors</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="border-none p-0 mt-6">
          <PendingDoctors />
        </TabsContent>

        <TabsContent value="doctors" className="border-none p-0 mt-6">
          <VerifiedDoctors />
        </TabsContent>

        <TabsContent value="payouts" className="border-none p-0 mt-6">
          <PendingPayouts />
        </TabsContent>
      </Tabs>
    </div>
  )
}
