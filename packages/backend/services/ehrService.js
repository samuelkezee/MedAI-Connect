import axios from 'axios';
import simpleOAuth2 from 'simple-oauth2';

// NOTE: In a real application, these credentials would be stored securely in environment variables
// and would be specific to each EHR system a user connects to.
const ehrCredentials = {
  client: {
    id: 'YOUR_EHR_CLIENT_ID', // This will be provided by the EHR system
    secret: 'YOUR_EHR_CLIENT_SECRET', // This will also be provided
  },
  auth: {
    tokenHost: 'https://fhir.epic.com/interconnect-fhir-proxy', // Example for Epic
    tokenPath: '/oauth2/token',
    authorizePath: '/oauth2/authorize',
  },
};

/**
 * Initiates the OAuth2 authorization code flow.
 * @returns {string} The authorization URI to redirect the user to.
 */
export const getAuthorizationUri = () => {
  const oauth2 = simpleOAuth2.create(ehrCredentials);
  const authorizationUri = oauth2.authorizationCode.authorizeURL({
    redirect_uri: `http://localhost:3001/api/v1/ehr/callback`, // The callback URL for our backend
    scope: 'patient/*.read', // Requesting read access to all patient data
    state: 'some-random-state-string', // Helps prevent CSRF attacks
  });
  return authorizationUri;
};

/**
 * Exchanges an authorization code for an access token.
 * @param {string} code - The authorization code from the EHR.
 * @returns {Promise<object>} The access token object.
 */
export const getAccessToken = async (code) => {
  const oauth2 = simpleOAuth2.create(ehrCredentials);
  const options = {
    code,
    redirect_uri: `http://localhost:3001/api/v1/ehr/callback`,
  };

  try {
    const result = await oauth2.authorizationCode.getToken(options);
    const accessToken = oauth2.accessToken.create(result);
    // Here, you would save the accessToken object (including refresh token and expiry) 
    // to your EHRConnection model in the database.
    return accessToken.token;
  } catch (error) {
    console.error('Access Token Error', error.message);
    throw new Error('Authentication failed');
  }
};

/**
 * Fetches patient data from a FHIR API.
 * @param {string} accessToken - The OAuth2 access token.
 * @param {string} fhirUrl - The base URL of the FHIR API.
 * @returns {Promise<object>} A summary of the patient's health data.
 */
export const fetchHealthData = async (accessToken, fhirUrl) => {
    // This is a placeholder. In a real scenario, you would make multiple requests
    // to different FHIR resources (Patient, Condition, AllergyIntolerance, etc.)
    // and then transform that data into your HealthSummary model format.
    console.log(`Fetching data from ${fhirUrl} with token ${accessToken}`);

    // Example: Fetch Patient resource
    // const patientResponse = await axios.get(`${fhirUrl}/Patient`, {
    //   headers: { 'Authorization': `Bearer ${accessToken}` },
    // });

    return {
        demographics: { dateOfBirth: '1980-01-01', gender: 'female' },
        conditions: [{ name: 'Hypertension', onsetDate: '2010-05-20' }],
        allergies: ['Penicillin'],
        medications: [{ name: 'Lisinopril', dosage: '10mg' }],
        lastSync: new Date().toISOString(),
    };
};
