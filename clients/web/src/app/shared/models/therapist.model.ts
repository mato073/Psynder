import { Specialty } from '../../user/features/map/interfaces/specialty';

export class Therapist {
    public name: string;
    public email: string;
    public phoneNumber: string;
    public initials: string;
    public location: {latitude: number, longitude: number};
    public avatar: string;
    public specialties: Array<Specialty>; // {title: string, color: string, description: string};
    public score: number;
    public averageSessionPrice: number;
    public distance: number;
    public sex: string;
    public description: string;
}