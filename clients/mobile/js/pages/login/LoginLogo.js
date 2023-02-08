import * as React from 'react';
import { View } from 'react-native';

import BannerLogo from './BannerLogo';

const LoginLogo = props => {
    const {role, isLoginForm} = props;

    return (
        <View style={{marginBottom: 50, marginTop: 30}}>
            <BannerLogo 
                text={isLoginForm === true ? 'Connexion' : 'Inscription'}
                colors={role === 'User' ? ['#4cc7bc', '#009387'] : ['#66bbf2', '#1797e8']}/>
        </View>
    )
}

export default LoginLogo;