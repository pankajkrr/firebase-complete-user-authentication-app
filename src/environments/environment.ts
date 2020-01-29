// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyADcZQo19kMTEl2bopV64ZBvE5BLc8WM0w",
    authDomain: "localhost",
    databaseURL: "https://appointment-app-53b3b.firebaseio.com",
    projectId: "appointment-app-53b3b",
    storageBucket: "gs://appointment-app-53b3b.appspot.com",
    messagingSenderId: "816034113945"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
