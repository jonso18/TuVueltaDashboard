// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase:{
   apiKey: "AIzaSyBUS5cy6FLocCnKclySb-6zMb9_5lTWpA8",
    authDomain: "ptuvuelta.firebaseapp.com",
    databaseURL: "https://ptuvuelta.firebaseio.com",
    projectId: "ptuvuelta",
    storageBucket: "ptuvuelta.appspot.com",
    messagingSenderId: "1008156158697"
  },

  baseapi: {
    tuvuelta: 'https://us-central1-ptuvuelta.cloudfunctions.net/asdfas'
  }
};
