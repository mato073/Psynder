export interface User {
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    potentialDisorder: string
}


export interface UserResponse {
    user: User
}

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