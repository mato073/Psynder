import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Keyboard } from 'react-native';
import { Text } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { connect } from 'react-redux';

import * as Animatable from 'react-native-animatable';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { get_role_request, get_token_request, get_token_clean } from '../../Redux/Actions/Actions'
import { new_user } from '../../services/user_service'
import { getUserToken, getUserRole } from '../../Redux/Saga/selectors/selector';

import { useDispatch } from 'react-redux';

//Import our components
import Loader from '../../components/Loader';
import GetIcons from '../../components/function/GetIcons';
//import BackgroundImageTheme from '../../components/logo/BackgroundImageTheme'
import ServicesButtons from './ServicesButtons'
import ArrowBack from '../../components/ArrowBack'
import SnackBar from '../../components/SnackBar'
import LoginLogo from './LoginLogo'
import LinearGradientButton from '../../components/LinearGradientButton'
import CustomTextInput from '../../components/CustomTextInput'
import ReCaptcha from '../../components/ReCaptcha/ReCaptcha'
import KeyboardHeight from '../../components/keyboard/KeyboardHeight'
import { mailLoginIsWritten, passwordLoginIsWritten, hasErrorMailRegister,
  hasErrorFirstnameRegister, hasErrorLastnameRegister, hasErrorPhoneNumberRegister,
  hasErrorPasswordRegister, hasErrorConfirmPasswordRegister} from '../../components/function/CheckFormInfos'

const Login = (props) => {
  const [data, setData] = React.useState({
    user: null,
    emailLogin: '',
    passwordLogin: '',
    emailRegister: '',
    passwordRegister: '',
    confirmPasswordRegister: '',
    phoneNumberRegister: '',
    firstnameRegister: '',
    lastnameRegister: '',
    role: '',
  });

  const scrollRef = useRef();

  const { colors } = useTheme()

  const [recaptchaIsVerified, setRecaptchaIsVerified] = React.useState(false);

  const [registerHasErrors, setRegisterHasErrors] = React.useState(false);

  const [snackBarVisible, setSnackBarVisible] = React.useState(false);
  const [snackBarText, setSnackBarText] = React.useState("");
  const [snackBarTheme, setSnackBarTheme] = React.useState("error");

  const [isLoginForm, setIsLoginForm] = React.useState(true);

  const [loader, setLoader] = React.useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    //dispatch(get_token_clean())
    if (props.userToken.error?.response != null && props.userToken.error !== null) {
      //props.userToken.error.response.status is undefined and return error, need to fix
      if (props.userToken.error.response.status === 400) {
        if (props.userToken.error.response.data.message === "Therapist account is locked") {
          setSnackBarTheme("success");
          setSnackBarText("Votre compte thérapeute doit être validé manuellement avant de pouvoir vous connecter");
          setSnackBarVisible(true);
        }
        else {
          setSnackBarTheme("error");
          setSnackBarText("Vos informations de connexion sont incorrects");
          setSnackBarVisible(true);
        }
      }
      else {
        setSnackBarTheme("error");
        setSnackBarText("Une erreur est survenue lors de la connexion");
        setSnackBarVisible(true);
      }
      dispatch(get_token_clean())
    }
  }, [props.userToken]);

  const SnackBarPopUp = () => {
    if (snackBarVisible === true)
    {
      return (
        <SnackBar visible={true} theme={snackBarTheme} text={snackBarText} actualVisible={(isVisible) => setSnackBarVisible(isVisible)}/>
      );
    }
  }

  const checkFormLogin = () => {
    if (mailLoginIsWritten(data.emailLogin) && passwordLoginIsWritten(data.passwordLogin))
      return true;
    return false;
  }

  const connectUser = async () => {
    setLoader(true);
    Keyboard.dismiss()
    if (checkFormLogin() === true)
      dispatch(get_token_request(data.emailLogin, data.passwordLogin, props.role.data === 'User' ? false : true, "DEFAULT"));
    else {
      setSnackBarTheme("error");
      setSnackBarText("Un ou plusieurs champs ne sont pas remplis");
      setSnackBarVisible(true);
    }
    setLoader(false);
  } 

  const LoginCard = () => {
    return (
      <View>
        <View>
          <CustomTextInput colorFocused={props.role.data === 'User' ? '#009387' : '#1797e8'} 
            icon={<GetIcons name={"FontAwesome5"} iconName={"user"}/>}
            label={"Adresse mail"} spaceBottom={true}
            value={data.emailLogin}
            valueChange={(text) => setData({...data, emailLogin: text})}
            keyboardType={'email-address'}
            isWritten={mailLoginIsWritten(data.emailLogin)}
            autoCapitalize={false}
            scrollViewRef={scrollRef}/>
          
          <CustomTextInput lockIcon={true} colorFocused={props.role.data === 'User' ? '#009387' : '#1797e8'} 
            icon={<GetIcons name={"Feather"} iconName={"lock"}/>}
            label={"Mot de passe"} 
            value={data.passwordLogin}
            valueChange={(text) => setData({...data, passwordLogin: text})}
            isWritten={passwordLoginIsWritten(data.passwordLogin)}
            scrollViewRef={scrollRef}/>
          {/* <Text
            style={{marginTop: 10, color: '#4285F4', fontWeight: 'bold'}}
            onPress={() => {
             console.log("Mot de passe oublié")
            }}>
            {' '}
            Mot de passe oublié ?
          </Text> */}
        </View>
      </View>
    );
  };

  const checkFormRegister = () => {
    if (hasErrorMailRegister(data.emailRegister) || 
        hasErrorFirstnameRegister(data.firstnameRegister) ||
        hasErrorLastnameRegister(data.lastnameRegister) ||
        hasErrorPhoneNumberRegister(data.phoneNumberRegister) ||
        hasErrorPasswordRegister(data.passwordRegister) ||
        hasErrorConfirmPasswordRegister(data.confirmPasswordRegister, data.passwordRegister)) {
      setRegisterHasErrors(true);
      return false;
    }
    setRegisterHasErrors(false);
    return true;
  }

  async function createUser() {
    setLoader(true);
    Keyboard.dismiss()
    if (checkFormRegister() === true) {
      if (recaptchaIsVerified === false) {
        setSnackBarTheme("error");
        setSnackBarText("Vous devez valider le reCAPTCHA avant de vous inscrire");
        setSnackBarVisible(true);
      }
      else {
        let newUser = await new_user(
          data.firstnameRegister.trim(),
          data.lastnameRegister.trim(),
          data.emailRegister,
          data.phoneNumberRegister,
          data.passwordRegister,
          props.role.data === 'User' ? false : true,
        );
        if (newUser === true) {
          setSnackBarTheme("success");
          if (props.role.data === 'User')
            setSnackBarText("Votre compte a été crée avec succès")
          else
            setSnackBarText("Votre compte thérapeute est en cours de validation manuelle")
          setSnackBarVisible(true);
          setIsLoginForm(true);
        }
        else if (newUser === "Email already used") {
          setSnackBarTheme("error");
          setSnackBarText("L'adresse email saisie est déjà utilisée");
          setSnackBarVisible(true);
        }
        else {
          setSnackBarTheme("error");
          setSnackBarText("Une erreur est survenue lors de la création du compte");
          setSnackBarVisible(true);
        }
      }
    }
    else {
      setSnackBarTheme("error");
      setSnackBarText("Un ou plusieurs des champs d'inscription ne sont pas valide");
      setSnackBarVisible(true);
    }
    setLoader(false);
  }

  const RegisterCard = () => {
    return (
      <View>
        <CustomTextInput colorFocused={props.role.data === 'User' ? '#009387' : '#1797e8'}
          icon={<GetIcons name={"FontAwesome5"} iconName={"user"}/>}
          label={"Adresse mail"} spaceBottom={true} helperText={"* L'adresse mail n'est pas valide"} 
          hasErrors={hasErrorMailRegister(data.emailRegister)}
          value={data.emailRegister}
          valueChange={(text) => setData({...data, emailRegister: text})}
          printHelperText={registerHasErrors}
          autoCapitalize={false}
          scrollViewRef={scrollRef}/>

        <CustomTextInput colorFocused={props.role.data === 'User' ? '#009387' : '#1797e8'} 
          icon={<GetIcons name={"FontAwesome5"} iconName={"user"}/>}
          label={"Prénom"} spaceBottom={true} helperText={"* Ce champ est obligatoire"} 
          hasErrors={hasErrorFirstnameRegister(data.firstnameRegister)}
          value={data.firstnameRegister}
          valueChange={(text) => setData({...data, firstnameRegister: text})}
          printHelperText={registerHasErrors}
          isName={true}
          scrollViewRef={scrollRef}/>

        <CustomTextInput colorFocused={props.role.data === 'User' ? '#009387' : '#1797e8'}
          icon={<GetIcons name={"FontAwesome5"} iconName={"user"}/>}
          label={"Nom"} spaceBottom={true} helperText={"* Ce champ est obligatoire"} 
          hasErrors={hasErrorLastnameRegister(data.lastnameRegister)}
          value={data.lastnameRegister}
          valueChange={(text) => setData({...data, lastnameRegister: text})}
          printHelperText={registerHasErrors}
          isName={true}
          scrollViewRef={scrollRef}/>

        <CustomTextInput colorFocused={props.role.data === 'User' ? '#009387' : '#1797e8'}
          icon={<GetIcons name={"Feather"} iconName={"phone"}/>}
          label={"Numéro de téléphone"} spaceBottom={true} helperText={"* Le numéro de téléphone n'est pas valide"} 
          hasErrors={hasErrorPhoneNumberRegister(data.phoneNumberRegister)}
          value={data.phoneNumberRegister}
          valueChange={(text) => setData({...data, phoneNumberRegister: text})}
          keyboardType={'phone-pad'}
          printHelperText={registerHasErrors}
          isNumeric={true}
          scrollViewRef={scrollRef}/>

        <CustomTextInput lockIcon={true} colorFocused={props.role.data === 'User' ? '#009387' : '#1797e8'} 
          icon={<GetIcons name={"Feather"} iconName={"lock"}/>}
          label={"Mot de passe"} spaceBottom={true} helperText={"* Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"} 
          hasErrors={hasErrorPasswordRegister(data.passwordRegister)}
          value={data.passwordRegister}
          valueChange={(text) => setData({...data, passwordRegister: text})}
          printHelperText={registerHasErrors}
          printPasswordText={true}
          scrollViewRef={scrollRef}/>

        <CustomTextInput lockIcon={true} colorFocused={props.role.data === 'User' ? '#009387' : '#1797e8'} 
          icon={<GetIcons name={"Feather"} iconName={"lock"}/>}
          label={"Confirmer le mot de passe"} helperText={"* Le mot de passe est incorrect"}
          spaceBottom={true}
          hasErrors={hasErrorConfirmPasswordRegister(data.confirmPasswordRegister, data.passwordRegister)}
          printHelperText={registerHasErrors}
          value={data.confirmPasswordRegister}
          valueChange={(text) => setData({...data, confirmPasswordRegister: text})}
          scrollViewRef={scrollRef}/>

        <ReCaptcha onVerified={(isVerified) => setRecaptchaIsVerified(isVerified)} isOpen={() => scrollRef.current.scrollToEnd({animated: true})}/>
      </View>
    );
  };

  const LoginButtons = () => {
    return (
      <View style={{flex: 1, marginTop: 20}}>
        <View style={{flex: 1, paddingHorizontal: 10}}>
          {isLoginForm === true
          ?
            <LinearGradientButton
              theme={props.role.data}
              text={'Se connecter'}
              onPress={() => connectUser()}/>
          
          :
            <LinearGradientButton
              theme={props.role.data}
              text={"S'inscrire"}
              onPress={() => createUser()}/>
          }
        </View>
      </View>
    );
  };

  const OnChangeForm = () => {
    /* if (isLoginForm == false)
    {
      setRegisterHasErrors(false);
      setData({...data, emailRegister: '', firstnameRegister: '', lastnameRegister: '', 
      phoneNumberRegister: '', passwordRegister: '', confirmPasswordRegister: ''})
    }
    if (isLoginForm == true)
      setData({...data, emailLogin: '', passwordLogin: ''}) */
    scrollRef.current.scrollTo({y: 0, animated: false})
    setIsLoginForm(!isLoginForm);
  }

  const ChangeFormButtons = () => {
    return (
      <View style={{flex: 1, flexDirection: "row", justifyContent:"center", marginTop: 20}}>
        <Text 
          style={{
            textAlign: 'center', 
            fontSize: 15, 
            fontWeight: 'bold',
            textShadowColor: 'rgba(0, 0, 0, 0.75)'
          }}>
            {isLoginForm == true ? "Vous n'avez pas de compte ? " : "Vous avez déjà un compte ? "}
        </Text>
        <Text 
          onPress={() => OnChangeForm()} 
          style={{
            textAlign: 'center', 
            fontSize: 15, 
            fontWeight: 'bold', 
            color: '#4285F4', 
            textShadowColor: 'rgba(0, 0, 0, 0.75)'
          }}>
            {isLoginForm == true ? "Inscription ici" : "Connexion ici"}
        </Text>
      </View>
    )
  }

  return loader === true && props.role.data === ''
  //User role is not still save
  ?
    <View style={{flex: 1}}>
      <Loader loading={loader}/>
    </View>
  //User role is save
  :
    /* <KeyboardAwareScrollView style={{flex: 1}} keyboardShouldPersistTaps={'handled'} enableOnAndroid={true}> */
    <View style={{flex: 1}}>
      <Loader loading={loader}/>
      <View style={{flex: 1}}>
          {SnackBarPopUp()}
          <View style={{flex: 1}}>
            <ScrollView ref={scrollRef} keyboardShouldPersistTaps={'handled'} style={{flex: 1}}>      
              <ArrowBack color={props.role.data === 'User' ? '#009387' : '#1797e8'} navigation={props.navigation}/>
              <LoginLogo role={props.role.data} isLoginForm={isLoginForm}/>
              {isLoginForm === true
              &&
                <Animatable.View
                  useNativeDriver={true}
                  style={{flex: 1, paddingHorizontal: 15}}
                  animation="fadeInUpBig">
                  {LoginCard()}
                  {LoginButtons()}
                  {ChangeFormButtons()}
                  <View>
                    <View style={{flexDirection: 'row', marginTop: 30, alignItems: 'center'}}>
                      <View style={{flex: 1, height: 2, borderRadius: 90, backgroundColor: colors.text}}/>
                      <View>
                        <Text style={[styles.text_divide]}>OU</Text>
                      </View>
                      <View style={{flex: 1, height: 2, borderRadius: 90, backgroundColor: colors.text}}/>
                    </View>
                    <View style={{marginBottom: 30, marginTop: 30}}>
                      <ServicesButtons role={props.role.data}/>
                    </View>
                  </View>
                  <View style={{marginBottom: 20, alignItems: 'center', justifyContent: 'center'}}/>
                </Animatable.View>
              }
              {isLoginForm === false
              &&
                <Animatable.View
                  useNativeDriver={true}
                  style={{flex: 1, paddingHorizontal: 15}}
                  animation="fadeInUpBig">
                  {RegisterCard()}
                  {LoginButtons()}
                  {ChangeFormButtons()}
                  <View style={{marginBottom: 50, flex: 1, alignItems: 'center', justifyContent: 'center'}}/>
                </Animatable.View>
              }
              <KeyboardHeight/>
            </ScrollView>
          </View>   
      </View>
    </View>
};


const mapStateToProps = (state) => ({
  userToken: getUserToken(state),
  role: getUserRole(state),
});

export default connect(mapStateToProps)(Login);

const styles = StyleSheet.create({
  footer: {
    flex: 3,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_divide: {
    fontWeight: 'bold',
    fontSize: 20,
    width: 50,
    textAlign: 'center'
  }
});
