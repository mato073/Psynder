import React from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import {
    Avatar,
} from 'react-native-paper';

const UserAvatar = ({ user }) => {
    let initials = user.firstName[0] + user.lastName[0];
    if (!user.image) {
        return (
            <View style={styles.avatarView}>
                <Avatar.Text size={120} label={initials} />
            </View>
        );
    } else {
        <View style={styles.avatarView}>
            <Avatar.Image
                size={110}
                source={require('../../../../../assets/png/patien.png')}
            />
        </View>;
    }
};


export default UserAvatar

const styles = StyleSheet.create({
    avatarView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
});
