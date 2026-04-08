'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ban, Loader2, User, Search, SchoolIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/errors/axios';
import { SinglePatientAttributeI, useFetchPatient } from '../hooks/useFetchPatient';
import { useDebounce } from '@/app/_hooks/useDebounce';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StudentPatientForm } from './student-form';
import { StudentPatientFormValues } from '../schema/student-patient.schema';
import { useMakeStudent } from '../hooks/useAddStudent';
import { useSuspend } from '../hooks/useSuspendPatient';

export function MakeStudent() {
  const [searchTerm, setSearchTerm] = useState('');

  const [targetPatient, setTargetPatient] = useState<SinglePatientAttributeI | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: patients, refetch } = useFetchPatient(debouncedSearch);

  const { mutate: makeStudent, isPending } = useMakeStudent();
  const { mutate: suspend, isPending: isPendingSuspension } = useSuspend();

  const handleMakeStudent = async (patient: SinglePatientAttributeI) => {
    setTargetPatient(patient);
  };

  const handleSubmit = (data: StudentPatientFormValues) => {
    const studentCreationAttributes = {
      patientId: targetPatient?.id as number,
      matricNumber: data.matricNumber,
      department: data.department,
      faculty: data.faculty,
      level: data.level,
    };

    makeStudent(studentCreationAttributes, {
      onSuccess: () => {
        toast.success('Student Created');
        setTargetPatient(null);
        refetch();
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
              <CardDescription>View and manage all verified Patients</CardDescription>
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
                              // onClick={() => handleStatusChange(doctor, false)}
                              // disabled={isPending}
                              className="border-brand-900/30 hover:bg-muted/80"
                            >
                              {/* {isPending && targetDoctor?.id === doctor.id ? (
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              ) : (
                                <Check className="h-4 w-4 mr-1" />
                              )} */}
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
                          onClick={() => handleMakeStudent(patient)}
                          disabled={isPending}
                          className="border-brand-900/30 hover:bg-muted/80"
                        >
                          Make Student
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

      {/* Make Student Dialog */}
      {targetPatient && (
        <Dialog
          open={!!targetPatient}
          onOpenChange={(open) => {
            if (!open) setTargetPatient(null);
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-foreground">
                Student onboarding Information
              </DialogTitle>
              <DialogDescription>Add extra information to make user student</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Doctor Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <SchoolIcon className="h-5 w-5 text-brand-400" />
                  <h3 className="text-foreground font-medium">Student Information</h3>
                </div>
                <StudentPatientForm isLoading={isPending} onSubmit={handleSubmit} />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
