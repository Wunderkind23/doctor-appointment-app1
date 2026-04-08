import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { GenderEnum, UserRoleEnum } from '../types';

/**
 * Patient Signup Request Interface
 */
export interface PatientSignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  dob: string;
  gender: GenderEnum;
  role: UserRoleEnum;
  matricNumber: string;
}

/**
 * Patient Signup Response Interface
 */
export interface PatientSignupResponse {
  message: string;
}

/**
 * Patient Signup API Hook
 *
 * Backend Expected Payload:
 * {
 *   firstName: string - Patient's first name
 *   lastName: string - Patient's last name
 *   email: string - Patient's email address
 *   password: string - Password (min 8 chars, must include uppercase, number, special char)
 *   phoneNumber: string - Patient's phone number
 *   dob: string - ISO format date (YYYY-MM-DD)
 *   gender: 'MALE' | 'FEMALE' - Patient's gender
 *   role:
 * }
 *
 * Backend Expected Response:
 * {
 *   success: boolean - Whether signup was successful
 *   message: string - Success or error message
 *   token?: string - JWT authentication token (if auto-login)
 *   user?: {...} - User data if auto-login
 * }
 */
const signupPatient = async (props: PatientSignupRequest): Promise<PatientSignupResponse> => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;

  const url = `${backendUrl}/auth/signup`;
  const response = await axios.post(url, props);

  return response.data;
};

export const usePatientSignup = () => {
  return useMutation({
    mutationFn: (props: PatientSignupRequest) => signupPatient(props),
  });
};
