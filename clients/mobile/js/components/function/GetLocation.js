import { Alert, Linking, PermissionsAndroid, Platform, ToastAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { location_reverseGeocoding, post_location } from '../../services/location_service'

const HasLocationPermissionIOS = async () => {
    const openSetting = () => {
        Linking.openSettings().catch(() => {
            Alert.alert('Unable to open settings');
        });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
        return true;
    }

    if (status === 'denied') {
        Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
        Alert.alert(
            `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
            '',
            [
                { text: 'Go to Settings', onPress: openSetting },
                { text: "Don't Use Location", onPress: () => {} },
            ],
        );
    }

    return false;
};

const HasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
        const hasPermission = await HasLocationPermissionIOS();
        return hasPermission;
        }

    if (Platform.OS === 'android' && Platform.Version < 23) {
        return true;
    }

    const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
        return true;
    }

    const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
    }

   /*  if (status === PermissionsAndroid.RESULTS.DENIED) {
        ToastAndroid.show(
            'Location permission denied by user.',
            ToastAndroid.LONG,
        );
    } 
    else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        ToastAndroid.show(
            'Location permission revoked by user.',
            ToastAndroid.LONG,
        );
    } */

    return false;
};

const GetAddressCity = (address) => {
    if (address.city !== undefined)
        return address.city
    if (address.town !== undefined)
        return address.town
    if (address.village !== undefined)
        return address.village
}

const GetLocation = async () => {
    const hasLocationPermission = await HasLocationPermission();

    if (!hasLocationPermission)
      return false;

    Geolocation.getCurrentPosition(
        async (position) => {
            const address = await location_reverseGeocoding(position.coords.latitude, position.coords.longitude);
            const city = GetAddressCity(address.address);
            await post_location("POST", false, position.coords.latitude, position.coords.longitude, 
                `${address.address.house_number !== undefined ? address.address.house_number : ""} ` + 
                `${address.address.road !== undefined ? address.address.road : ""} ` +
                `${address.address.postcode !== undefined ? address.address.postcode : ""} ${city}`)
        },
        (error) => {
            Alert.alert(`Code ${error.code}`, error.message);
            console.log(error);
        },
        {
            accuracy: {
                android: 'high',
                ios: 'best',
            },
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 10000,
            distanceFilter: 0,
            forceRequestLocation: true,
            showLocationDialog: true,
        }
    );
    return true;
};

export default GetLocation