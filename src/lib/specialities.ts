import {
  Stethoscope,
  HeartPulse,
  Sparkles,
  Bone,
  Baby,
  Brain,
  Dna,
  Eye,
  Ear,
  Droplets,
  UserRound,
  Utensils,
  Wind,
  Activity,
  FlaskConical,
} from 'lucide-react'

import type { LucideIcon } from 'lucide-react'

export type Specialty = {
  name: string
  icon: LucideIcon
}

export const SPECIALTIES: Specialty[] = [
  { name: 'General-Practice', icon: Stethoscope },
  { name: 'Cardiology', icon: HeartPulse },
  { name: 'Dermatology', icon: Sparkles },
  { name: 'Orthopedics', icon: Bone },
  { name: 'Pediatrics', icon: Baby },
  { name: 'Psychiatry', icon: Brain },
  { name: 'Neurology', icon: Dna },
  { name: 'Ophthalmology', icon: Eye },
  { name: 'ENT', icon: Ear },
  { name: 'Urology', icon: Droplets },
  { name: 'Gynecology', icon: UserRound },
  { name: 'Gastroenterology', icon: Utensils },
  { name: 'Pulmonology', icon: Wind },
  { name: 'Rheumatology', icon: Activity },
  { name: 'Endocrinology', icon: FlaskConical },
]
