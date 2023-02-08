import { Specialty } from './specialty';

export interface Therapist {
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    description: string
    specialties: Array<Specialty>,
    tags: Array<string>;
}

export interface TherapistResponse {
    therapist: Therapist
}