export interface Doctor {
  id: string
  name: string
  email: string
  specialty: string
  credits: number
}

export interface Payout {
  id: string
  doctor: Doctor
  credits: number
  amount: number
  platformFee: number
  netAmount: number
  paypalEmail: string
  createdAt: string
  status: 'pending' | 'approved' | 'processed'
}

export interface PendingDoctor {
  id: string
  name: string
  email: string
  specialty: string
  qualifications: string
  yearsOfExperience: number
  registrationNumber: string
  createdAt: string
}

export interface VerifiedDoctor extends PendingDoctor {
  isActive: boolean
}
