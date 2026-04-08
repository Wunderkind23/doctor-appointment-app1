'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Calendar,
  User,
  Video,
  X,
  Edit,
  Loader2,
  CheckCircle,
  AudioWaveform,
  MessageCircleMore,
  Loader2Icon,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Appointment } from '@/types/appointment';
import { useAddAppointmentNote } from '@/app/(main)/doctor/hooks/useAddAppointmentNote';
import { handleApiError } from '@/lib/errors/axios';
import { useCancelAppointment } from '@/app/(main)/doctor/hooks/useCancelAppointment';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { AppointmentsResponse } from '@/app/(main)/appointments/hooks/useFetchAppointment';
import { AppointmentStatusEnum } from '@/app/(main)/doctors/hooks/userCreateBooking';
import { BookingTypeEnum } from '@/app/(main)/(patient)/hooks/useBookAppointment';
import { useAddRating } from './hooks/useAddReview';

interface AppointmentCardProps {
  appointment: Appointment;
  userRole: 'DOCTOR' | 'PATIENT';
  refetchAppointments: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<AppointmentsResponse, Error>>;
}

export function AppointmentCard({
  appointment,
  userRole,
  refetchAppointments,
}: AppointmentCardProps) {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<'cancel' | 'notes' | 'video' | 'complete' | null>(null);
  const [notes, setNotes] = useState(appointment.doctorsNote || '');
  const [loading, setLoading] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState('');

  const router = useRouter();

  const { mutate: addNote, isPending: isAddingNote } = useAddAppointmentNote(appointment.id);
  const { mutate: cancelAppointment, isPending: isCancelling } = useCancelAppointment(
    appointment.id
  );
  const { mutate: addReview, isPending: isReviewing } = useAddRating();

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy 'at' h:mm a");
    } catch {
      return 'Invalid date';
    }
  };

  const canMarkCompleted = () => {
    if (userRole !== 'DOCTOR' || appointment.status !== AppointmentStatusEnum.SCHEDULED) {
      return false;
    }
    const now = new Date();
    const appointmentEnd = new Date(appointment.dateTime);
    return now >= appointmentEnd;
  };

  const handleCancelAppointment = async () => {
    if (
      !window.confirm(
        'Are you sure you want to cancel this appointment? This action cannot be undone.'
      )
    ) {
      return;
    }

    cancelAppointment(undefined, {
      onSuccess: () => {
        toast.success('Appointment cancelled successfully');
        setOpen(false);
        setAction(null);
        refetchAppointments();
      },
      onError: (error) => {
        handleApiError(error);
      },
    });
  };

  const handleSaveNotes = async () => {
    if (userRole !== 'DOCTOR') return;

    addNote(
      {
        doctorNote: notes,
      },
      {
        onSuccess: (data) => {
          toast.success(data.message || 'Notes saved successfully');
          setOpen(false);
          setAction(null);
          if (refetchAppointments) {
            refetchAppointments();
          }
        },
        onError: (error) => {
          handleApiError(error);
        },
      }
    );
  };

  const handleJoinAppointment = async () => {
    if (
      ![AppointmentStatusEnum.IN_PROGRESS, AppointmentStatusEnum.SCHEDULED].includes(
        appointment.status
      )
    ) {
      toast.error('Can only join video calls for scheduled appointments');
      return;
    }

    setLoading(true);
    try {
      if (appointment.dateTime) {
        const startTime = new Date(appointment.startTime).getTime();
        const endTime = new Date(appointment.endTime).getTime();
        const now = new Date().getTime();

        if (now < startTime) {
          toast.error(
            'This appointment has not started yet. Please wait until the scheduled start time.'
          );
          return;
        }

        if (now > endTime) {
          toast.error('This appointment has already ended. Please schedule a new one.');
          return;
        }
      }

      const type: BookingTypeEnum = appointment.type;

      // TODO: OTHER MEANS TO TALK TO A DOCTOR
      if (type === BookingTypeEnum.CHAT) {
        router.push(`/chat?appointmentId=${appointment.id}`);
      } else if (type === BookingTypeEnum.VIDEO) {
        router.push(`/video-call?appointmentId=${appointment.id}`);
      } else {
        router.push(`/audio?appointmentId=${appointment.id}`);
      }
    } catch (error) {
      toast.error('Failed to generate video token');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    if (userRole !== 'PATIENT') return;

    if (!review) {
      toast.error('Please add comment.');
      return;
    }

    if (rating === 0) {
      toast.error('Please add comment.');
      return;
    }

    const data = {
      id: appointment.id,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      comment: review,
      rating,
    };

    addReview(data, {
      onSuccess: (data) => {
        toast.success(data.message || 'Your review was successful');
        setReviewOpen(false);
        setAction(null);
        if (refetchAppointments) {
          refetchAppointments();
        }
      },
      onError: (error) => {
        handleApiError(error);
      },
    });
  };

  const handleMarkCompleted = async () => {
    if (!window.confirm('Are you sure you want to mark this appointment as completed?')) {
      return;
    }

    setLoading(true);
    try {
      toast.success('Appointment marked as completed');
      setOpen(false);
      if (refetchAppointments) {
        await refetchAppointments();
      }
    } catch (error) {
      toast.error('Failed to mark appointment as completed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-900/30 text-blue-400 border-blue-700/30';
      case 'completed':
        return 'bg-green-900/30 text-green-400 border-green-700/30';
      case 'cancelled':
        return 'bg-red-900/30 text-red-400 border-red-700/30';
      default:
        return 'bg-gray-900/30 text-gray-400 border-gray-700/30';
    }
  };

  return (
    <>
      <Card
        className="border-brand-900/20 hover:border-brand-700/40 transition-all cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Status Badge */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-foreground text-lg capitalize">
                  Dr. {appointment.doctorName}
                </h3>
                <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
              </div>
              <div
                className={`px-3 py-1 rounded text-xs font-medium border ${getStatusColor(
                  appointment.status
                )}`}
              >
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </div>
            </div>

            {/* Date and Time */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDateTime(appointment.dateTime)}</span>
              </div>
            </div>

            {/* Doctor/Patient Info */}
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground capitalizes">{appointment.patientName}</span>
            </div>

            {/* Actions */}
            {[AppointmentStatusEnum.SCHEDULED, AppointmentStatusEnum.IN_PROGRESS].includes(
              appointment.status
            ) && (
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoinAppointment();
                  }}
                  disabled={loading}
                >
                  {appointment.type === 'CHAT' ? (
                    <>
                      <MessageCircleMore className="h-3 w-3 mr-1" />
                      Join Chat
                    </>
                  ) : appointment.type === 'VIDEO' ? (
                    <>
                      <Video className="h-3 w-3 mr-1" />
                      Join Video Call
                    </>
                  ) : (
                    <>
                      <AudioWaveform className="h-3 w-3 mr-1" />
                      Join Audio Call
                    </>
                  )}
                </Button>

                {userRole === 'DOCTOR' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAction('notes');
                      setOpen(true);
                    }}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Notes
                  </Button>
                )}
              </div>
            )}

            {appointment.status === AppointmentStatusEnum.COMPLETED &&
              userRole === 'PATIENT' &&
              !appointment.isReviewed && (
                <div className="pt-2">
                  <Button
                    size="sm"
                    className="w-full bg-brand-600 hover:bg-brand-700  dark:text-white "
                    onClick={(e) => {
                      e.stopPropagation();
                      setReviewOpen(true);
                    }}
                  >
                    Leave a Review
                  </Button>
                </div>
              )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog for detailed view and actions */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="capitalize">Dr. {appointment.doctorName}</DialogTitle>
            <DialogDescription className="text-sm">
              {formatDateTime(appointment.dateTime)}
            </DialogDescription>
          </DialogHeader>

          {!action ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Specialty:</span> {appointment.specialty}
                </p>
                {appointment.notes && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Notes:</span> {appointment.notes}
                  </p>
                )}
              </div>

              <DialogFooter className="flex gap-2">
                {appointment.status === AppointmentStatusEnum.SCHEDULED && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setAction('cancel')}
                      disabled={loading}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleJoinAppointment}
                      disabled={loading}
                      className="bg-brand-600 hover:bg-brand-700 dark:text-white"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Video className="h-4 w-4 mr-2" />
                      )}
                      Join Call
                    </Button>
                  </>
                )}
                {userRole === 'DOCTOR' &&
                  appointment.status === AppointmentStatusEnum.SCHEDULED && (
                    <Button variant="outline" onClick={() => setAction('notes')}>
                      <Edit className="h-4 w-4 mr-2" />
                      Add Notes
                    </Button>
                  )}
                {canMarkCompleted() && (
                  <Button
                    onClick={handleMarkCompleted}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Complete
                  </Button>
                )}
              </DialogFooter>
            </div>
          ) : action === 'cancel' ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Are you sure you want to cancel this appointment?
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAction(null)} disabled={loading}>
                  Keep
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancelAppointment}
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <X className="h-4 w-4 mr-2" />
                  )}
                  Cancel Appointment
                </Button>
              </DialogFooter>
            </div>
          ) : action === 'notes' ? (
            <div className="space-y-4">
              <Textarea
                placeholder="Add appointment notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setAction(null)} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveNotes}
                  disabled={isAddingNote}
                  className="bg-brand-600 hover:bg-brand-700"
                >
                  {isAddingNote ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Save Notes
                </Button>
              </DialogFooter>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Dialog for review */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Review Dr. {appointment.doctorName}</DialogTitle>
            <DialogDescription>{appointment.specialty}</DialogDescription>
          </DialogHeader>

          {/* Doctor Info */}
          <div className="rounded-lg border p-3 text-sm space-y-1">
            <p>
              <span className="font-medium">Doctor:</span> Dr. {appointment.doctorName}
            </p>
            <p>
              <span className="font-medium">Appointment:</span>{' '}
              {formatDateTime(appointment.dateTime)}
            </p>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl ${
                    rating >= star ? 'text-yellow-400' : 'text-muted-foreground'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Review</label>
            <Textarea
              placeholder="Share your experience with the doctor..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewOpen(false)}>
              Cancel
            </Button>

            <Button
              className="bg-brand-600 hover:bg-brand-700  dark:text-white"
              disabled={isReviewing}
              onClick={() => {
                handleReview();
              }}
            >
              {isReviewing ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  <p>Submitting Review</p>
                </>
              ) : (
                <>Submit Review</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
