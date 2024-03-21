const jwtKey = 'recipe-app-jwt';

export const setJwt = (jwt) => {
  return localStorage.setItem(jwtKey, jwt);
}

export const getJwt = () => {
  return localStorage.getItem(jwtKey);
}

export const removeJwt = () => {
  return localStorage.removeItem(jwtKey);
}