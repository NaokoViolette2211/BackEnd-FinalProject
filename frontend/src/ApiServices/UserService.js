const userKey = 'recipe-app-user';

export const setUser = (token) => {

  const base64Url = token.split('.')[1]; //jwt Encoded PAYLOAD

  const payload = JSON.parse(atob(base64Url)) 

  localStorage.setItem(userKey, JSON.stringify(payload));
}

