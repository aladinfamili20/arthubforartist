import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const useUserRole = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = doc(db, 'artistHubUsers', user.uid);
        const docSnapshot = await getDoc(userDoc);
        if (docSnapshot.exists()) {
          setRole(docSnapshot.data().role);
        } else {
          setRole('user'); // Default role if no role is set
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);

  return { role, loading };
};

export default useUserRole;