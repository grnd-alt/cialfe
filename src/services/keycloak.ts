import Keycloak, { type KeycloakOnLoad, type KeycloakPkceMethod } from 'keycloak-js'

const keycloakConfig = {
  url: 'http://localhost:8080',
  realm: 'goapp',
  clientId: 'testapplication',
}

const keycloak = new Keycloak(keycloakConfig)
const initOptions = {
  onLoad: 'check-sso' as KeycloakOnLoad,
  pkceMethod: 'S256' as KeycloakPkceMethod,
}

const initKeycloak = () => {
  return new Promise((resolve, reject) => {
    keycloak
      .init(initOptions)
      .then((authenticated) => {
        resolve(authenticated)
      })
      .catch((error) => {
        console.error('failed to init keycloak', error)
        reject(error)
      })
  })
}

const login = () => keycloak.login();
const logout = () => keycloak.logout({redirectUri: window.location.origin});
const refresh = () => keycloak.updateToken();
const getToken = () => keycloak.token;
const isAuthenticated = () => keycloak.authenticated;

export { initKeycloak, login, logout, getToken, isAuthenticated, refresh, keycloak }
