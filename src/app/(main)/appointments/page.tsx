'use client'

import { Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/page-header'
import { useFetchAppointments } from './hooks/useFetchAppointment'
import { transformAppointmentData } from './helpers'
import { AppointmentCard } from '@/components/appointment-card'

export default function PatientAppointmentsPage() {
  const { data, isPending, isError, error, refetch } = useFetchAppointments()

  // Transform the data for AppointmentCard
  const appointments =
    data?.result?.map((booking) => transformAppointmentData(booking)) || []

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        icon={<Calendar />}
        title="My Appointments"
        backLink="/doctors"
        backLabel="Find Doctors"
      />

      <Card className="border-primary-900/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary-400" />
            Your Scheduled Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading appointments...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-8">
              <p className="text-red-400">
                Error: {error instanceof Error ? error.message : 'Failed to load appointments'}
              </p>
            </div>
          ) : appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  userRole="PATIENT"
                  refetchAppointments={refetch}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-xl font-medium text-white mb-2">No appointments scheduled</h3>
              <p className="text-muted-foreground">
                You haven&apos;t booked any appointments yet. Browse available doctors to get
                started.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
