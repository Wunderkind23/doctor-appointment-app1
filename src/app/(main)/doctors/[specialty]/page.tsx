'use client'

import { use } from 'react'
import { DoctorCard } from '../components/doctor-card'
import { PageHeader } from '@/components/page-header'
import { useFetchDocBySpecialization } from '../../doctor/hooks/useFetchDocBySpecialization'

interface DoctorSpecialtyPageProps {
  params: Promise<{ specialty: string }>
}

export default function DoctorSpecialtyPage({ params }: DoctorSpecialtyPageProps) {
  const { specialty } = use(params)

  const { data, isFetching, isError, error } = useFetchDocBySpecialization(specialty)

  return (
    <div className="space-y-5">
      <PageHeader
        title={specialty.charAt(0).toUpperCase() + specialty.slice(1)}
        backLink="/doctors"
        backLabel="All Specialties"
      />

      {isFetching ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading doctors...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-red-400">
            Error: {error instanceof Error ? error.message : 'Failed to load doctors'}
          </p>
        </div>
      ) : data && data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-white mb-2">No doctors available</h3>
          <p className="text-muted-foreground">
            There are currently no verified doctors in this specialty. Please check back later or
            choose another specialty.
          </p>
        </div>
      )}
    </div>
  )
}
