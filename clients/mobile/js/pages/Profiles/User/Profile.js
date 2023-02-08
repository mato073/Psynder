import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Avatar } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';

import Fontisto from 'react-native-vector-icons/Fontisto';

import { connect, useDispatch } from 'react-redux';
import { logOut } from '../../../Redux/Actions/Actions'
import { deleteUser } from '../../../services/user_service'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import LinearGradientButton from '../../../components/LinearGradientButton'

import { getUserData, getLocalization} from '../../../Redux/Saga/selectors/selector';
import { get_location_request, get_user_data_request } from '../../../Redux/Actions/Actions';
import { CheckDataLoading, CheckDataError } from '../../../components/function/CheckData';

import IconAndText from '../../../components/IconAndText'

import UserInfos from './Components/UserInfos'
import UserPrivate from './Components/UserPrivate'
import UserAddress from './Components/UserAddress'
import ThemeCheckBox from '../ThemeCheckBox';
import SupportButtons from '../SupportButtons';
import Loader from '../../../components/Loader';
import Error from '../../Error'

const Profile = (props) => {

    const dispatch = useDispatch()

    const [visib, setVisible] = React.useState(false);
    const [privat, setPrivat] = React.useState(false);
    const [visibAd, setVisibAd] = React.useState(false);

    const { colors } = useTheme()

    useEffect(() => {
        GetData()
    }, [dispatch]);
    
    const GetData = () => {
        dispatch(get_user_data_request(false));
        dispatch(get_location_request(false));
    }    

    const visiblAddres = () => {
        setVisibAd(!visibAd);
    }
    const visibleModal = () => {
        setVisible(!visib);
    }

    const visibPrivat = () => {
        setPrivat(!privat);
    }

    const userAvatar = (image) => {
        let initials = props.userdata.data.user.firstName[0] + props.userdata.data.user.lastName[0];
        if (!props.userdata.data.user.image) {
            return (
                <View style={styles.avatarView}>
                    <Avatar.Text size={120} label={initials} />
                </View>
            )
        } else {
            return (
                <View style={styles.avatarView}>
                    <Avatar.Text size={120} label={initials} />
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

    const logoutUser = () => {
        props.dispatch(logOut())
    }

    const delUser = () => {
        deleteUser(false);
        props.dispatch(logOut());
    }

    const alertDel = () => {
        Alert.alert(
            'Supprimer le compte',
            'Êtes-vous sûr de vouloir supprimer votre compte ?',
            [
                {
                    text: 'Annuler',
                    onPress: () => console.log('Annuler'),
                    style: 'Annuler'
                },
                { text: 'Oui', onPress: () => delUser(), style: 'cancel' }
            ],
            { cancelable: true }
        )
    }

    const body = () => {

        const user = props.userdata.data.user
        const name = `${user.firstName} ${user.lastName}`;
        let address = "Pas d'adresse renseignée";
        if (props.localization.data !== "" && props.localization.data !== null) {
            address = props.localization.data.address;
        }
        return (
            <View style={styles.body}>
                <View style={styles.infos}>
                    <View style={styles.data}>
                        <IconAndText text={address} textSize={16}
                            icon={<Fontisto style={styles.iconsMargin} name="map-marker-alt" size={20} color={colors.icon} />} />
                    </View>
                    <View style={{ marginHorizontal: 50, marginBottom: 20 }}>
                        <LinearGradientButton theme={"User"} textSize={13} onPress={visiblAddres} text={'Editer'} />
                    </View>
                </View>

                <View style={styles.infos}>
                    <View style={styles.data}>
                        <IconAndText text={name} textSize={16}
                            icon={<Fontisto style={styles.iconsMargin} name="male" size={20} color={colors.icon} />} />
                    </View>
                    <View style={styles.data}>
                        <IconAndText text={user.phoneNumber !== "" ? user.phoneNumber : "Pas de numéro de téléphone renseigné"} textSize={16}
                            icon={<Fontisto style={styles.iconsMargin} name="phone" size={20} color={colors.icon} />} />
                    </View>
                    <View style={{ marginHorizontal: 50, marginBottom: 20 }}>
                        <LinearGradientButton theme={"User"} textSize={13} onPress={visibleModal} text={'Editer'} />
                    </View>
                </View>

                <View style={styles.infos}>
                    <View style={styles.data}>
                        <IconAndText text={user.email} textSize={16}
                            icon={<Fontisto style={styles.iconsMargin} name="email" size={20} color={colors.icon} />} />
                    </View>
                    <View style={styles.data}>
                        <IconAndText text={"**********"} textSize={16}
                            icon={<Fontisto style={styles.iconsMargin} name="locked" size={20} color={colors.icon} />} />
                    </View>
                    <View style={{ marginHorizontal: 50, marginBottom: 20 }}>
                        <LinearGradientButton theme={"User"} textSize={13} onPress={visibPrivat} text={'Editer'} />
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
                
                <View style={{ paddingLeft: 10, paddingRight: 10, marginBottom: 20, marginTop: 20 }}>
                    <LinearGradientButton theme={"Grey"} textSize={16} onPress={logoutUser} text={'Déconnexion'} />
                </View>
                <View style={{ paddingLeft: 10, paddingRight: 10, marginBottom: 30 }}>
                    <LinearGradientButton theme={"Red"} textSize={16} onPress={alertDel} text={'Supprimer compte'} />
                </View>
            </View>);
    }

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
            <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
                <View style={{ flex: 1 }}>
                    <ScrollView>
                        <UserInfos userinfos={props.userdata.data.user} visib={visib} visibleModal={() => visibleModal()} />
                        <UserPrivate userinfos={props.userdata.data.user} privat={privat} visibPrivat={() => visibPrivat()} />
                        <UserAddress localization={props.localization.data} therapist={props.userdata.data.user} visibAd={visibAd} visiblAddres={() => visiblAddres()} />
                        <View style={styles.container}>
                            <View style={{flex: 2}}>
                                {header()}
                            </View>
                            <View style={{flex: 3}}>
                                {body()}
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

const mapStateToProps = (state) => ({
    userdata: getUserData(state),
    localization: getLocalization(state)
});

export default connect(mapStateToProps)(Profile)

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
        marginVertical: 15
    },
    avatar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
})