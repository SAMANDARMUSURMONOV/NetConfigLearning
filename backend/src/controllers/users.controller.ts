import { Request, Response } from 'express';
import { auth } from '../config/firebase';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const listUsersResult = await auth.listUsers(1000); // 1000 tagacha foydalanuvchini olish
    const users = listUsersResult.users.map(user => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'Unnamed User',
      photoURL: user.photoURL,
      disabled: user.disabled,
      metadata: user.metadata,
      customClaims: user.customClaims || {}
    }));
    
    res.status(200).json(users);
  } catch (error: any) {
    console.error('Error listing users:', error);
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
};

export const toggleUserStatus = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params;
        const { disabled } = req.body;
        
        await auth.updateUser(uid, { disabled });
        res.status(200).json({ message: `User ${disabled ? 'disabled' : 'enabled'} successfully` });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to update user status', details: error.message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params;
        await auth.deleteUser(uid);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to delete user', details: error.message });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { email, password, displayName, role } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const userRecord = await auth.createUser({
            email,
            password,
            displayName: displayName || email.split('@')[0],
        });

        if (role === 'admin') {
            await auth.setCustomUserClaims(userRecord.uid, { admin: true });
        }

        res.status(201).json({ message: 'User created successfully', uid: userRecord.uid });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to create user', details: error.message });
    }
};
