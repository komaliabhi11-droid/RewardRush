/**
 * netlify/functions/cpx-postback.js
 *
 * Netlify Serverless Function — CPX Research postback handler.
 *
 * This function receives a POST request from CPX Research when a user
 * completes a survey and credits the reward to their Firebase wallet.
 *
 * Deploy separately via: netlify deploy --prod
 *
 * Environment variables required (set in Netlify UI):
 *   FIREBASE_DATABASE_URL  — e.g. https://mr-earning-a806d-default-rtdb.firebaseio.com
 *   FIREBASE_SERVICE_ACCOUNT_JSON — full service-account JSON as a single string
 *   CPX_SECRET_KEY (optional) — for HMAC signature verification
 */

const admin = require('firebase-admin');
const crypto = require('crypto');

// Lazy-initialise the Firebase Admin SDK (runs once per container).
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '{}');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

exports.handler = async (event) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { userId, surveyId, reward, status, signature } = body;

    // 1. Validate required fields
    if (!userId || !surveyId || !reward || !status) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: userId, surveyId, reward, status' }),
      };
    }

    // 2. Optional HMAC signature verification
    if (process.env.CPX_SECRET_KEY && signature) {
      const expected = crypto
        .createHmac('sha256', process.env.CPX_SECRET_KEY)
        .update(`${userId}${surveyId}${reward}${status}`)
        .digest('hex');
      if (signature !== expected) {
        return { statusCode: 401, body: JSON.stringify({ error: 'Invalid signature' }) };
      }
    }

    // 3. Look up user in Firebase
    const userRef = admin.database().ref(`users/${userId}`);
    const snapshot = await userRef.once('value');

    if (!snapshot.exists()) {
      return { statusCode: 404, body: JSON.stringify({ error: 'User not found' }) };
    }

    const userData = snapshot.val();

    // 4. Prevent duplicate rewards
    const completedSurveys = userData.completedSurveys || {};
    if (completedSurveys[surveyId]) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Survey reward already credited', alreadyCredited: true }),
      };
    }

    // 5. Credit reward
    const rewardAmount = parseFloat(reward) || 0;
    const currentBalance = userData.balance || 0;
    const newBalance = currentBalance + rewardAmount;

    // 6. Build atomic update
    const txRef = admin.database().ref('transactions').push();
    const updates = {
      balance: newBalance,
      [`completedSurveys/${surveyId}`]: {
        reward: rewardAmount,
        timestamp: Date.now(),
        status,
      },
      [`/transactions/${txRef.key}`]: {
        uid: userId,
        amount: rewardAmount,
        type: 'SURVEY_REWARD',
        description: `CPX Survey reward for ${surveyId}`,
        timestamp: Date.now(),
        status: 'SUCCESS',
      },
    };

    await userRef.update(updates);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Survey reward credited',
        newBalance,
        rewardAmount,
      }),
    };
  } catch (error) {
    console.error('CPX Postback Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error', details: error.message }),
    };
  }
};
