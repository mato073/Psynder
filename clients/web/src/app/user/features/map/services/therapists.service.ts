import {Injectable, ApplicationRef} from "@angular/core";
import { HttpClient, HttpRequest, HttpParams, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SharedModule } from '../../../../shared/shared.module';
import { environment } from 'src/environments/environment';
import { Therapist } from '../../../../shared/models/therapist.model';
import { TTherapist, CloseToMeRes } from '../interfaces/therapist';
import { GetSpecialtyResponse, Specialty } from '../interfaces/specialty';
// import { ServerResponse } from '../../../../shared/interfaces/server-response';

@Injectable({
    providedIn: SharedModule
})
export class TherapistsService {
	baseUrl = environment.backendUrl;

    private specialties : {title: string, color: string, description: string}[] = [
        {title: "TCC", color: "bg-yellow-400", description: "Les thérapies (cognitivo)-comportementales ont pour objectif de remplacer, de façon concrète, observable et durable, des réactions problématiques par des conduites souhaitées. Pour ce faire, elles se basent principalement sur des acquis de la psychologie scientifique. Le style des praticiens se caractérise, en principe, par le respect du patient/client, un esprit de collaboration, la transparence et l’incitation à expérimenter activement de nouveaux comportements."},
        {title: "PA", color: "bg-primary-400", description: "La psychanalyse est une exploration du psychisme humain et principalement de l'inconscient"},
        {title: "PB", color: "bg-green-400", description: "L'approche béhavioriste vise à mettre au jour des relations statistiquement significatives entre les variables de l'environnement et les mesures du comportement étudié sans faire appel au psychisme comme mécanisme explicatif."}
    ];
    private resetValidatedTherapists: boolean = true;
    
    /* Result from base request to fetch all close therapists */ 
    private therapists: Therapist[] = [];
    
    /* Observable therapists, so other components detect changes */
    public observableTherapists : BehaviorSubject<Therapist[]> = new BehaviorSubject<Therapist[]>(null);

    /* Therapists that are actually shown on user screen */
    public validatedTherapists: Therapist[] = [];


    constructor(
        private ref: ApplicationRef,
        private location: Location,
        private http: HttpClient
        ) {
        let it = this.specialties.values();
        this.therapists = [];
        this.validatedTherapists = this.therapists;
    }

    fetchTherapistSpecialties(therapist: Therapist, specialtyIds: Array<string>) {
        for (let specialty of specialtyIds) {
            const url = `${this.baseUrl}/specialties/${specialty}`
            this.http.get(url).subscribe((res: GetSpecialtyResponse) => {
                therapist.specialties.push(res.specialty);
            }, (err) => console.error(err));
        }
    }

    getTherapists(lat, long) {
        const url = `${this.baseUrl}/therapists/close-to-me`;
        let params = new HttpParams({
            fromObject: {
                lat: lat,
                lng: long
            }
        });
        this.http.get(url, { params: params })
                       .subscribe((res: CloseToMeRes) => {
            let tmpTherapists: Array<TTherapist> = JSON.parse(res.therapists);
            this.therapists = [];
            let therapistIndex = 0;
            for (let t of tmpTherapists) {
                this.therapists.push(
                    {
                        name: t.firstName + ' ' + t.lastName,
                        email: t.email,
                        phoneNumber: t.phoneNumber,
                        initials: t.firstName[0] + t.lastName[0],
                        location: {
                            latitude: t.location.lat,
                            longitude: t.location.lng,
                        },
                        avatar: "/assets/png/avatars/avatar_0.png",
                        specialties: [],
                        score: t.matchingPercentage ? t.matchingPercentage : 0,
                        averageSessionPrice: 0,
                        distance: t.distanceInKm,
                        sex: 'Homme',
                        description: t.description
                    }
                );
                this.fetchTherapistSpecialties(this.therapists[therapistIndex], t.specialties);
                therapistIndex++;
            }
            this.validatedTherapists = this.therapists;
            this.sortByHighestScore();
            this.observableTherapists.next(this.validatedTherapists);
            return this.therapists;
        }, (err) =>{
            console.log(err);
            return []
        });
    }

    getTherapistByName(name: string) {
        return this.therapists.find(obj => {
            return obj.name == name;
        });
    }

    setTherapistDistance(name: string, distance: number) {
        let index = this.therapists.findIndex(obj => {
            return obj.name === name;
        });
        let validated_index = this.validatedTherapists.findIndex(obj => {
            return obj.name === name;
        });
        if (index !== -1)
            this.therapists[index].distance = distance;
        if (validated_index === -1)
            return;
        this.validatedTherapists[validated_index].distance = distance;
    }

    searchForKeyword(expr: string) {
        if (this.resetValidatedTherapists)
            this.validatedTherapists = this.therapists;
            
        this.validatedTherapists = this.therapists.filter(obj => {
            return obj.name.toLowerCase().includes(expr.toLowerCase()) || obj.specialties.findIndex((el: Specialty) => el.name.toLowerCase().includes(expr.toLowerCase())) !== -1
        });
        /* for (let i = 0; i < this.validatedTherapists.length; ++i) {
            if (this.validatedTherapists[i] !== undefined) {
                let queryset = JSON.stringify(this.validatedTherapists[i]);
                if (!queryset.includes(expr))
                    this.validatedTherapists.splice(i, 1); 
                }
        } */
        this.resetValidatedTherapists = false;
    }

    sortByHighestScore() {
        this.validatedTherapists = this.validatedTherapists.sort((a, b) => (a.score < b.score) ? 1 : -1);
    }

    sortByShortestDistance() {
        this.validatedTherapists = this.validatedTherapists.sort((a, b) => (a.distance > b.distance) ? 1 : -1);
    }

    sortByLowestPrice() {
        this.validatedTherapists.sort((a, b) => (a.averageSessionPrice > b.averageSessionPrice) ? 1 : -1);
    }

    reset() {
        this.validatedTherapists = this.therapists;
        this.resetValidatedTherapists = false;
    }
}