import React, {} from 'react';
import { Portal, Snackbar, Text } from 'react-native-paper';

const SnackBar = props => {
    const {theme, text} = props;

    const [visible, setVisible] = React.useState(true);

    const onDismissSnackBar = () => {
        setVisible(false);
        props.actualVisible(false);
    }

    return (
        <Portal>
            <Snackbar
                visible={visible}
                duration={5000}
                style={{borderRadius: 10, backgroundColor: theme == "error" ? "#ff5252" : "#20CC82"}}
                onDismiss={() => onDismissSnackBar()}
                theme={{colors: {accent: 'white'}}}
                action={
                    {
                        label: 'Fermer',
                        textColor: 'white',
                        onPress: () => {onDismissSnackBar()},
                    }
                }>
                <Text style={{textAlign: 'center', color: "white", fontWeight: 'bold'}}>
                    {text}
                </Text>
            </Snackbar>
        </Portal>
    )
}

export default SnackBar;