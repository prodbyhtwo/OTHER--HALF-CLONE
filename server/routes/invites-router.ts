import { Router } from 'express';
import { 
  createInvite, 
  validateInvite, 
  getAllInvites, 
  getInvite, 
  updateInvite, 
  deleteInvite, 
  generateInviteLink 
} from './invites';

const router = Router();

// Create new invite (admin only)
router.post('/', createInvite);

// Validate invite code
router.post('/validate', validateInvite);

// Get all invites (admin only)
router.get('/', getAllInvites);

// Get specific invite (admin only)
router.get('/:id', getInvite);

// Update invite (admin only)
router.put('/:id', updateInvite);

// Delete invite (admin only)
router.delete('/:id', deleteInvite);

// Generate invite link (admin only)
router.get('/:id/link', generateInviteLink);

export default router;
