// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase:{
   apiKey: "AIzaSyCAGzLWyjseJMnUuwrMveTu3DyYpVVCN30",
    authDomain: "tuvuelta-produccion.firebaseapp.com",
    databaseURL: "https://tuvuelta-produccion.firebaseio.com",
    projectId: "tuvuelta-produccion",
    storageBucket: "tuvuelta-produccion.appspot.com",
    messagingSenderId: "49107694834"
  },

  baseapi: {
    tuvuelta: 'https://us-central1-tuvuelta-produccion.cloudfunctions.net/'
  }
};
