import { Injectable } from '@angular/core';

@Injectable()
export class MapUtilsService {

    private percentColors = [
        { pct: 0.0, color: { r: 240, g: 93, b: 94 } },
        { pct: 0.5, color: { r: 250, g: 192, b: 94 } },
        { pct: 1.0, color: { r: 0, g: 196, b: 154 } } 
    ];
    mapCenterCoords: {latitude: number, longitude: number};

    maxDistance: number = 30000;

    // COLOR
    getColorFromPercentage(pct) : string {
        for (var i = 1; i < this.percentColors.length - 1; i++) {
            if (pct < this.percentColors[i].pct) {
                break;
            }
        }
        var lower = this.percentColors[i - 1];
        var upper = this.percentColors[i];
        var range = upper.pct - lower.pct;
        var rangePct = (pct - lower.pct) / range;
        var pctLower = 1 - rangePct;
        var pctUpper = rangePct;
        var color = {
            r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
            g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
            b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
        };
        return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
    };
    
    // DISTANCE
    setMapCenterCoords(coords: {latitude: number, longitude: number}) {
        this.mapCenterCoords = coords;
    }

    
    getFlightDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in kilometers
        var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
        var dLon = this.deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c; // Distance in KM
            return d;
    }
    
    private deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    updateMaxDistance(pct) {
        // max distance max: 60 meters
        this.maxDistance = pct / 100 * 60000;
    }
}