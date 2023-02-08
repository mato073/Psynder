import React, {} from 'react';
import BackgroundImageUser from '../../../assets/svg/help_1.svg';
import BackgroundImageTherapist from '../../../assets/svg/therapist.svg';

//Need to see if we suppress
const BackgroundImageTheme = props => {
  const {role} = props;

  if (role === 'User')
    return (
      <BackgroundImageUser
        style={{position: 'absolute'}}
        width={'100%'}
        height={'100%'}
      />
    );
  if (role === 'Therapist')
    return (
      <BackgroundImageTherapist
        style={{position: 'absolute'}}
        width={'100%'}
        height={'100%'}
      />
    );
}

export default BackgroundImageTheme;
