'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { Loader2, Clock, ArrowLeft, Calendar, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateBooking } from '../../../hooks/userCreateBooking';
import { handleApiError } from '@/lib/errors/axios';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Slot {
  startTime: string;
  endTime: string;
  formatted: string;
}

interface AppointmentFormProps {
  doctorId: number;
  slot: Slot;
  onBack: () => void;
  onComplete: () => void;
}

export function AppointmentForm({ doctorId, slot, onBack, onComplete }: AppointmentFormProps) {
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');

  const { mutate, isPending } = useCreateBooking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!type) {
      toast.error('Please choose an appointment type.');
      return;
    }

    if (!description) {
      toast.error('Please enter your medical concern.');
      return;
    }

    mutate(
      {
        doctorId,
        bookingDate: new Date(slot.startTime),
        medicalConcern: description,
        startTime: slot.startTime,
        endTime: slot.endTime,
        type,
      },
      {
        onSuccess: (data) => {
          toast.success(data.message || 'Appointment booked successfully!');
          onComplete();
        },
        onError: (error) => {
          handleApiError(error);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-muted/20 p-4 rounded-lg border border-brand-900/20 space-y-3">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-brand-400 mr-2" />
          <span className="text-white font-medium">
            {format(new Date(slot.startTime), 'EEEE, MMMM d, yyyy')}
          </span>
        </div>
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-brand-400 mr-2" />
          <span className="text-white">{format(new Date(slot.startTime), 'h:mm a')}</span>
        </div>
        <div className="flex items-center">
          <CreditCard className="h-5 w-5 text-brand-400 mr-2" />
          <span className="text-muted-foreground">
            Cost: <span className="text-white font-medium">2 credits</span>
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="type">Appointment type (required)</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="bg-background border-brand-900/20">
              <SelectValue placeholder="Select appointment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem defaultChecked value="CHAT">
                Chat
              </SelectItem>
              {/* <SelectItem value="AUDIO">Voice Call</SelectItem>
              <SelectItem value="VIDEO">Video Call</SelectItem> */}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Describe your medical concern (required)</Label>
          <Textarea
            id="description"
            placeholder="Please provide any details about your medical concern or what you'd like to discuss in the appointment..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-background border-brand-900/20 h-32"
          />
          <p className="text-sm text-muted-foreground">
            This information will be shared with the doctor before your appointment.
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isPending}
          className="border-brand-900/30"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Change Time Slot
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="bg-brand-600 hover:bg-brand-700  dark:text-white"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Booking...
            </>
          ) : (
            'Confirm Booking'
          )}
        </Button>
      </div>
    </form>
  );
}
