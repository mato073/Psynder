export interface LLocation {
    lat: number,
    lng: number,
    formattedAddress: string
}

export interface TTherapist {
    _id: string,
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    specialties: Array<string>,
    alreadyTreated: Array<any>,
    location: LLocation,
    distanceInKm: number,
    matchingPercentage: number,
    description: string
}

export interface CloseToMeRes {
    therapists: string // Array<TTherapist>;
}