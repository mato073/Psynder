export interface Specialty {
    _id: string,
    name: string,
    acronym: string,
    description: string
}


export interface GetSpecialtyResponse {
    specialty: Specialty
}