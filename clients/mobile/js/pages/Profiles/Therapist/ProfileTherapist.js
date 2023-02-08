import React, { useEffect }from 'react';
import { StyleSheet, ScrollView, View, Alert } from 'react-native';
import { Avatar, Text, Title, Chip } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';

import Fontisto from 'react-native-vector-icons/Fontisto';

import { connect, useDispatch } from 'react-redux';
import { logOut } from '../../../Redux/Actions/Actions'
import { deleteUser } from '../../../services/user_service'
import { get_specialitys } from '../../../services/speciality_service'
import LinearGradientButton from '../../../components/LinearGradientButton'

import IconAndText from '../../../components/IconAndText'

import { getUserData, getLocalization} from '../../../Redux/Saga/selectors/selector';
import { get_location_request, get_user_data_request } from '../../../Redux/Actions/Actions';
import { CheckDataLoading, CheckDataError } from '../../../components/function/CheckData';

import TherapistInfos from './Components/therapistInfos'
import TherapistPrivate from './Components/therapistPrivate'
import TherapistSpecialty from './Components/therapistSpeciality'
import DeleteSpeciality from './Components/DeleteSpeciality'
import TherapistAddres from './Components/therapistAddres';
import ThemeCheckBox from '../ThemeCheckBox';
import SupportButtons from '../SupportButtons';
import Loader from '../../../components/Loader';
import Error from '../../Error'

const B = (props) => <Text style={{ fontWeight: 'bold' }}>{props.children}</Text>

const ProfileTherapist = (props) => {

    const dispatch = useDispatch()

    const { colors } = useTheme()

    const [item, setItem] = React.useState();
    const [page4, setPage4] = React.useState(false);
    const [visib, setVisible] = React.useState(false);
    const [privat, setPrivat] = React.useState(false);
    const [visibSpe, setVisibSpe] = React.useState(false);
    const [visibAd, setVisibAd] = React.useState(false);
    const [isLogOut, setIsLogOut] = React.useState(false);
    const [allspecialt, setAllSpecialt] = React.useState();
    const [tempSpecialty, setTempSpecialty] = React.useState();

    useEffect(() => {
        GetData()
    }, [dispatch]);
    
    const GetData = () => {
        dispatch(get_user_data_request(true));
        dispatch(get_location_request(true));
    }

    const visibleModal = () => {
        setVisible(!visib);
    }
    const visiblAddres = () => {
        setVisibAd(!visibAd);
    }

    const visibPrivat = () => {
        setPrivat(!privat);
    }

    const visibleSpe = () => {
        setVisibSpe(!visibSpe);
    }

    const userAvatar = () => {
        if (!props.userdata.data.therapist.image) {
            return (
                <View style={styles.avatarView}>
                    <Avatar.Image size={130} source={require('../../../../assets/png/patien.png')} />
                </View>
            )
        } else {
            return (
                <View style={styles.avatarView}>
                    <Avatar.Image size={130} source={{ uri: props.userdata.data.user.image }} />
                </View>
            )
        }
    }

    const header = () => {
        return (
            <View style={styles.header}>
                <View style={styles.avatar}>
                    {userAvatar()}
                </View>
            </View>
        );
    }

    const logoutUser = async () => {
        setIsLogOut(true);
        props.dispatch(logOut())
    }

    const delUser = () => {
        deleteUser(true);
        props.dispatch(logOut());
    }

    const specialtiesList = () => {
        const list = props.userdata.data.therapist.specialties;

        const select = ({ name, _id, acronym, description }) => {
            setItem({ name, _id, acronym, description });
            setPage4(true);
        }

        return list.map((specialtie, key) => {
            return (
                <Chip key={key} theme={{dark: false}} style={styles.listItem} onPress={() => select(specialtie)}>
                    <Text style={{color: "#555555"}}>{specialtie.name.replace(/(\r\n|\n|\r)/gm, " ")}</Text>
                </Chip>
            )
        })
    }

    const alertDel = () => {
        Alert.alert(
            'Supprimer le compte',
            'Êtes-vous sûr de vouloir supprimer votre compte ?',
            [
                {
                    text: 'Annuler',
                    onPress: () => console.log('Anuller'),
                    style: 'Annuler'
                },
                { text: 'Oui', onPress: () => delUser(), style: 'cancel' }
            ],
            { cancelable: true }
        )
    }


    const body = () => {
        const user = props.userdata.data.therapist
        const name = `${user.firstName} ${user.lastName}`;
        let address = "Pas d'adresse renseignée";
        if (props.localization.data !== "" && props.localization.data !== null) {
            address = props.localization.data.address;
        }
        return (
            <View style={styles.body}>
                <View style={styles.infos}>
                    <Title style={{textAlign: 'center', color: colors.text}}>Mes spécialités</Title>
                    <View style={styles.data}>
                        <View style={{marginHorizontal: 15}}>
                            {specialtiesList()}
                        </View>
                    </View>
                    <View style={{marginHorizontal: 50, marginBottom: 20}}>
                        <LinearGradientButton theme={"Therapist"} textSize={13} onPress={visibleSpe} text={'Ajouter'} />
                    </View>
                </View>

                <View style={styles.infos}>
                    <View style={styles.data}>
                        <IconAndText text={address} textSize={16}
                            icon={<Fontisto style={styles.iconsMargin} name="map-marker-alt" size={20} color={colors.icon}/>}/>
                    </View>
                    <View style={{marginHorizontal: 50, marginBottom: 20}}>
                        <LinearGradientButton theme={"Therapist"} textSize={13} onPress={visiblAddres} text={'Editer'} />
                    </View>
                </View>
                <View style={styles.infos}>
                    <View style={styles.data}>
                        <IconAndText text={name} textSize={16}
                            icon={<Fontisto style={styles.iconsMargin} name="male" size={20} color={colors.icon}/>}/>
                    </View>
                    <View style={styles.data}>
                        <IconAndText text={user.phoneNumber !== "" ? user.phoneNumber : "Pas de numéro de téléphone renseigné"} textSize={16}
                            icon={<Fontisto style={styles.iconsMargin} name="phone" size={20} color={colors.icon}/>}/>
                    </View>
                    <View style={{marginHorizontal: 50, marginBottom: 20}}>
                        <LinearGradientButton theme={"Therapist"} textSize={13} onPress={visibleModal} text={'Editer'} />
                    </View>
                </View>
                <View style={styles.infos}>
                    <View style={styles.data}>
                        <IconAndText text={user.email} textSize={16}
                            icon={<Fontisto style={styles.iconsMargin} name="email" size={20} color={colors.icon}/>}/>
                    </View>
                    <View style={styles.data}>
                        <IconAndText text={"**********"} textSize={16}
                            icon={<Fontisto style={styles.iconsMargin} name="locked" size={20} color={colors.icon}/>}/>
                    </View>
                    <View style={{marginHorizontal: 50, marginBottom: 20}}>
                        <LinearGradientButton theme={"Therapist"} textSize={13} onPress={visibPrivat} text={'Editer'} />
                    </View>
                </View>

                <View style={styles.infos}>
                    <View style={styles.data}>
                        <ThemeCheckBox />
                    </View>
                </View>
                <View style={styles.infos}>
                    <View style={styles.data}>
                        <SupportButtons />
                    </View>
                </View>

                <View >
                    <View style={{ paddingLeft: 10, paddingRight: 10, marginBottom: 20, marginTop: 20 }}>
                        <LinearGradientButton theme={"Grey"} textSize={16} onPress={logoutUser} text={'Déconnexion'} />
                    </View>
                </View>
                <View >
                    <View style={{ paddingLeft: 10, paddingRight: 10, marginBottom: 30  }}>
                        <LinearGradientButton theme={"Red"} textSize={16} onPress={alertDel} text={'Supprimer compte'} />
                    </View>
                </View>
            </View>);
    }

    useEffect(() => {
        let result;
        const getSpe = async () => {
            result = await get_specialitys();
            setAllSpecialt(result.specialties);
            setTempSpecialty(result.specialties);
        }

        getSpe();
    }, [get_specialitys]);

    if (CheckDataError([props.userdata.error, props.localization.error]) === true)
        return (
            <Error reloadData={GetData}/>
        )
    else if (CheckDataLoading([props.userdata, props.localization]) === true)
        return (
            <Loader />
        )
    else {
        return (
            <View>
                <ScrollView>
                    <TherapistInfos therapist={props.userdata.data.therapist} visib={visib} visibleModal={() => visibleModal()} />
                    <TherapistPrivate therapist={props.userdata.data.therapist} privat={privat} visibPrivat={() => visibPrivat()}/>
                    <TherapistAddres localization={props.localization.data} therapist={props.userdata.data.therapist} visibAd={visibAd} visiblAddres={() => visiblAddres()} />
                    <TherapistSpecialty visibSpe={visibSpe} visibleSpe={() => visibleSpe()}
                        tempSpecialty={tempSpecialty} setTempSpecialty={(data) => setTempSpecialty(data)} allspecialt={allspecialt}/>
                    <DeleteSpeciality page4={page4} setPage4={(value) => setPage4(value)} item={item} />
                    <View style={styles.container}>
                        <View style={{ flex: 2 }}>
                            {header()}
                        </View>
                        <View style={{ flex: 3 }}>
                            {body()}
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}
const mapStateToProps = (state) => ({
    userdata: getUserData(state),
    localization: getLocalization(state)
});

export default connect(mapStateToProps)(ProfileTherapist)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    body: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        marginTop: 20,
        marginBottom: 20,
        display: 'flex',
        flexDirection: 'column'
    },
    infos: {
        display: 'flex',
        flexDirection: 'column',
        borderBottomColor: "grey",
        borderBottomWidth: 0.5
    },
    data: {
        display: 'flex',
        flexDirection: 'row',
        marginVertical: 15,
    },
    avatar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
})