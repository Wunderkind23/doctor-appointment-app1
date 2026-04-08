'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Chat from './chat'

function ChatPageContent() {
  const searchParams = useSearchParams()

  const appointmentId = searchParams.get('appointmentId')
  const userType = (searchParams.get('type') as 'patient' | 'doctor') || 'patient'
  const bookingId = appointmentId ? parseInt(appointmentId) : null

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

  return <Chat roomId={appointmentId} userType={userType} />
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading chat...</p>
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  )
}
