// Represents the data model for an EHR Connection

const ehrConnectionSchema = {
  userId: { type: 'reference', model: 'User' }, // Link to the User model
  ehrSystemUrl: { type: 'string', required: true },
  accessToken: { type: 'string', required: true }, // Should be encrypted
  refreshToken: { type: 'string', required: true }, // Should be encrypted
  tokenExpiresAt: { type: 'date', required: true },
  patientId: { type: 'string', required: true }, // Patient ID within the EHR
};

export default ehrConnectionSchema;
