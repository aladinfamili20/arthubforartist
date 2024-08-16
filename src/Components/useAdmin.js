import { useEffect, useState } from 'react';
 import {  doc, getDoc } from 'firebase/firestore';
import { db } from '../Data/Firebase';
import { useAuth } from '../auth/AuthContext';

const useAdmin = () => {
  const {currentUser} = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
         
      if (currentUser) {
        const docRef = doc(db, 'artistHubUsers', currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setIsAdmin(userData.role === 'admin');
        }
      }

      setLoading(false);
    };

    checkAdminRole();
  }, []);

  return { isAdmin, loading };
};

export default useAdmin;
