import { User } from './user';

export interface Appointment {
    _id: string,
    date: string,
    durationInMin: number,
    therapist: string,
    user: User
}

export interface AppointmentsResponse {
    appointments: Array<Appointment>
}
