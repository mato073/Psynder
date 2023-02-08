import React, { } from 'react';

import { View } from 'react-native';
import { Button } from 'react-native-paper';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { GoogleSignin, statusCodes, GoogleSigninButton } from '@react-native-community/google-signin';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { useDispatch } from 'react-redux'

import { set_token_facebook, set_role, facebook_user, get_token_request } from '../../Redux/Actions/Actions';
import { new_google_user } from '../../services/user_service'

const ServicesButtons = props => {
    const { role } = props;
    const dispatch = useDispatch()
    let bool = true;

    if (role === 'User') {
        bool = false
    }

    React.useEffect(() => {
        GoogleSignin.configure({
            webClientId: '893723459884-cmq1lth9hmrl23not7s3iegl7im45i1p.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
        });
    });

    const google_signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
            const userInfo = await GoogleSignin.signIn();
            await new_google_user(bool, userInfo.user.id, 'GOOGLE', userInfo.user.email, userInfo.user.givenName, userInfo.user.familyName);
            dispatch(get_token_request(userInfo.user.id, "", bool, "GOOGLE"));
        } catch (error) {
            console.log('error =', { error });
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            }
            else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
            }
            else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            }
            else {
                // some other error happened
            }
        }
    };

    const facebook_signIn = () => {
        LoginManager.logInWithPermissions(['public_profile', 'email']).then(
            function (result) {
                if (result.isCancelled) {
                    console.log('Login cancelled');
                }
                else {
                    console.log('Login success with permissions: ' + result.grantedPermissions.toString());
                    props.dispatch(set_role(data.role));
                    AccessToken.getCurrentAccessToken().then((data) => {
                        props.dispatch(set_token_facebook(data.accessToken));
                        props.dispatch(facebook_user(data.accessToken));
                    });
                }
            },
            function (error) {
                console.log('Login fail with error: ' + error);
            },
        );
    };

    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
            }}>
            {/* <View style={{ flex: 1, paddingHorizontal: 5 }}> */}
{/*                 <Button style={{ borderRadius: 90 }} color="#1DA1F2" mode="contained">
                    <FontAwesome name="twitter" color="white" size={25} />
                </Button> */}
            {/* </View> */}
            <GoogleSigninButton
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={google_signIn}/>

            {/* <View style={{ flex: 1, paddingHorizontal: 5 }}>
                <Button
                    onPress={google_signIn}
                    style={{ borderRadius: 90 }}
                    color="#cf472c"
                    mode="contained">
                    <FontAwesome name="google" color="white" size={25} />
                </Button>
            </View> */}
            {/* <View style={{ flex: 1, paddingHorizontal: 5 }}> */}
               {/*  <Button
                    onPress={facebook_signIn}
                    style={{ borderRadius: 90 }}
                    color="#3b5998"
                    mode="contained">
                    <FontAwesome name="facebook" color="white" size={25} />
                </Button> */}
            {/* </View> */}
        </View>
    );
}

export default ServicesButtons;

