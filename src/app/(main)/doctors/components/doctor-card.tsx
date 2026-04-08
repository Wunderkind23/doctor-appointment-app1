/* eslint-disable @next/next/no-img-element */
'use client';

import { User, Star, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DoctorsWithRatingAttributeI } from '../../doctor/hooks/useFetchDocBySpecialization';

interface DoctorCardProps {
  doctor: DoctorsWithRatingAttributeI;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <Card className="border-brand-900/20 hover:border-brand-700/40 transition-all">
      <CardContent>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-900/20 flex items-center justify-center flex-shrink-0">
            {doctor?.user?.imageUrl ? (
              <img
                src={doctor?.user?.imageUrl}
                alt={doctor?.user?.firstName}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-brand-400" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <h3 className="font-medium text-foreground text-lg">{`Dr. ${doctor?.user?.firstName} ${doctor?.user?.lastName}`}</h3>
              {doctor.isVerified && (
                <Badge
                  variant="outline"
                  className="bg-brand-900/20 border-brand-900/30 text-brand-400 self-start"
                >
                  <Star className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground mb-1">
              {doctor.specialization} • {doctor.yearsOfExperience} years experience
            </p>

            {true && (
              <div className="flex items-center gap-1 mb-2">
                <span className="text-sm text-muted-foreground">{doctor.rating || 2.5}</span>
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              </div>
            )}

            <div className="mt-2 line-clamp-2 text-sm text-muted-foreground mb-4">
              {doctor.professionalBio}
            </div>

            <Button asChild className="w-full bg-brand-500 hover:bg-brand-600 mt-2 dark:text-white">
              <Link href={`/doctors/${doctor.specialization}/${doctor.id}`}>
                <Calendar className="h-4 w-4 mr-2" />
                View Profile & Book
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
