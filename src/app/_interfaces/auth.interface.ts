interface BaseAuthUser {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  imageUrl: string | null
  gender: 'MALE' | 'FEMALE'
  credits: number
  verificationStatus: 'PENDING' | 'VERIFIED'
  isActive: boolean
  dob: string
  createdAt: string
  updatedAt: string
}

interface DoctorProfile {
  id: number
  userId: number
  isVerified: boolean
  medicalLicense: string
  specialization: string
  yearsOfExperience: number
  hospitalAffiliation: string
  professionalBio: string
  termsAccepted: boolean
  createdAt: string
  updatedAt: string
  credits: number
}

interface PatientProfile {
  id: number
  userId: number
  isStudent: boolean
  isExternal: boolean
  createdAt: string
  updatedAt: string
  credits: number
}

export type AuthUser =
  | (BaseAuthUser & {
      role: 'DOCTOR'
      doctor: DoctorProfile
      patient: null
    })
  | (BaseAuthUser & {
      role: 'PATIENT'
      doctor: null
      patient: PatientProfile
    })
  | (BaseAuthUser & {
      role: 'ADMIN'
      doctor: null
      patient: null
    })
