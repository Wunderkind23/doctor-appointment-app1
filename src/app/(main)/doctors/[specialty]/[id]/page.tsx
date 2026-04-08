'use client'

import { use } from 'react'
import { DoctorProfile } from './_components/doctor-profile'
import { useFetchSingleDoc } from '@/app/(main)/doctor/hooks/useFetchSingleDoc'
import { Loader2Icon } from 'lucide-react'

interface DoctorDetailPageProps {
  params: Promise<{ id: string }>
}

export default function DoctorProfilePage({ params }: DoctorDetailPageProps) {
  const { id } = use(params)
  const { data, isFetching, isError, error } = useFetchSingleDoc(id)

  if (isFetching) {
    return (
      <div className="text-center py-12">
        <Loader2Icon className="animate-spin" />
        <p className="text-muted-foreground">Loading doctor profile...</p>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">
          {error instanceof Error ? error.message : 'Doctor not found'}
        </p>
      </div>
    )
  }

  return <DoctorProfile singleDoc={data} />
}
