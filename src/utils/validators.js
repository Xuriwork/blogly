/* eslint-disable no-control-regex */
/* eslint-disable no-useless-escape */
export const validateEmail = (email) => {
    const regEx = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    if (email.match(regEx)) return true;
    else return false;
};

export const validateUsername = (username) => {
    const regEx = /^[a-z0-9_-]{3,25}$/i;
    if (username.match(regEx)) return true;
    else return false;
};

export const isEmpty = (string) => {
    if(string.trim() === '') return true;
    else return false;
};

export const validateUserSignUpData = (data) => {
    let errors = {};

    if(isEmpty(data.email)) {
        errors.email = 'Must not be empty';
    } else if (!validateEmail(data.email)) {
        errors.email = 'Must be a valid email address';
    }

    if (isEmpty(data.password)) errors.password = 'Must not be empty';
    if(data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords must match';
    if (isEmpty(data.username)) {
        errors.username = 'Must not be empty';
    } else if (!validateUsername(data.username)) {
        errors.username = 'Username can only contain letters, numbers, underscores, and dashes';
    }

    return {
        validationErrors: errors, 
        valid: Object.keys(errors).length === 0 ? true : false
    }
};

export const formatUserDetails = (data) => {

    let userDetails = {};

    if (!isEmpty(data.email.trim())) userDetails.email = data.email;
    if (!isEmpty(data.username.trim())) userDetails.username = data.username;
    if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;

    if (!isEmpty(data.onlinePortfolio.trim())) {
        if (data.onlinePortfolio.trim().substring(0, 4) !== 'http') {
            userDetails.onlinePortfolio = `http://${data.onlinePortfolio}`;
        } else userDetails.onlinePortfolio = data.onlinePortfolio;
    }

    if (!isEmpty(data.personalWebsite.trim())) {
        if (data.personalWebsite.trim().substring(0, 4) !== 'http') {
            userDetails.personalWebsite = `http://${data.personalWebsite}`;
        } else userDetails.personalWebsite = data.personalWebsite;
    }

    console.log(userDetails)
    
    return userDetails;
}