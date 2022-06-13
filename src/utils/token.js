// token 操作
const TOKEN_KEY = "pc-key";

const getToken = () => {
  return window.localStorage.getItem(TOKEN_KEY);
};

const setToken = (token) => {
  return window.localStorage.setItem(TOKEN_KEY, token);
};

const removeToken = () => {
  return window.localStorage.removeItem(TOKEN_KEY);
};

export { getToken, setToken, removeToken };
