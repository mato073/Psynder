import React, {} from 'react';
import { SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import GoogleReCaptcha from './GoogleReCaptcha';

const siteKey = '6LcLvKYaAAAAAC40itvaDKk3_Vvpeh5-dHmbs_UL'
const baseUrl = 'https://psynder.fr'

const ReCaptcha = props => {
    const {onVerified, isOpen} = props;

    const [recaptchaViewHeight, setRecaptchaViewHeight] = React.useState(90);

    const onRecaptchaEvent = (event) => {
        if (event && event.nativeEvent.data) {
            const data = decodeURIComponent(
                decodeURIComponent(event.nativeEvent.data),
            );
            if (data.startsWith('CONTENT_PARAMS:')) {
                let params = JSON.parse(data.substring(15));
                let newRecaptchaViewHeight = params.visibility === 'visible' ? params.height : 90;
                setRecaptchaViewHeight(newRecaptchaViewHeight);
                if (params.visibility === 'visible')
                    isOpen()
            } 
            else if (['cancel', 'error', 'expired'].includes(data)) {
                onVerified(false);
                return;
            } 
            else {
                console.log('Verified code from Google', data);
                onVerified(true);
            }
        }
    }

    return (
        <SafeAreaView style={{flex:1}}>
            <GoogleReCaptcha
                style={{height: recaptchaViewHeight, marginBottom: 8}}
                siteKey={siteKey}
                url={baseUrl}
                languageCode="fr"
                theme={props.theme}
                onMessage={(event) => onRecaptchaEvent(event)}
                />
        </SafeAreaView>
    );
}

//export default ReCaptcha;

const mapStateToProps = (state) => ({
    theme: state.UserTheme_reducer.theme,
});
  
export default connect(mapStateToProps)(ReCaptcha);
