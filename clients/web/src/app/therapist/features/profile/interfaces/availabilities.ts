import { TimeSlot } from "./timeslot";

export interface DayAvailabilities {
    day: string,
    timeSlots: Array<TimeSlot>
}

export interface Availabilities {
    days: Array<DayAvailabilities>
}