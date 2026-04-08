'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useLogin } from '../../hooks/useLogin';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/errors/axios';
import { useAuth } from '@/context/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const loginMutation = useLogin();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    loginMutation.mutate(
      { email, password, rememberMe },
      {
        onSuccess: (data) => {
          if (data) {
            toast.success('Login successful!');
            setUser(data.data?.user || null);

            const role = data.data?.user.role;

            if (role === 'ADMIN') {
              router.push('/admin');
            } else if (role === 'DOCTOR') {
              router.push('/doctor');
            } else {
              router.push('/doctors');
            }
          } else {
            toast.error('Login failed');
          }
        },
        onError: (error) => {
          handleApiError(error);
        },
      }
    );
  };

  return (
    <Card className="border-brand-900/20">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-semibold text-foreground">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loginMutation.isPending}
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="font-semibold">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loginMutation.isPending}
                className="mt-1 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loginMutation.isPending}
              className="rounded border-gray-300"
            />
            <Label htmlFor="remember" className="cursor-pointer font-normal">
              Remember me
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-700 dark:text-white"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>

          <div className="space-y-2">
            <Link href="/forgot-password">
              <Button variant="link" className="w-full justify-center text-brand-400">
                Forgot Password?
              </Button>
            </Link>
          </div>

          <div className="border-t border-slate-700 pt-6">
            <p className="text-center text-sm text-muted-foreground mb-4">
              Don&apos;t have an account?
            </p>
            <Link href="/sign-up">
              <Button
                variant="outline"
                className="w-full border-brand-700/30 hover:border-brand-700/50"
              >
                Create Account
              </Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
