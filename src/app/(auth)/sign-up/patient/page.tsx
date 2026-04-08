'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { usePatientSignup } from '../../hooks/usePatientSignup';
import { patientSignupSchema } from '../../validator/auth.validator';
import { GenderEnum, UserRoleEnum } from '../../types';
import { useDispatch } from 'react-redux';
import { collectForData } from '@/lib/features/auth.slice';

export default function PatientSignUpPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const patientSignupMutation = usePatientSignup();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    dob: '',
    gender: '',
    matricNumber: '',
    hospitalId: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const result = patientSignupSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });

      setErrors(fieldErrors);

      const firstError = result.error.issues[0];
      toast.error(firstError.message);

      return false;
    }

    setErrors({});
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }));

    if (errors.gender) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.gender;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const data = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
      dob: formData.dob,
      gender: formData.gender as GenderEnum,
      role: UserRoleEnum.PATIENT,
      hospitalId: formData.hospitalId,
      matricNumber: formData.matricNumber,
    };

    dispatch(collectForData({ ...data }));

    patientSignupMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Account created successfully! Redirecting...');
        setTimeout(() => {
          router.push('/sign-up/verify');
        }, 1500);
      },
      onError: () => {
        toast.error('Failed to create account. Please try again.');
      },
    });
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
          <CardTitle className="text-2xl">Join as a Patient</CardTitle>
          <CardDescription>Create your account to book appointments</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-foreground">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="bg-white/5 border-brand-900/30 focus:border-brand-500"
                  disabled={patientSignupMutation.isPending}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-foreground">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="bg-white/5 border-brand-900/30 focus:border-brand-500"
                  disabled={patientSignupMutation.isPending}
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="bg-white/5 border-brand-900/30 focus:border-brand-500"
                disabled={patientSignupMutation.isPending}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-white/5 border-brand-900/30 focus:border-brand-500 pr-10"
                  disabled={patientSignupMutation.isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={patientSignupMutation.isPending}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {errors.password ? (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              ) : (
                <p className="text-xs text-muted-foreground">At least 8 characters</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="bg-white/5 border-brand-900/30 focus:border-brand-500 pr-10"
                  disabled={patientSignupMutation.isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={patientSignupMutation.isPending}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>

                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-foreground">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                placeholder="+234 XXX XXX XXXX"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="bg-white/5 border-brand-900/30 focus:border-brand-500"
                disabled={patientSignupMutation.isPending}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Matric Number */}
            <div className="space-y-2">
              <Label htmlFor="matricNumber" className="text-foreground">
                Matriculation Number
              </Label>
              <Input
                id="matricNumber"
                name="matricNumber"
                placeholder="23/CSC/1234"
                value={formData.matricNumber}
                onChange={handleChange}
                className="bg-white/5 border-brand-900/30 focus:border-brand-500"
                disabled={patientSignupMutation.isPending}
              />
              {errors.matricNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.matricNumber}</p>
              )}
            </div>

            {/* Hospital ID */}
            <div className="space-y-2">
              <Label htmlFor="hospital Id" className="text-foreground">
                Hospital ID
              </Label>
              <Input
                id="hospitalId"
                name="hospitalId"
                placeholder="HOS123456"
                value={formData.hospitalId}
                onChange={handleChange}
                className="bg-white/5 border-brand-900/30 focus:border-brand-500"
                disabled={patientSignupMutation.isPending}
              />
              {errors.hospitalId && (
                <p className="text-red-500 text-sm mt-1">{errors.hospitalId}</p>
              )}
            </div>

            {/* Date of Birth & Gender Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dob" className="text-foreground">
                  Date of Birth
                </Label>
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  className="bg-white/5 border-brand-900/30 focus:border-brand-500"
                  disabled={patientSignupMutation.isPending}
                />
                {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-foreground">
                  Gender
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={handleGenderChange}
                  disabled={patientSignupMutation.isPending}
                >
                  <SelectTrigger className="bg-white/5 border-brand-900/30 focus:border-brand-500">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-700 text-foreground font-semibold py-6 mt-8"
              disabled={patientSignupMutation.isPending}
            >
              {patientSignupMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>

            {/* Sign In Link */}
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
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
