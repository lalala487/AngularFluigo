// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  functionsURL: 'http://localhost:5000/project-flugio/us-central1',
  passwordlessAuthSettings: {
    url: 'http://localhost:4200/login',
    handleCodeInApp: true
  },
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
  locale: 'de_CH'
};
