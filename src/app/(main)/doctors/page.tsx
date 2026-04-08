import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { SPECIALTIES } from '@/lib/specialities';

export default async function DoctorsPage() {
  return (
    <>
      <div className="flex flex-col items-center justify-center mb-8 text-center max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">Find Your Doctor</h1>
        <p className="text-muted-foreground text-lg">
          Browse by specialty or view all available healthcare providers
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
        {SPECIALTIES.map((specialty) => {
          const Icon = specialty.icon;

          return (
            <Link key={specialty.name} href={`/doctors/${specialty.name}`}>
              <Card className="hover:border-brand-700/40 transition-all cursor-pointer border-brand-900/20 h-full">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                  <div className="w-12 h-12 rounded-full bg-brand-900/20 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-brand-400" />
                  </div>

                  <h3 className="font-medium text-foreground">{specialty.name}</h3>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </>
  );
}
