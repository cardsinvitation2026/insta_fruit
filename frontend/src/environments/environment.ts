export const environment = {
  production: false,
  // TODO: Replace these placeholders with your Firebase web config (Firebase Console → Project settings → Your apps → SDK setup)
  firebase: {
    apiKey: 'REPLACE_API_KEY',
    authDomain: 'REPLACE_PROJECT.firebaseapp.com',
    projectId: 'REPLACE_PROJECT_ID',
    storageBucket: 'REPLACE_PROJECT.appspot.com',
    messagingSenderId: 'REPLACE_SENDER_ID',
    appId: 'REPLACE_APP_ID',
    measurementId: 'REPLACE_MEASUREMENT_ID',
  },
  // Razorpay public Key ID (frontend). Secret stays in Cloud Functions config.
  razorpayKeyId: 'rzp_test_REPLACE_KEY_ID',
  region: 'asia-south1',
  useEmulators: false,
};
