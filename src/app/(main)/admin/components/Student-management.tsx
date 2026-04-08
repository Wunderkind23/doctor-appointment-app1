'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Ban, Loader2, User, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/errors/axios';
import { useDebounce } from '@/app/_hooks/useDebounce';
import { useRevokeAccess } from '../hooks/useRevokeStudent';
import { QUERY_KEY_FOR_PATIENTS_FETCH, useFetchPatient } from '../hooks/useFetchPatient';
import { useSuspend } from '../hooks/useSuspendPatient';
import { useQueryClient } from '@tanstack/react-query';

export function StudentManagement() {
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearch = useDebounce(searchTerm, 500);
  const queryClient = useQueryClient();

  const { data: patients, refetch } = useFetchPatient(debouncedSearch, 'student');
  const { mutate: revokeAccess, isPending } = useRevokeAccess();
  const { mutate: suspend, isPending: isPendingSuspension } = useSuspend();

  const handleRevoke = (patientId: number) => {
    const revokeAccessAttributeI = {
      patientId,
    };

    revokeAccess(revokeAccessAttributeI, {
      onSuccess: () => {
        toast.success('Student privileges revoked successfully.');
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY_FOR_PATIENTS_FETCH],
        });
      },
      onError: (error) => {
        handleApiError(error);
      },
    });
  };

  const handleSuspend = (patientId: number, type: string) => {
    const suspendAttributeI = {
      patientId,
      type,
    };

    suspend(suspendAttributeI, {
      onSuccess: () => {
        toast.success('Patient suspended successfully.');
        refetch();
      },
      onError: (error) => {
        handleApiError(error);
      },
    });
  };

  return (
    <div>
      <Card className="bg-muted/20 border-brand-900/20">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold text-foreground">Manage Patients</CardTitle>
              <CardDescription>View and manage all patients that are students</CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                className="pl-8 bg-background border-brand-900/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {patients?.result.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? 'No patient match your search criteria.'
                : 'No verified patients available.'}
            </div>
          ) : (
            <div className="space-y-4">
              {patients?.result.map((patient) => (
                <Card
                  key={patient?.id}
                  className="bg-background border-brand-900/20 hover:border-brand-700/30 transition-all"
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-muted/20 rounded-full p-2">
                          <User className="h-5 w-5 text-brand-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{`${patient?.user?.firstName} ${patient?.user?.lastName}`}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {patient?.user?.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end md:self-auto">
                        {!patient?.user.isActive ? (
                          <>
                            <Badge
                              variant="outline"
                              className="bg-red-900/20 border-red-900/30 text-red-400"
                            >
                              Suspended
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuspend(patient.id, 'reinstate')}
                              disabled={isPendingSuspension}
                              className="border-brand-900/30 bg-brand-900/20 hover:bg-muted/80 text-brand-400"
                            >
                              {isPendingSuspension ? (
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              ) : (
                                <Check className="h-4 w-4 mr-1" />
                              )}
                              Reinstate
                            </Button>
                          </>
                        ) : (
                          <>
                            <Badge
                              variant="outline"
                              className="bg-brand-900/20 border-brand-900/30 text-brand-400"
                            >
                              Active
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuspend(patient.id, 'suspend')}
                              disabled={isPendingSuspension}
                              className="border-red-900/30 hover:bg-red-900/10 text-red-400"
                            >
                              {isPendingSuspension ? (
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              ) : (
                                <Ban className="h-4 w-4 mr-1" />
                              )}
                              Suspend
                            </Button>
                          </>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRevoke(patient.id)}
                          disabled={isPending}
                          className="border-brand-900/30 hover:bg-muted/80"
                        >
                          {isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              Revoking Privileges
                            </>
                          ) : (
                            <>Revoke Privileges</>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
