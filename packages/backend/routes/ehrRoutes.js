import express from 'express';
import {
  initiateEhrAuthorization,
  handleEhrCallback,
  getHealthSummary,
} from '../controllers/ehrController.js';

const router = express.Router();

// Route to start the EHR authorization process
router.get('/authorize', initiateEhrAuthorization);

// Route for the OAuth2 callback
router.get('/callback', handleEhrCallback);

// Route to get the user's health summary
router.get('/summary', getHealthSummary);

export default router;
