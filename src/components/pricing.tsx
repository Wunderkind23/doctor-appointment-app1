'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/errors/axios';
import { useCreateCheckoutUrl } from '@/app/(main)/pricing/hooks/useGetCheckoutUrl';

type Package = {
  name: string;
  credits: number;
  price: number;
  features: string[];
  popular?: boolean;
};

const Pricing = () => {
  const { user } = useAuth();
  const { mutate: createCheckoutUrl, isPending } = useCreateCheckoutUrl();

  const packages: Package[] = [
    {
      name: 'Starter',
      credits: 5,
      price: 1000,
      features: ['5 Consultations', 'Valid forever', 'Email support'],
    },
    {
      name: 'Professional',
      credits: 50,
      price: 10000,
      features: ['10 Consultations', 'Valid forever', 'Priority support'],
      popular: true,
    },
    {
      name: 'Enterprise',
      credits: 100,
      price: 20000,
      features: ['25 Consultations', 'Valid forever', '24/7 support', 'Family sharing'],
    },
  ];

  const handleCheckout = (pkg: Package) => {
    const patientId = user?.patient?.id;
    if (!patientId) return;

    createCheckoutUrl(
      { patientId, amount: pkg.price },
      {
        onSuccess: (data) => {
          toast.success('Redirecting to payment...');
          window.location.href = data.paymentLink;
        },
        onError: (error) => {
          handleApiError(error);
        },
      }
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Simple, Transparent Pricing</h2>
        <p className="text-gray-400">Choose the plan that works best for you</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card
            key={pkg.name}
            className={`border-brand-900/30 ${
              pkg.popular ? 'border-brand-600 ring-2 ring-brand-600/50' : ''
            }`}
          >
            <CardContent className="p-6">
              {pkg.popular && (
                <div className="bg-brand-600/20 text-brand-400 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                  POPULAR
                </div>
              )}

              <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>

              <div className="mb-4">
                <span className="text-4xl font-bold text-white">₦{pkg.price}</span>
                <span className="text-gray-400 ml-2">{pkg.credits} credits</span>
              </div>

              <Button
                className="w-full mb-6 bg-brand-600 hover:bg-brand-700 dark:text-white"
                onClick={() => handleCheckout(pkg)}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Initializing payment
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Get {pkg.credits} Credits
                  </>
                )}
              </Button>

              <div className="space-y-3">
                {pkg.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-brand-400" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
