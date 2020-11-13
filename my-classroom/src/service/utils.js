const BEARER = "Bearer";
const AUTH_USER_STORAGE_KEY ="authenticatedUser";

export const createAuthorizationHeader = () => {
    return {
        headers: {
            "Authorization" : BEARER + " " + retrieveJWT() 
        }
      };
}

export const retrieveJWT = () => {
    return getCurrentUser().token;
}

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem(AUTH_USER_STORAGE_KEY));;
}

export const addCurrentUser = (currentUser) => {
    localStorage.setItem(AUTH_USER_STORAGE_KEY, currentUser);
}

export const removeCurrentUser = () => {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
}

export const getCurrentUsername = () => {
    return getCurrentUser().username;
}

