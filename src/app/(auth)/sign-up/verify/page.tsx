'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useVerifyToken } from '../../hooks/useVerifyWithOTP';
import { useResendOtp } from '../../hooks/useResendOTP';
import { useAppSelector } from '@/app/_hooks/redux';

export default function OTPVerificationPage() {
  const router = useRouter();
  const verifyTokenMutation = useVerifyToken();
  const resendOtpMutation = useResendOtp();
  const userInfo = useAppSelector((state) => state.auth.formData);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);

    if (!/^\d+$/.test(pastedData)) {
      toast.error('Please paste only numbers');
      return;
    }

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);

    // Focus the next empty input or the last one
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const validateForm = (): boolean => {
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userInfo.email === '') {
      toast.error('No email found. Please sign up again.');
      router.push('/sign-up');
      return;
    }

    if (!validateForm()) {
      return;
    }

    const otpCode = otp.join('');

    verifyTokenMutation.mutate(
      {
        email: userInfo.email,
        otp: otpCode,
      },
      {
        onSuccess: () => {
          toast.success('Verification successful! Redirecting...');

          setTimeout(() => {
            router.push('/doctors');
          }, 1500);
        },
        onError: () => {
          toast.error('Invalid verification code. Please try again.');
          setOtp(['', '', '', '', '', '']);
          inputRefs.current[0]?.focus();
        },
      }
    );
  };

  const handleResendCode = () => {
    // Add your resend logic here
    if (userInfo.email === '') {
      toast.error('No email found. Please sign up again.');
      router.push('/sign-up');
      return;
    }

    resendOtpMutation.mutate({ email: userInfo.email });

    toast.success('Verification code resent to your email');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 mt-10">
      <div className="flex items-center gap-2">
        <Link
          href="/sign-up"
          className="flex items-center gap-2 text-brand-400 hover:text-brand-300 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>
      </div>

      <Card className="border-brand-900/20">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-brand-100 dark:bg-brand-900/20 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-brand-600" />
          </div>
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription>
            We&apos;ve sent a 6-digit verification code to your email address. Please enter it
            below.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input Fields */}
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-14 text-center text-xl font-semibold border-brand-900/20 focus:border-brand-500"
                  disabled={verifyTokenMutation.isPending}
                />
              ))}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-700 text-foreground font-semibold py-6"
              disabled={verifyTokenMutation.isPending}
            >
              {verifyTokenMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </Button>

            {/* Resend Code */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Didn&apos;t receive the code?</p>
              <Button
                type="button"
                variant="ghost"
                onClick={handleResendCode}
                className="text-brand-400 hover:text-brand-300 hover:bg-brand-900/10"
                disabled={verifyTokenMutation.isPending}
              >
                Resend Code
              </Button>
            </div>

            {/* Sign In Link */}
            <p className="text-center text-sm text-muted-foreground">
              Already verified?{' '}
              <Link href="/sign-in" className="text-brand-400 hover:text-brand-300 font-semibold">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
