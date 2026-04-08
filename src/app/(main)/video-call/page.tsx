'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import VideoCallWithBooking from './video-call'

function VideoCallPageContent() {
  const searchParams = useSearchParams()

  // Get from query string
  const appointmentId = searchParams.get('appointmentId')

  // Convert to number
  const bookingId = appointmentId ? parseInt(appointmentId) : null

  // Handle missing appointmentId
  if (!bookingId || isNaN(bookingId)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Invalid Appointment ID</h1>
          <p className="text-muted-foreground mt-2">Please check your link and try again.</p>
        </div>
      </div>
    )
  }

  return <VideoCallWithBooking />
}

export default function VideoCallPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading video call...</p>
      </div>
    }>
      <VideoCallPageContent />
    </Suspense>
  )
}
