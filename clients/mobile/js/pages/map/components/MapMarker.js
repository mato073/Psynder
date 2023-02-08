import React from 'react'
import { Circle, Marker } from 'react-native-maps';

export const MarkerUserLocation = (props) => {
    const { localization } = props

    return (
        <Marker
            cluster={false}
            tracksViewChanges={false}
            coordinate={{
                latitude: localization.lat,
                longitude: localization.lng
            }}/>
    )
}

export const MapCircle = (props) => {
    const { localization, distanceRadius } = props

    return (
        <Circle
            tracksViewChanges={false}
            center={{
                latitude: localization.lat,
                longitude: localization.lng
            }}
            radius={distanceRadius * 1000}
            strokeWidth={1}
            strokeColor={'#1797e8'}
            fillColor={'rgba(230, 238, 255, 0.3)'}/>
    )
}