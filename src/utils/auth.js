/* global firebase */

import router from "../router";

export default {
  googleLogin() {
    firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  },
  async isLoggedIn() {
    return new Promise(resolve => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },
  async getRedirectResult() {
    return new Promise(resolve => {
      firebase.getRedirectResult().then(result => {
        resolve(result.user);
      });
    });
  },
  async getUser() {
    return new Promise(resolve => {
      resolve(firebase.auth().currentUser);
    });
  },
  logout() {
    firebase.auth().signOut();
    router.push("/login");
  }
};
