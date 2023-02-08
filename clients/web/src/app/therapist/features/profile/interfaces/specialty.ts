export interface Specialty {
    _id: string,
    name: string,
    acronym: string,
    description: string,
    managedDisorders: Array<any>
}

export interface ListExistingSpecialtiesResponse {
    specialties: Array<Specialty>
}

export interface CreateSpecialtyResponse {
    specialtyId: string
}
