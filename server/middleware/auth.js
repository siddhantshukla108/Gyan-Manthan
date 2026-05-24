const admin = require('firebase-admin');
const User = require('../models/User');

// Initialize Firebase Admin SDK
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // Fallback for local development
  serviceAccount = require('../firebaseServiceAccountKey.json');
}

admin.initializeApp({ 
  credential: admin.credential.cert(serviceAccount)
});
console.log('✅ Firebase Admin SDK initialized successfully');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // contains firebaseUid (decodedToken.uid), email, etc.

    // Optional: Fetch the MongoDB user and attach to req.dbUser
    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (user) {
      req.dbUser = user;
    }

    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = { verifyToken };
