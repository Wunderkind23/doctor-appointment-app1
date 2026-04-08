"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Calendar,
  CreditCard,
  ShieldCheck,
  Stethoscope,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "./ui/badge";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/auth-context";
import { useCredits } from "./hooks/useGetCredit";

export default function Header() {
  const { user, loading, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: credits } = useCredits();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <header className="fixed top-0 w-full border-b bg-background/80 border backdrop-blur-md z-[999999]! supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <Image
              src="/babcock-logo.png"
              alt="Babcock health Logo"
              // width={200}
              // height={60}
              width={150}
              height={40}
              className="h-8 w-auto object-contain"
            />
          </Link>
        </nav>
      </header>
    );
  }

  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-[999999]! border supports-[backdrop-filter]:bg-background/60">
      <nav className="max-w-7xl mx-auto px-6 sm:px-8 h-22 flex items-center justify-between ">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <Image
            src="/yct-logo.jpg"
            alt="Yabatech health Logo"
            width={250}
            height={70}
            className="h-10 w-auto object-contain"
          />

          <h1 className="text-1xl sm:text-2xl lg:text-3xl ml-3 font-black uppercase">
            Yabatech Health
          </h1>

          <Image
            src="/yct-logo.jpg"
            alt="Yabatech health Logo"
            width={250}
            height={70}
            className="h-10 w-auto object-contain ml-3"
          />
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-slate-400" />
              ) : (
                <Moon className="h-5 w-5 text-slate-600" />
              )}
            </Button>
          )}

          {user ? (
            <>
              {/* Admin Links */}
              {user?.role === "ADMIN" && (
                <Link href="/admin">
                  <Button
                    variant="outline"
                    className="hidden md:inline-flex items-center gap-2"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Admin Dashboard
                  </Button>
                  <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                    <ShieldCheck className="h-4 w-4" />
                  </Button>
                </Link>
              )}

              {/* Doctor Links */}
              {user?.role === "DOCTOR" && (
                <Link href="/doctor">
                  <Button
                    variant="outline"
                    className="hidden md:inline-flex items-center gap-2"
                  >
                    <Stethoscope className="h-4 w-4" />
                    Doctor Dashboard
                  </Button>
                  <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                    <Stethoscope className="h-4 w-4" />
                  </Button>
                </Link>
              )}

              {/* Patient Links */}
              {user?.role === "PATIENT" && (
                <Link href="/appointments">
                  <Button
                    variant="outline"
                    className="hidden md:inline-flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    My Appointments
                  </Button>
                  <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </Link>
              )}

              {/* Credits Badge */}
              {user?.role !== "ADMIN" && (
                <Link href={user?.role === "PATIENT" ? "/pricing" : "/doctor"}>
                  <Badge
                    variant="outline"
                    className="h-9 bg-brand-900/20 border-brand-700/30 px-3 py-1 flex items-center gap-2"
                  >
                    <CreditCard className="h-3.5 w-3.5 text-brand-400" />
                    <span className="text-brand-400">
                      {credits}{" "}
                      <span className="hidden md:inline">
                        {user?.role === "PATIENT"
                          ? "Credits"
                          : "Earned Credits"}
                      </span>
                    </span>
                  </Badge>
                </Link>
              )}

              {/* User Menu */}
              <div className="flex items-center gap-2 ml-2">
                <div className="text-sm text-muted-foreground hidden md:block">{`${user.firstName} ${user.lastName}`}</div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </div>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="bg-brand-600 hover:bg-brand-700 text-white">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
