export const mailLoginIsWritten = (emailLogin) => {
    if (emailLogin.length > 0)
      return true;
    return false;
};

export const passwordLoginIsWritten = (passwordLogin) => {
    if (passwordLogin.length > 0)
      return true;
    return false;
};

export const hasErrorMailRegister = (emailRegister) => {
    if (emailRegister.includes('@') && emailRegister.includes('.'))
      return false;
    return true;
};

export const hasErrorFirstnameRegister = (firstnameRegister) => {
    if (firstnameRegister.length === 0)
      return true;
    return false;
};

export const hasErrorLastnameRegister = (lastnameRegister) => {
    if (lastnameRegister.length === 0)
      return true;
    return false;
};

export const hasErrorPhoneNumberRegister = (phoneNumberRegister) => {
    //Check if phone number contain only number and 10 characters
    if (isNaN(phoneNumberRegister.split(' ').join('')) || phoneNumberRegister.length !== 14)
      return true;
    return false;
};

export const hasErrorPasswordRegister = (passwordRegister) => {
    //Check if password contain at least 8 characters, one uppercase, one lowercase, one number and one special character
    if (passwordRegister.length >= 8 && !! passwordRegister.match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[$@:;.€!%*<>#+=\(\)\^?&])/))
      return false;
    return true;
};

export const hasErrorConfirmPasswordRegister = (confirmPasswordRegister, passwordRegister) => {
    if (confirmPasswordRegister.length === 0 || confirmPasswordRegister !== passwordRegister)
      return true;
    return false;
};