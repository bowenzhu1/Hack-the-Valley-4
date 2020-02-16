import import { AnonymousCredential } from "mongodb-stitch-browser-sdk";
import { app } from "./app.js";

export function loginAnonymous() {
  return app.auth.loginWithCredential(new AnonymousCredential());
}

export function hasLoggedInUser() {
  return app.auth.isLoggedIn;
}

export function getCurrentUser(){
  return app.auth.isLoggedIn ? app.auth.user : null;
}

export function logoutCurrentUser(){
  const user = getCurrentUser();
  if(user){
    return app.auth.logoutUserWithId(user.id);
  }
}

export function addAuthenticationListener(listener) {
    app.auth.addAuthListener(listener);
}
export function removeAuthenticationListener(listener) {
    app.auth.removeAuthListener(listener);
}
