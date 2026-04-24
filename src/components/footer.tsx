"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer className="border-t bg-background/80 backdrop-blur-md text-sm text-muted-foreground">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 flex flex-col md:flex-row justify-between gap-8">
        {/* Logo + Branding */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2">
            {/* <Image
              src="/babcock-logo.png"
              alt="Babcock Health Logo"
              width={150}
              height={40}
              className="h-8 w-auto object-contain"
            /> */}
            <span className="font-black uppercase text-lg">
              Yabatech Health
            </span>
          </Link>
          <p className="max-w-xs text-muted-foreground/80">
            Your trusted healthcare platform connecting doctors, patients, and
            clinics seamlessly.
          </p>
          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="mt-2 flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="text-sm">Toggle Theme</span>
            </button>
          )}
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold">Quick Links</h3>
          <Link href="/appointments" className="hover:underline">
            Appointments
          </Link>
          <Link href="/pricing" className="hover:underline">
            Pricing
          </Link>
          <Link href="/doctor" className="hover:underline">
            Doctor Dashboard
          </Link>
          <Link href="/admin" className="hover:underline">
            Admin Dashboard
          </Link>
        </div>

        {/* Social Links */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold">Follow Us</h3>
          <div className="flex gap-4 mt-1">
            <Link href="#" className="hover:text-blue-500">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="hover:text-pink-500">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href="#" className="hover:text-blue-700">
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="border-t mt-6 pt-4 text-center text-muted-foreground/70 text-xs">
        &copy; {new Date().getFullYear()} Yabatech Health. All rights reserved.
      </div>
    </footer>
  );
}
