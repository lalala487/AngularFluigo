// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  stripeKey: 'pk_test_RSOTBYFAP5bHTg256mgJQIbj',
  firebase: {
    apiKey: 'AIzaSyDjmMKdE4O85AasneIe3GJWUKBuNsBoxOU',
    authDomain: 'flugio-frontend.firebaseapp.com',
    databaseURL: 'https://project-flugio.firebaseio.com',
    projectId: 'project-flugio',
    messagingSenderId: '82113536445',
    storageBucket: 'project-flugio.appspot.com',
  },
  locale: 'de_CH',
  localeSimple: 'de',
  functionsURL: 'http://localhost:5000/project-flugio/us-central1',
  passwordlessAuthSettings: {
    url: 'http://localhost:4200/login',
    handleCodeInApp: true
  },
  reAuthSettings: {
    url: 'http://localhost:4200/account',
    handleCodeInApp: true
  },
  reAuthSettingForData: {
    url: 'http://localhost:4200/account/data',
    handleCodeInApp: true
  },
  dialogflow: {
    projectId: 'project-flugio'
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
