'use client';

import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const PaymentSuccessPage = () => {
  const router = useRouter();

  return (
    <div className="flex h-[70vh] flex-col items-center justify-center text-center gap-6">
      <CheckCircle className="h-16 w-16 text-brand-500" />
      <h2 className="text-2xl font-bold text-white">Payment Successful</h2>
      <p className="text-gray-400">Your wallet has been credited successfully.</p>
      <Button onClick={() => router.push('/')}>Go Back Home</Button>
    </div>
  );
};

export default PaymentSuccessPage;
