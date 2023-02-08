import { Locale } from 'date-fns';
import { Specialty } from './specialty';


export interface Position {
    lat: number,
    lng: number
}


export interface Location {
    _id: string,
    lat: number,
    lng: number,
    formattedAddress: string,
}

export interface LocationResponseObject {
    _id: string,
    lat: { 
        $numberDecimal: string
    },
    lng: { 
        $numberDecimal: string
    },
    formattedAddress: string,
    owner: string,
    ownerIsTherapist: boolean   
}

export interface LocationResponse {
    location: LocationResponseObject
}
