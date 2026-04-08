'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Clock, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/auth-context';
import { useFetchAvailabilitySettings } from '../hooks/useFetchAvailabilitySettings';
import { useUpdateAvailabilitySettings } from '../hooks/useUpdateAvailabilitySettings';
import { handleApiError } from '@/lib/errors/axios';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function AvailabilitySettings() {
  const [availability, setAvailability] = useState<
    Record<number, { enabled: boolean; start: string; end: string; id?: number }>
  >({
    0: { enabled: true, start: '09:00', end: '17:00' },
    1: { enabled: true, start: '09:00', end: '17:00' },
    2: { enabled: true, start: '09:00', end: '17:00' },
    3: { enabled: true, start: '09:00', end: '17:00' },
    4: { enabled: true, start: '09:00', end: '17:00' },
    5: { enabled: false, start: '09:00', end: '17:00' },
    6: { enabled: false, start: '09:00', end: '17:00' },
  });
  const { user } = useAuth();

  const docId = user?.doctor?.id as number;

  const { data, isFetching, refetch } = useFetchAvailabilitySettings(docId);
  const { mutate: updateAvailabilitySettings, isPending } = useUpdateAvailabilitySettings(docId);

  useEffect(() => {
    if (data) {
      const transformedAvailability: Record<
        number,
        { id?: number; enabled: boolean; start: string; end: string }
      > = {};

      data.forEach((slot) => {
        transformedAvailability[slot.dayOfWeek] = {
          id: slot.id,
          enabled: slot.isEnabled,
          start: slot.startTime || '00:00',
          end: slot.endTime || '00:00',
        };
      });

      setAvailability(transformedAvailability);
    }
  }, [data]);

  const handleSave = async () => {
    const docId = user?.doctor?.id;
    if (docId) {
      const updatedAvailability = Object.entries(availability).map(([dayNum, day]) => {
        const slot = {
          id: day.id!,
          doctorId: docId,
          dayOfWeek: parseInt(dayNum),
          startTime: day.enabled ? day.start : '00:00',
          endTime: day.enabled ? day.end : '00:00',
          isEnabled: day.enabled,
        };
        return slot;
      });

      updateAvailabilitySettings(updatedAvailability, {
        onSuccess: () => {
          toast.success('Availability updated successfully.');
          refetch();
        },
        onError: (error) => {
          handleApiError(error);
        },
      });
    }
  };

  if (isFetching) {
    return (
      <Card className="border-brand-900/20">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-brand-900/20">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground flex items-center">
          <Clock className="h-5 w-5 mr-2 text-brand-400" />
          Availability Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {DAYS.map((day, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border border-brand-900/20 rounded-lg"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-24">
                <Label className="text-foreground font-medium">{day}</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={availability[index].start}
                  onChange={(e) =>
                    setAvailability((prev) => ({
                      ...prev,
                      [index]: { ...prev[index], start: e.target.value },
                    }))
                  }
                  className="px-2 py-1 bg-background border border-brand-900/20 rounded text-sm"
                  disabled={!availability[index].enabled}
                />
                <span className="text-muted-foreground">to</span>
                <input
                  type="time"
                  value={availability[index].end}
                  onChange={(e) =>
                    setAvailability((prev) => ({
                      ...prev,
                      [index]: { ...prev[index], end: e.target.value },
                    }))
                  }
                  className="px-2 py-1 bg-background border border-brand-900/20 rounded text-sm"
                  disabled={!availability[index].enabled}
                />
              </div>
            </div>
            <Switch
              checked={availability[index].enabled}
              onCheckedChange={(checked) =>
                setAvailability((prev) => ({
                  ...prev,
                  [index]: { ...prev[index], enabled: checked },
                }))
              }
            />
          </div>
        ))}

        <Button
          onClick={handleSave}
          disabled={isPending}
          className="w-full bg-brand-600 hover:bg-brand-700 dark:text-white"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Availability
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
