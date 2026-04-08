'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, User, DollarSign, Mail, Stethoscope, Loader2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { BarLoader } from 'react-spinners';
import { PayoutStatusEnum, SinglePayoutAttributeI, useFetchPayouts } from '../hooks/useFetchPayout';
import { useConfirmPayout } from '../hooks/useConfirmPayout';
import { handleApiError } from '@/lib/errors/axios';

export function PendingPayouts() {

  type DialogMode = 'DETAILS' | 'APPROVE' | null;

  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedPayout, setSelectedPayout] = useState<SinglePayoutAttributeI | null>(null);

  const { data: payouts, refetch } = useFetchPayouts();

  const { mutate: confirmPayout, isPending } = useConfirmPayout();

  // Handle view details
  const handleViewDetails = (payout: SinglePayoutAttributeI) => {
    setSelectedPayout(payout);
    setDialogMode('DETAILS');
  };

  // Handle approve payout
  const handleApprovePayout = (payout: SinglePayoutAttributeI) => {
    setSelectedPayout(payout);
    setDialogMode('APPROVE');
  };

  // Confirm approval
  const confirmApproval = async (payout: SinglePayoutAttributeI) => {
    const data = { doctorId: payout.doctorId, payoutId: payout.id };

    confirmPayout(data, {
      onSuccess: () => {
        setSelectedPayout(null);
        toast.success('Payout approved successfully!');
        refetch();
      },
      onError: (error: unknown) => {
        handleApiError(error);
      },
    });
  };

  return (
    <div>
      <Card className="bg-muted/20 border-brand-900/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground">Pending Payouts</CardTitle>
          <CardDescription>Review and approve doctor payout requests</CardDescription>
        </CardHeader>
        <CardContent>
          {payouts?.result?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pending payout requests at this time.
            </div>
          ) : (
            <div className="space-y-4">
              {payouts?.result.map((payout) => (
                <Card
                  key={payout.id}
                  className="bg-background border-brand-900/20 hover:border-brand-700/30 transition-all"
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-muted/20 rounded-full p-2 mt-1">
                          <User className="h-5 w-5 text-brand-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">
                            Dr.{' '}
                            {`${payout?.doctor?.user?.firstName} ${payout?.doctor?.user?.lastName}`}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {payout.doctor.specialization}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1 text-brand-400" />
                              <span>
                                {payout.amount} credits • ₦{payout.amount * 200}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-1 text-brand-400" />
                              <span className="text-xs">{payout?.doctor?.user?.email}</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Requested{' '}
                            {format(new Date(payout.createdAt), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 self-end lg:self-center">
                        {payout.status === PayoutStatusEnum.PAID ? (
                          <>
                            {' '}
                            <Badge
                              variant="outline"
                              className="bg-brand-900/20 border-brand-900/30 text-brand-400 w-fit"
                            >
                              Confirmed
                            </Badge>{' '}
                          </>
                        ) : (
                          <>
                            <Badge
                              variant="outline"
                              className="bg-amber-900/20 border-amber-900/30 text-amber-400 w-fit"
                            >
                              pending
                            </Badge>
                          </>
                        )}

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(payout)}
                            className="border-brand-900/30 hover:bg-muted/80"
                          >
                            View Details
                          </Button>
                          <Button
                            disabled={payout.status === PayoutStatusEnum.PAID}
                            size="sm"
                            onClick={() => handleApprovePayout(payout)}
                            className="bg-brand-600 hover:bg-brand-700 dark:text-white"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            {payout.status === PayoutStatusEnum.PAID ? <>Approved</> : <>Approve</>}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payout Details Dialog */}
      {dialogMode === 'DETAILS' && selectedPayout && (
        <Dialog
          open
          onOpenChange={(open) => {
            if (!open) {
              setDialogMode(null);
              setSelectedPayout(null);
            }
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-foreground">
                Payout Request Details
              </DialogTitle>
              <DialogDescription>Review the payout request information</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Doctor Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-brand-400" />
                  <h3 className="text-foreground font-medium">Doctor Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p className="text-foreground">
                      Dr. {`${selectedPayout?.doctor.user.firstName}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-foreground">{selectedPayout.doctor.user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Specialty</p>
                    <p className="text-foreground">{selectedPayout.doctor.specialization}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Credits</p>
                    <p className="text-foreground">{selectedPayout.doctor.credits}</p>
                  </div>
                </div>
              </div>

              {/* Payout Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-brand-400" />
                  <h3 className="text-foreground font-medium">Payout Details</h3>
                </div>
                <div className="bg-muted/20 p-4 rounded-lg border border-brand-900/20 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Credits to pay out:</span>
                    <span className="text-foreground font-medium">
                      {selectedPayout.amount} Credit
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gross amount (200 NGN/credit):</span>
                    <span className="text-foreground">
                      ₦{(selectedPayout.amount * 200).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform fee (2%):</span>
                    <span className="text-foreground">-₦{selectedPayout.amount * 200 * 0.2}</span>
                  </div>
                  <div className="border-t border-brand-900/20 pt-3 flex justify-between font-medium">
                    <span className="text-foreground">Net payout:</span>
                    <span className="text-brand-400">
                      ₦{selectedPayout.amount * 200 - selectedPayout.amount * 200 * 0.2}
                    </span>
                  </div>
                  <div className="border-t border-brand-900/20 pt-3">
                    <p className="text-sm font-medium text-muted-foreground">Account Details</p>
                    <p className="text-foreground font-light text-sm">
                      * {selectedPayout.bankName}
                    </p>
                    <p className="text-foreground font-light text-sm  capitalize">
                      * {selectedPayout.accountName}
                    </p>
                    <p className="text-foreground font-light text-sm">
                      * {selectedPayout.accountNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning if insufficient credits */}
              {selectedPayout.doctor.credits < selectedPayout.amount && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Warning: Doctor currently has only {selectedPayout.doctor.credits} credits but
                    this payout requires {selectedPayout.amount} credits. The payout cannot be
                    processed.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDialogMode(null);
                  setSelectedPayout(null);
                }}
                className="border-brand-900/30"
              >
                Close
              </Button>
              {/* <Button
                onClick={() => handleViewDetails(selectedPayout)}
                // onClick={() => setDialogMode('APPROVE')}
                disabled={
                  selectedPayout.doctor.credits < selectedPayout.amount ||
                  selectedPayout.status === PayoutStatusEnum.PAID
                }
                className="bg-brand-600 hover:bg-brand-700"
              >
                <Check className="h-4 w-4 mr-1" />
                Confirm Payment
              </Button> */}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Approval Confirmation Dialog */}
      {dialogMode === 'APPROVE' && selectedPayout && (
        <Dialog
          open
          onOpenChange={(open) => {
            if (!open) setDialogMode(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-foreground">
                Confirm Payout Approval
              </DialogTitle>
              <DialogDescription>Are you sure you want to approve this payout?</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This action will:
                  <ul className="mt-2 space-y-1 list-disc pl-4">
                    <li>
                      Deduct {selectedPayout.amount} credits from Dr.{' '}
                      {`${selectedPayout.doctor.user.firstName} ${selectedPayout.doctor.user.lastName}`}
                      &apos;s account
                    </li>
                    <li>Mark the payout as COMPLETED</li>
                    <li>This action cannot be undone</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="bg-muted/20 p-4 rounded-lg border border-brand-900/20">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Doctor:</span>
                  <span className="text-foreground">
                    Dr. {`${selectedPayout?.doctor.user.firstName}`}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Amount to pay:</span>
                  <span className="text-brand-400 font-medium">
                    ₦{selectedPayout.amount * 200 - selectedPayout.amount * 200 * 0.2}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bank Details:</span>
                  <span className="text-foreground text-sm">{`${selectedPayout.bankName} - ${selectedPayout.accountName} - ${selectedPayout.accountNumber}`}</span>
                </div>
              </div>
            </div>

            {isPending && <BarLoader width={'100%'} color="#36d7b7" />}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDialogMode('DETAILS')}
                disabled={isPending}
                className="border-brand-900/30"
              >
                Cancel
              </Button>
              <Button
                onClick={() => confirmApproval(selectedPayout)}
                disabled={isPending}
                className="bg-brand-600 hover:bg-brand-700"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Confirm Payment
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
