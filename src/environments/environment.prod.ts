export const environment = {
  functionsURL: 'https://us-central1-project-flugio.cloudfunctions.net',
  stripeKey: 'pk_live_KSYTHSwIe8s7XlO3RxHGeYLX',
  production: true,
  firebase: {
    apiKey: 'AIzaSyDjmMKdE4O85AasneIe3GJWUKBuNsBoxOU',
    databaseURL: 'https://project-flugio.firebaseio.com',
    projectId: 'project-flugio',
    messagingSenderId: '82113536445',
    storageBucket: 'project-flugio.appspot.com',
  },
  locale: 'de_CH',
  localeSimple: 'de',
  passwordlessAuthSettings: {
    url: 'https://flugio.ch/login',
    handleCodeInApp: true
  },
  reAuthSettings: {
    url: 'https://flugio.ch/account',
    handleCodeInApp: true
  },
  reAuthSettingForData: {
    url: 'https://flugio.ch/account/data',
    handleCodeInApp: true
  },
};
