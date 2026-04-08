'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Loader2 } from 'lucide-react';
import { AppointmentCard } from '@/components/appointment-card';
import { useFetchAppointments } from '../../appointments/hooks/useFetchAppointment';
import { transformAppointmentData } from '../../appointments/helpers';

export default function DoctorAppointmentsList() {
  const { data, isPending, refetch } = useFetchAppointments();

  // Transform the data for AppointmentCard
  const appointments = data?.result?.map((booking) => transformAppointmentData(booking)) || [];

  return (
    <Card className="border-brand-900/20">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-brand-400" />
          Upcoming Appointments
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Card className="border-brand-900/20">
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
            </CardContent>
          </Card>
        ) : appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <AppointmentCard
                refetchAppointments={refetch}
                key={appointment.id}
                appointment={appointment}
                userRole="DOCTOR"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-xl font-medium text-foreground mb-2">No upcoming appointments</h3>
            <p className="text-muted-foreground">
              You don&apos;t have any scheduled appointments yet. Make sure you&apos;ve set your
              availability to allow patients to book.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
