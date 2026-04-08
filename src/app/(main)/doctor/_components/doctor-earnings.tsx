'use client';

import { useState, ChangeEvent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  TrendingUp,
  Calendar,
  BarChart3,
  CreditCard,
  Loader2,
  AlertCircle,
  Coins,
} from 'lucide-react';
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
import { useFetchDocDashboard } from '../hooks/useGetDashboard';
import { useAuth } from '@/context/auth-context';
import { usePayoutRequest } from '../hooks/usePayoutRequest';
import { handleApiError } from '@/lib/errors/axios';
import { formatNaira } from '../utils';

const defaultAccountDetails = {
  accountName: '',
  accountNumber: '',
  bankName: '',
  amount: 0,
};

export function DoctorEarnings() {
  const [showPayoutDialog, setShowPayoutDialog] = useState(false);
  const [accountDetails, setAccountDetails] = useState(defaultAccountDetails);

  const { accountName, accountNumber, bankName, amount } = accountDetails;

  const { user } = useAuth();
  const docId = user?.doctor?.id as number;

  const { data, refetch } = useFetchDocDashboard(docId);

  const { mutate: requestPayout, isPending } = usePayoutRequest();

  const handlePayoutRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    const balance = Number(data?.availableBalance) ?? 0;

    // TODO: WHAT IS THE MINIMUM WITHDRAWAL
    if (balance === 0) {
      toast.error(`You don't have enough credit for you to withdraw`);
      return;
    }

    const payoutData = {
      ...accountDetails,
      doctorId: docId,
    };

    // run logic here
    requestPayout(payoutData, {
      onSuccess: (data) => {
        console.log(data);
        toast.success('Payout Request successful.');
        refetch();
      },
      onError: (error) => {
        handleApiError(error);
      },
    });
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;

    setAccountDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // TODO: Add all of the money information here

  return (
    <div className="space-y-6">
      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-brand-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-3xl font-bold text-foreground">
                  {formatNaira((data?.availableBalance ?? 0) * 200)}
                </p>
                <p className="text-xs text-muted-foreground">Ready for payout</p>
              </div>
              <div className="bg-brand-900/20 p-3 rounded-full">
                <Coins className="h-6 w-6 text-brand-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-brand-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Payouts</p>
                <p className="text-3xl font-bold text-foreground">
                  {formatNaira(data?.totalPayouts ?? 0.0)}
                </p>
              </div>
              <div className="bg-brand-900/20 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-brand-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-brand-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Appointments</p>
                <p className="text-3xl font-bold text-foreground">
                  {data?.completedAppointment ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">completed</p>
              </div>
              <div className="bg-brand-900/20 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-brand-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-brand-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-3xl font-bold text-foreground">
                  {formatNaira(data?.totalEarnings ?? 0.0)}
                </p>
              </div>
              <div className="bg-brand-900/20 p-3 rounded-full">
                <BarChart3 className="h-6 w-6 text-brand-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payout Request Button */}
      {data?.availableBalance && (
        <Button
          onClick={() => setShowPayoutDialog(true)}
          disabled={data?.availableBalance === 0}
          className="bg-brand-600 hover:bg-brand-700 w-full"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Request Payout
        </Button>
      )}

      {/* Payout Dialog */}
      <Dialog open={showPayoutDialog} onOpenChange={setShowPayoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Payout</DialogTitle>
            <DialogDescription>
              Enter your account details to request a payout of your available credits
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePayoutRequest} className="space-y-4">
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p>Available Credits: {data?.availableBalance}</p>
                    <p>
                      Platform Fee (2% per credit):{' '}
                      {Math.round(Number(data?.availableBalance ?? 0) * 0.02)}
                    </p>
                    <p className="font-bold text-brand-400">
                      {Number(data?.availableBalance) > 0
                        ? `Net Payout: ${Math.round(Number(data?.availableBalance ?? 0) - Number(data?.availableBalance ?? 0) * 0.02)} (Credits) or ${formatNaira(Math.round(Number(data?.availableBalance ?? 0) - Number(data?.availableBalance ?? 0) * 0.02) * 200)} (NGN)`
                        : `Net Payout: 0 Credits or ${formatNaira(0)}`}
                    </p>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  name="bankName"
                  type="text"
                  placeholder="Bank of Nigeria"
                  value={bankName}
                  onChange={onChangeHandler}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name</Label>
                <Input
                  id="accountName"
                  type="text"
                  name="accountName"
                  placeholder="Seth Odior"
                  value={accountName}
                  onChange={onChangeHandler}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  name="accountNumber"
                  type="text"
                  placeholder="0123456789"
                  value={accountNumber}
                  onChange={onChangeHandler}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Credit</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={onChangeHandler}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPayoutDialog(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-brand-600 hover:bg-brand-700"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Requesting...
                  </>
                ) : (
                  'Request Payout'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
