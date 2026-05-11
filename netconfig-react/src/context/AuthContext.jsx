import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Derived state to ensure consistency
  const isAuthenticated = !!user;

  useEffect(() => {
    // 1. Check Demo bypass check for page reloads first
    const savedMock = sessionStorage.getItem('mock_admin');
    if (savedMock) {
      try {
        const mockUser = JSON.parse(savedMock);
        setUser(mockUser);
        setLoading(false);
        return; // Skip Firebase check if mock is active
      } catch (e) {
        sessionStorage.removeItem('mock_admin');
      }
    }

    // 2. Firebase Auth listener
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Auth State Changed:", currentUser?.email);
      if (currentUser) {
        // Force refresh the token to get the latest custom claims
        const idTokenResult = await currentUser.getIdTokenResult(true);
        const isAdmin = !!idTokenResult.claims.admin;
        
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          name: currentUser.displayName || 'User',
          photoURL: currentUser.photoURL,
          role: isAdmin ? 'admin' : 'student'
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    // Sun'iy to'xtash (UX uchun: foydalanuvchi tekshiruv ketayotganini his qilishi uchun)
    await new Promise(resolve => setTimeout(resolve, 1200));

    // BYPASS MODE: Test uchun admin loginini Firebase-siz amalga oshirish
    if (email === 'admin@netconfig.com') {
      console.log("LOGIN: Bypass mode activated for Admin");
      const mockUser = {
        uid: 'mock-admin-id',
        email: email,
        name: 'Samar Aliyev',
        role: 'admin'
      };

      setUser(mockUser);
      sessionStorage.setItem('mock_admin', JSON.stringify(mockUser));
      return { success: true, user: mockUser };
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // State will be set by onAuthStateChanged
      return { success: true, user: result.user };
    } catch (error) {
      console.error("Login error:", error.code);
      return { success: false, message: error.code };
    }
  };

  const register = async (email, password, name) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      
      // Update local state immediately after profile update
      setUser({
        uid: result.user.uid,
        email: result.user.email,
        name: name,
        role: 'student'
      });
      
      return { success: true };
    } catch (error) {
      console.error("Register error:", error.code);
      return { success: false, message: error.code };
    }
  };

  const logout = async () => {
    try {
      // 1. Immediately clear the central state to trigger UI updates
      setUser(null);

      // 2. Clear all persistent identifiers
      sessionStorage.removeItem('mock_admin');

      // 3. Clear Firebase session
      await signOut(auth);

      // 4. Navigate away
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error("Reset password error:", error.code);
      return { success: false, message: error.code };
    }
  };

  const getIdToken = async () => {
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken();
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout, resetPassword, getIdToken }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

