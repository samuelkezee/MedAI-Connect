import express from 'express';
import { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getUserDetailsById, updateUserRole, deleteUser } from '../controllers/userController.js';
import { userAuthentication, roleBasedAccess } from '../middleware/userAuth.js';

const router = express.Router();

// Public Routes
router.post('/register', registerUser);//✅
router.post('/login', loginUser);//✅
router.post('/logout', logoutUser);//✅

// Password Routes
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);

// User Routes (must be logged in)
// packages/backend/routes/userRoutes.js
router.get('/profile', userAuthentication, getUserDetails);//✅
router.put('/profile/update', userAuthentication, updateProfile);//✅
router.put('/password/update', userAuthentication, updatePassword);//✅

// Admin & SuperAdmin Routes
router.get('/admin/users', userAuthentication, roleBasedAccess('admin', 'superAdmin'), getAllUsers);//✅
router.get('/admin/user/:id', userAuthentication, roleBasedAccess('admin', 'superAdmin'), getUserDetailsById);//✅
router.put('/admin/user/:id', userAuthentication, roleBasedAccess('superAdmin'), updateUserRole);//✅
router.delete('/admin/user/:id', userAuthentication, roleBasedAccess('admin','superAdmin'), deleteUser);//✅

export default router;
