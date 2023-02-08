export interface User {
    _id: string,
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    potentialDisorders: Array<any>
}

export interface ClientsResponse {
    clients: string
}
