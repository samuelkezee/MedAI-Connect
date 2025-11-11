// Represents the data model for a cached Health Summary

const healthSummarySchema = {
  userId: { type: 'reference', model: 'User', unique: true }, // Link to the User model
  demographics: {
    dateOfBirth: { type: 'date' },
    gender: { type: 'string' },
  },
  conditions: [
    {
      name: { type: 'string' },
      onsetDate: { type: 'date' },
    },
  ],
  allergies: [{ type: 'string' }],
  medications: [
    {
      name: { type: 'string' },
      dosage: { type: 'string' },
    },
  ],
  lastSync: { type: 'date', required: true },
};

export default healthSummarySchema;
