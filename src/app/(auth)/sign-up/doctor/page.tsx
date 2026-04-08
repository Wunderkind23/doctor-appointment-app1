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
import { Textarea } from '@/components/ui/textarea';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useDoctorSignup } from '../../hooks/useDoctorSignup';
import { SPECIALTIES } from '@/lib/specialities';
import { doctorSignupSchema } from '../../validator/auth/doctor.validator';
import { useDispatch } from 'react-redux';
import { collectForData } from '@/lib/features/auth.slice';
import { handleApiError } from '@/lib/errors/axios';
import { UserRoleEnum } from '../../types';

export default function DoctorSignUpPage() {
  const router = useRouter();
  const doctorSignupMutation = useDoctorSignup();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    medicalLicense: '',
    specialization: '',
    yearsOfExperience: '',
    hospitalAffiliation: '',
    professionalBio: '',
    dob: '',
    gender: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSpecializationChange = (value: string) => {
    setFormData((prev) => ({ ...prev, specialization: value }));

    if (errors.specialization) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.gender;
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

  const validateForm = (): boolean => {
    const result = doctorSignupSchema.safeParse(formData);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(formData);

    if (!validateForm()) {
      return;
    }

    console.log(formData.professionalBio);

    const data = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      dob: formData.dob,
      gender: formData.gender,
      phoneNumber: formData.phoneNumber,
      medicalLicense: formData.medicalLicense,
      specialization: formData.specialization,
      yearsOfExperience: parseInt(formData.yearsOfExperience),
      hospitalAffiliation: formData.hospitalAffiliation,
      professionalBio: formData.professionalBio,
      role: UserRoleEnum.DOCTOR,
    };

    dispatch(collectForData({ ...data }));

    doctorSignupMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Account created successfully!');
        setTimeout(() => {
          router.push('/sign-up/verify');
        }, 1500);
      },
      onError: (error) => {
        handleApiError(error);
      },
    });
  };

  return (
    <div className="max-w-2xl mt-10 mx-auto space-y-6">
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
          <CardTitle className="text-2xl">Join as a Doctor</CardTitle>
          <CardDescription>Create your professional profile</CardDescription>
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
                  placeholder="Dr. John"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="bg-foreground/5 border-brand-900/30 focus:border-brand-500"
                  disabled={doctorSignupMutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-foreground">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Smith"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="bg-foreground/5 border-brand-900/30 focus:border-brand-500"
                  disabled={doctorSignupMutation.isPending}
                />
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
                placeholder="doctor@example.com"
                value={formData.email}
                onChange={handleChange}
                className="bg-foreground/5 border-brand-900/30 focus:border-brand-500"
                disabled={doctorSignupMutation.isPending}
              />
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
                  className="bg-foreground/5 border-brand-900/30 focus:border-brand-500 pr-10"
                  disabled={doctorSignupMutation.isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={doctorSignupMutation.isPending}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">At least 8 characters</p>
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
                  className="bg-foreground/5 border-brand-900/30 focus:border-brand-500 pr-10"
                  disabled={doctorSignupMutation.isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={doctorSignupMutation.isPending}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
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
                className="bg-foreground/5 border-brand-900/30 focus:border-brand-500"
                disabled={doctorSignupMutation.isPending}
              />
            </div>

            {/* Medical License */}
            <div className="space-y-2">
              <Label htmlFor="medicalLicense" className="text-foreground">
                Medical License Number
              </Label>
              <Input
                id="medicalLicense"
                name="medicalLicense"
                placeholder="MDC-XXXXXX"
                value={formData.medicalLicense}
                onChange={handleChange}
                className="bg-foreground/5 border-brand-900/30 focus:border-brand-500"
                disabled={doctorSignupMutation.isPending}
              />
            </div>

            {/* Specialization & Experience Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specialization" className="text-foreground">
                  Specialization
                </Label>
                <Select
                  value={formData.specialization}
                  onValueChange={handleSpecializationChange}
                  disabled={doctorSignupMutation.isPending}
                >
                  <SelectTrigger className="bg-foreground/5 border-brand-900/30 focus:border-brand-500">
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIALTIES.map((spec) => {
                      const Icon = spec.icon;

                      return (
                        <SelectItem key={spec.name} value={spec.name}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span>{spec.name}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearsOfExperience" className="text-foreground">
                  Years of Experience
                </Label>
                <Input
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  type="number"
                  placeholder="10"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  className="bg-foreground/5 border-brand-900/30 focus:border-brand-500"
                  disabled={doctorSignupMutation.isPending}
                  min="0"
                />
              </div>
            </div>

            {/* Date of Birth & Gender Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-foreground">
                  Gender
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={handleGenderChange}
                  disabled={doctorSignupMutation.isPending}
                >
                  <SelectTrigger className="bg-foreground/5 border-brand-900/30 focus:border-brand-500">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                  className="bg-foreground/5 border-brand-900/30 focus:border-brand-500"
                  disabled={doctorSignupMutation.isPending}
                />
              </div>
            </div>

            {/* Hospital Affiliation */}
            <div className="space-y-2">
              <Label htmlFor="hospitalAffiliation" className="text-foreground">
                Hospital Affiliation
              </Label>
              <Input
                id="hospitalAffiliation"
                name="hospitalAffiliation"
                placeholder="e.g., General Hospital Lagos"
                value={formData.hospitalAffiliation}
                onChange={handleChange}
                className="bg-foreground/5 border-brand-900/30 focus:border-brand-500"
                disabled={doctorSignupMutation.isPending}
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="professionalBio" className="text-foreground">
                Professional Bio (Required)
              </Label>
              <Textarea
                id="professionalBio"
                name="professionalBio"
                placeholder="Tell patients about your experience and expertise..."
                value={formData.professionalBio}
                onChange={handleChange}
                className="bg-foreground/5 border-brand-900/30 focus:border-brand-500 resize-none"
                rows={4}
                disabled={doctorSignupMutation.isPending}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-700 text-foreground font-semibold py-6 mt-8"
              disabled={doctorSignupMutation.isPending}
            >
              {doctorSignupMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Professional Account'
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
