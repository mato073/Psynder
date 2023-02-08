import React, {} from 'react';
import { StyleSheet, View, Modal } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

import { connect } from 'react-redux';

import { getTheme, getUserRole } from '../Redux/Saga/selectors/selector';

const Loader = props => {
  const {loading} = props;

  return (
    <Modal
      transparent={true}
      visible={loading}
      style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
      dismissable={false}>
      <View style={styles.modalBackground}>
        <View style={[styles.activityIndicatorWrapper, {backgroundColor: props.theme.data === "light" ? '#f5f5f5' : '#202225'}]}>
          <ActivityIndicator animating={loading} color={props.role.data === "User" || props.role.data === null ? "#009387" : "#1797e8"}/>
          <Text style={{color: props.role.data === "User" || props.role.data === null ? "#009387" : "#1797e8", fontSize: 20}}>Chargement</Text>
        </View>
      </View>
    </Modal>
  )
}

const mapStateToProps = (state) => ({
  theme: getTheme(state),
  role: getUserRole(state),
});

export default connect(mapStateToProps)(Loader);

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    shadowColor: "#555555",
    shadowRadius: 9.11,
    shadowOpacity: 0.41,
    elevation: 7,
  },
  activityIndicatorWrapper: {
    height: 70,
    width: 200,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
});