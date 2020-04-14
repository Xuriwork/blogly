export const updateSettings = (settingsInfo) => {
    return (dispatch, getState, {getFirebase}) => {
        const firestore = getFirebase().firestore();
        const userId = getState().firebase.auth.uid;

        const removeEmptyStrings = (obj) => {
            const newObj = {};
            Object.keys(obj).forEach((prop) => {
                if (obj[prop] !== '') { 
                    newObj[prop] = obj[prop]; 
                }
            });
            return newObj;
        };

        const userData = removeEmptyStrings(settingsInfo);

        firestore
        .collection('users')
        .doc(userId)
        .update(userData)

    }
}