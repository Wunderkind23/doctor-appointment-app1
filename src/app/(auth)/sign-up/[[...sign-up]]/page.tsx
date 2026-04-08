'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User, Stethoscope } from 'lucide-react';

export default function SignUpPage() {
  return (
    <div className="space-y-6">
      <Card className="border-brand-900/20 mb-10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl ">Create Your Account</CardTitle>
          <CardDescription>Choose your role to get started</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient Sign Up */}
        <Link href="/sign-up/patient">
          <Card className="border-brand-900/20 hover:border-brand-700/40 cursor-pointer transition-all h-full">
            <CardContent className="pt-8 flex flex-col items-center text-center h-full">
              <div className="p-4 bg-brand-900/20 rounded-full mb-4">
                <User className="h-8 w-8 text-brand-400" />
              </div>
              <CardTitle className="text-xl font-semibold text-foreground mb-2">
                Join as a Patient
              </CardTitle>
              <CardDescription className="mb-6">
                Book appointments, consult with doctors, and manage your healthcare journey
              </CardDescription>
              <Button className="w-full mt-auto bg-brand-600 hover:bg-brand-700 dark:text-white">
                Sign Up as Patient
              </Button>
            </CardContent>
          </Card>
        </Link>

        {/* Doctor Sign Up */}
        <Link href="/sign-up/doctor">
          <Card className="border-brand-900/20 hover:border-brand-700/40 cursor-pointer transition-all h-full">
            <CardContent className="pt-8 flex flex-col items-center text-center h-full">
              <div className="p-4 bg-brand-900/20 rounded-full mb-4">
                <Stethoscope className="h-8 w-8 text-brand-400" />
              </div>
              <CardTitle className="text-xl font-semibold text-foreground mb-2">
                Join as a Doctor
              </CardTitle>
              <CardDescription className="mb-6">
                Create your professional profile, set your availability, and provide consultations
              </CardDescription>
              <Button className="w-full mt-auto bg-brand-600 hover:bg-brand-700  dark:text-white">
                Sign Up as Doctor
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card className="border-brand-900/20 bg-brand-900/10">
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground ">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-brand-400 hover:text-brand-300 font-semibold">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
