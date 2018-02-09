// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  
  //firebase Desarrollo
  
  firebase:{
   apiKey: "AIzaSyB_Shc3PWqhPr2JCC_GTCheczHMyyttNmY",
   authDomain: "tuvueltap.firebaseapp.com",
   databaseURL: "https://tuvueltap.firebaseio.com",
    projectId: "tuvueltap",
    storageBucket: "tuvueltap.appspot.com",
    messagingSenderId: "565294870666"
  }
 

  //Firebase pruebas
  /* firebase:{
    apiKey: "AIzaSyBUS5cy6FLocCnKclySb-6zMb9_5lTWpA8",
    authDomain: "ptuvuelta.firebaseapp.com",
    databaseURL: "https://ptuvuelta.firebaseio.com",
    projectId: "ptuvuelta",
    storageBucket: "ptuvuelta.appspot.com",
    messagingSenderId: "1008156158697"
  } */
};
