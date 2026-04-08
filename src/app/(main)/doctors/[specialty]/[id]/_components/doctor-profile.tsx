// app/(main)/doctors/[id]/_components/doctor-profile.tsx

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  User,
  Calendar,
  Clock,
  Medal,
  FileText,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { SlotPicker } from './slot-picker';
import { AppointmentForm } from './appointment-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SingleDocAttributeI, TimeSlot } from '@/app/(main)/doctor/hooks/useFetchSingleDoc';

interface DoctorProfileProps {
  singleDoc: SingleDocAttributeI;
}

export function DoctorProfile({ singleDoc }: DoctorProfileProps) {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const router = useRouter();

  // Extract data from singleDoc
  const doctorName = `${singleDoc.user.firstName} ${singleDoc.user.lastName}`;
  const doctorImage = singleDoc.user.imageUrl;
  const specialty = singleDoc.specialization.replace(/-/g, ' ');
  const experience = singleDoc.yearsOfExperience;
  const bio = singleDoc.professionalBio;
  const rating = singleDoc.rating || 0;
  const availableDays = singleDoc.availability || [];

  const totalSlots = availableDays.reduce((total, day) => total + day.slots.length, 0);

  const toggleBooking = () => {
    setShowBooking(!showBooking);
    if (!showBooking) {
      setTimeout(() => {
        document.getElementById('booking-section')?.scrollIntoView({
          behavior: 'smooth',
        });
      }, 100);
    }
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleBookingComplete = () => {
    router.push('/appointments');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left column - Doctor Photo and Quick Info */}
      <div className="md:col-span-1">
        <div className="md:sticky md:top-24">
          <Card className="border-brand-900/20">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 bg-brand-900/20">
                  {doctorImage ? (
                    <Image src={doctorImage} alt={doctorName} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-16 w-16 text-brand-400" />
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-bold text-foreground mb-1">Dr. {doctorName}</h2>

                <Badge
                  variant="outline"
                  className="bg-brand-900/20 border-brand-900/30 text-brand-400 mb-2"
                >
                  {specialty}
                </Badge>

                {true && (
                  <div className="flex items-center gap-1 mb-4">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-white font-semibold">{rating.toFixed(1)}</span>
                    <span className="text-muted-foreground text-sm">/5</span>
                  </div>
                )}

                <div className="flex items-center justify-center mb-2">
                  <Medal className="h-4 w-4 text-brand-400 mr-2" />
                  <span className="text-muted-foreground">{experience} years experience</span>
                </div>

                <Button
                  onClick={toggleBooking}
                  className="w-full bg-brand-600 hover:bg-brand-700 mt-4  dark:text-white"
                >
                  {showBooking ? (
                    <>
                      Hide Booking
                      <ChevronUp className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Book Appointment
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right column - Doctor Details and Booking Section */}
      <div className="md:col-span-2 space-y-6">
        <Card className="border-brand-900/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground">
              About Dr. {doctorName}
            </CardTitle>
            <CardDescription>Professional background and expertise</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-brand-400" />
                <h3 className="text-foreground font-medium">Description</h3>
              </div>
              <p className="text-muted-foreground whitespace-pre-line">{bio}</p>
            </div>

            <Separator className="bg-brand-900/20" />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-brand-400" />
                <h3 className="text-foreground font-medium">Availability</h3>
              </div>
              {totalSlots > 0 ? (
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-brand-400 mr-2" />
                  <p className="text-muted-foreground">
                    {totalSlots} time slots available for booking over the next 4 days
                  </p>
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No available slots for the next 4 days. Please check back later.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Booking Section */}
        {showBooking && (
          <div id="booking-section">
            <Card className="border-brand-900/20">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">
                  Book an Appointment
                </CardTitle>
                <CardDescription>
                  Select a time slot and provide details for your consultation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {totalSlots > 0 ? (
                  <>
                    {!selectedSlot && (
                      <SlotPicker days={availableDays} onSelectSlot={handleSlotSelect} />
                    )}

                    {selectedSlot && (
                      <AppointmentForm
                        doctorId={singleDoc.id}
                        slot={selectedSlot}
                        onBack={() => setSelectedSlot(null)}
                        onComplete={handleBookingComplete}
                      />
                    )}
                  </>
                ) : (
                  <div className="text-center py-6">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-xl font-medium text-white mb-2">No available slots</h3>
                    <p className="text-muted-foreground">
                      This doctor doesn&apos;t have any available appointment slots for the next 4
                      days. Please check back later or try another doctor.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
