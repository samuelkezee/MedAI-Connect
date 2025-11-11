import {
  getAuthorizationUri,
  getAccessToken,
  fetchHealthData,
} from '../services/ehrService.js';

/**
 * Redirects the user to the EHR's authorization page.
 */
export const initiateEhrAuthorization = (req, res) => {
  const authorizationUri = getAuthorizationUri();
  res.redirect(authorizationUri);
};

/**
 * Handles the callback from the EHR after the user grants permission.
 */
export const handleEhrCallback = async (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).send('Error: Authorization code not found.');
  }

  try {
    const token = await getAccessToken(code);

    // IMPORTANT: Here you would save the token to the EHRConnection model,
    // associating it with the logged-in user.
    console.log('Successfully obtained access token:', token);

    // For now, we'll just send a success message.
    res.status(200).send('Authentication successful! You can now close this window.');
  } catch (error) {
    res.status(500).send('Failed to authenticate with EHR.');
  }
};

/**
 * Fetches and returns a health summary for the user.
 */
export const getHealthSummary = async (req, res) => {
  // In a real app, you would retrieve the user's access token from the EHRConnection model.
  const accessToken = 'a-valid-access-token-from-db'; 
  const ehrFhirUrl = 'https://fhir.epic.com/interconnect-fhir-proxy/api/FHIR/R4'; // This would also come from the DB

  try {
    const healthSummary = await fetchHealthData(accessToken, ehrFhirUrl);
    // You would then save this summary to your HealthSummary model (cache).
    res.status(200).json(healthSummary);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch health data.', error: error.message });
  }
};
