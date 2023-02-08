import React, { useEffect, useState, useRef } from 'react'
import { View, StyleSheet, Keyboard } from 'react-native';
import { MAP_TYPES } from 'react-native-maps';
import MapView from "react-native-map-clustering";
import { connect, useDispatch } from 'react-redux'
import { Text } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import { Marker } from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ProgressCircle from 'react-native-progress-circle'

import { get_therapist_close_to_user, post_location } from '../../services/location_service'
import { get_location_request } from '../../Redux/Actions/Actions';
import { getLocalization} from '../../Redux/Saga/selectors/selector';

//Import our components
import Loader from '../../components/Loader';
import { SwitchColor } from '../../components/function/SwitchColorProgressBar'
import GetLocation from '../../components/function/GetLocation'
import LinearGradientButton from '../../components/LinearGradientButton'
import SnackBar from '../../components/SnackBar'
import TextInputAutoComplete from '../../components/TextInputAutoComplete'
import Error from '../Error'
import { CheckDataLoading, CheckDataError } from '../../components/function/CheckData';
import { OneTherapistCardView, AllTherapistCardView } from './components/MapCards'
import TopButtons from './components/TopButtons';
import NoTherapistView from './components/NoTherapistView';
import { MarkerUserLocation, MapCircle } from './components/MapMarker';
import SearchOptionModal from './components/SearchOptionModal';
import CustomAvatar from "../../components/CustomAvatar"

const Map = (props) => {
  const mapRef = useRef();

  const dispatch = useDispatch()

  const [permissionsDeny, setPermissionsDeny] = useState(false);

  const [displayDistanceChoose, setDisplayDistanceChoose] = useState(60);
  const [distanceChoose, setDistanceChoose] = useState(60);
  const [distanceRadius, setDistanceRadius] = useState(60);
  const [searchOptionModalVisible, setSearchOptionModalVisible] = useState(false);
  const [therapistList, setTherapistList] = useState(null);
  const [oneTherapistId, setOneTherapistId] = useState(null)
  const [oneTherapistInfo, setOneTherapistInfo] = useState(false);
  const [allTherapistInfo, setAllTherapistInfo] = useState(false);

  const [noTherapistViewVisible, setNoTherapistViewVisible] = useState(false);
  const [snackBarVisible, setSnackBarVisible] = React.useState(false);
  const [snackBarText, setSnackBarText] = React.useState('');
  const [loader, setLoader] = React.useState(true);

  const [switchEnabled, setSwitchEnabled] = React.useState(false)
  const [autoCompleteText, setAutoCompleteText] = React.useState('');
  const [autoCompleteLocationData, setAutoCompleteLocationData] = React.useState({
    address: '',
    lat: null,
    lng: null
  });

  useEffect(async () => {
    if (props.localization.data === null && props.localization.success === true) {
      const locationSuccessful = await GetLocation()
      if (locationSuccessful === false)
        setPermissionsDeny(true)
    }
    else if (props.localization.data !== null && props.localization.success === true) {
      AnimateToRegion(props.localization.data.lat, props.localization.data.lng, 2)
      GetTherapistCloseToUser(distanceRadius);
    }
  }, [props.localization]);

  useEffect(async () => {
    GetData();
  }, []);

  const GetData = () => {
    dispatch(get_location_request(false));
  }

  const GetTherapistCloseToUser = async (distance) => {
    setLoader(true)
    const therapistClose = await get_therapist_close_to_user(props.localization.data.lat, props.localization.data.lng, distance);
    console.log(therapistClose)
    if (therapistClose === null) {
      setTherapistList([])
      setSnackBarVisible(true)
      setSnackBarText("Une erreur est survenue lors du chargement de la liste des thérapeutes")
      setNoTherapistViewVisible(true)
    }
    else if (therapistClose === "[]") {
      setTherapistList([])
      setNoTherapistViewVisible(true)
    }
    else {
      setTherapistList(JSON.parse(therapistClose))
      setNoTherapistViewVisible(false)
    }
    setLoader(false)
  }

  const SnackBarPopUp = () => {
    if (snackBarVisible === true)
      return (
        <SnackBar visible={snackBarVisible} theme={"error"} text={snackBarText} actualVisible={(isVisible) => setSnackBarVisible(isVisible)}/>
      );
  }

  const AnimateToRegion = (latitude, longitude, distance) => {
    const region = {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: distance,
      longitudeDelta: distance,
    };
    mapRef.current.animateToRegion(region, 2000);
  };

  const CloseTherapistView = () => {
    setOneTherapistInfo(false);
    setAllTherapistInfo(false);
  }

  const OnAddressChange = async (isFirstPost) => {
    if (autoCompleteText.length > 0 && autoCompleteText !== autoCompleteLocationData.address) {
      setSnackBarVisible(true)
      setSnackBarText("L'adresse n'est pas valide, sélectionner une adresse dans l'auto-complétion")
      return false;
    }
    else if (autoCompleteText.length > 0 && props.localization.data.address === autoCompleteLocationData.address) {
      setSnackBarVisible(true)
      setSnackBarText("Cette adresse est déjà enregistrée")
      return false;
    }
    else if (autoCompleteText.length > 0) {
      const result = await post_location(isFirstPost === true ? "POST" : "PATCH", false, autoCompleteLocationData.lat, autoCompleteLocationData.lng, autoCompleteLocationData.address)
      if (result === false) {
        setSnackBarVisible(true)
        setSnackBarText("Une erreur est survenue lors de l'enregistrement de votre adresse")
        return false;
      }
      else {
        setAutoCompleteText('')
        return true;
      }
    }
    return false;
  }

  const ValidateSearchOption = async () => {
    Keyboard.dismiss()
    if (switchEnabled === false) {
      if (autoCompleteText.length > 0) {
        const AddressChangeSuccess = await OnAddressChange(false);
        if (AddressChangeSuccess === true)
          AnimateToRegion(autoCompleteLocationData.lat, autoCompleteLocationData.lng, 3)
        else
          return
      }
    }
    setDistanceRadius(distanceChoose);
    setSearchOptionModalVisible(false)
    await GetTherapistCloseToUser(distanceChoose);
  }

  const GoogleMapsView = () => {
    return (
      <MapView
        ref={mapRef}
        provider={null}
        mapType={MAP_TYPES.STANDARD}
        rotateEnabled={false}
        style={styles.map}
        initialRegion={{
          latitude: props.localization.data.lat,
          longitude: props.localization.data.lng,
          latitudeDelta: 3,
          longitudeDelta: 3
        }}>
        <MarkerUserLocation localization={props.localization.data}/>
       {therapistList !== null 
        &&
          therapistList.map((therapist, key) => {
            return (
              <Marker
                key={key}
                tracksViewChanges={false}
                onPress={() => {
                  setAllTherapistInfo(false);
                  setOneTherapistInfo(true);
                  setOneTherapistId(therapist._id);
                }}
                coordinate={{
                  latitude: therapist.location.lat,
                  longitude: therapist.location.lng,
                }}>
                <View style={{alignItems: "center"}}>
                  <View style={styles.markerTextView}>
                    <MaterialIcons name="directions-walk" color={"#555555"} size={12}/>
                    <Text style={styles.markerText}>{therapist.distanceInKm}km</Text>
                  </View>
                  <ProgressCircle
                    percent={therapist.matchingPercentage}
                    radius={21}
                    borderWidth={2}
                    color={SwitchColor(therapist.matchingPercentage)}
                    shadowColor="white"
                    bgColor="white">
                    <CustomAvatar image={require('../../../assets/patien.png')} borderWidth={0} width={40} height={40}/>
                  </ProgressCircle>
                </View>
              </Marker>
            )
          })
        }
        <MapCircle localization={props.localization.data} distanceRadius={distanceRadius}/>
      </MapView>
    )
  }

  const ValidateSetAddress = async () => {
    const AddressChangeSuccess = await OnAddressChange(true);
    if (AddressChangeSuccess === true)
      setPermissionsDeny(false);
  }

  if (CheckDataError([props.localization.error]) === true)
    return (
      <Error reloadData={GetData}/>
    )
  else if (CheckDataLoading([props.localization]) === true)
    return (
      <Loader />
    )
  else {
      return permissionsDeny === true || (props.localization.data === null && props.localization.success === true)
      ?
      (
        <View style={{marginHorizontal: 15, marginTop: 50}}>
          {SnackBarPopUp()}
          <View style={{marginBottom: 30}}>
            <Text style={{fontWeight: 'bold', textAlign: "center", fontSize: 17}}>
              Entrez une adresse pour pouvoir utiliser la carte de thérapeutes
            </Text>
          </View>
          <View style={{marginBottom: 30}}>
            <TextInputAutoComplete
              placeholder={"Indiquez une adresse"}
              autoCompleteText={autoCompleteText}
              setAutoCompleteText={(text) => setAutoCompleteText(text)}
              setAutoCompleteLocationData={(locationData) => setAutoCompleteLocationData(locationData)}/>
          </View>
          <LinearGradientButton 
            theme={"User"}
            textSize={15}
            onPress={() => ValidateSetAddress()}
            icon={<Entypo name="check" color={'white'} size={18}/>}
            text={"Valider l'adresse"}/>
        </View>
      )
      :
      (
        <View style={styles.container}>
          {loader === true && <Loader loading={loader}/>}
          {SnackBarPopUp()}
          {noTherapistViewVisible === true && 
            <NoTherapistView setNoTherapistViewVisible={setNoTherapistViewVisible}
              getTherapistCloseToUser={GetTherapistCloseToUser} distanceRadius={distanceRadius}/>}
          {GoogleMapsView()}
          <TopButtons setSearchOptionModalVisible={setSearchOptionModalVisible}
            setOneTherapistInfo={setOneTherapistInfo} therapistList={therapistList}
            setAllTherapistInfo={setAllTherapistInfo}/>
          {searchOptionModalVisible === true && 
            <SearchOptionModal searchOptionModalVisible={searchOptionModalVisible} 
              setSearchOptionModalVisible={setSearchOptionModalVisible} oneTherapistInfo={oneTherapistInfo}
              localization={props.localization.data} autoCompleteText={autoCompleteText}
              setAutoCompleteText={setAutoCompleteText} setAutoCompleteLocationData={setAutoCompleteLocationData}
              distanceChoose={distanceChoose} setDistanceChoose={setDistanceChoose} 
              setDisplayDistanceChoose={setDisplayDistanceChoose} displayDistanceChoose={displayDistanceChoose}
              ValidateSearchOption={ValidateSearchOption} switchEnabled={switchEnabled}/>
          }
          <View style={{position: "absolute"}}>
            {oneTherapistInfo === true && 
              <OneTherapistCardView closeTherapistView={CloseTherapistView} oneTherapistInfo={oneTherapistInfo}
                therapistList={therapistList} oneTherapistId={oneTherapistId} animateToRegion={AnimateToRegion}
                navigation={props.navigation} />
            }
            {allTherapistInfo === true &&
              <AllTherapistCardView closeTherapistView={CloseTherapistView} oneTherapistInfo={oneTherapistInfo}
                therapistList={therapistList} animateToRegion={AnimateToRegion} navigation={props.navigation} />
            }
          </View>
        </View>
      )
  }
};

const mapStateToProps = (state) => ({
  localization: getLocalization(state)
});

export default connect(mapStateToProps)(Map);

const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
      flex: 1
    },
    markerTextView: {
      flexDirection: "row",
      paddingHorizontal: 1, 
      borderRadius: 5, 
      borderWidth: 0.5,
      backgroundColor: "#fff",
      borderColor: 'black',
    },
    markerText: {
      color: "#696969", 
      alignSelf: 'center', 
      fontSize: 10
    }
});