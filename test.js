// src/auth/Login.js
import React from 'react';
import '../styles/Login.css';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../Firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Adjust the path if needed

const Login = ({ setUser, setIsAdmin }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setIsAdmin(userDoc.data().isAdmin);
      } else {
        setIsAdmin(false);
      }

      // Navigate to home page after login
      navigate('/home');
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  return (
    <div className='loginMainContainer'>
      <section className='loginContainer'>
        <div className='LoginInfo'>
          <h1>Log In</h1>
          <div className='LoginInfoContents'>
            <div className='ServiceLogins'>
              <div className='faceTweet'>
                <div
                  className='SocialButtons'
                  onClick={signInWithGoogle}
                >
                  <img src={require('../Image/Logos/Google.png')} alt='Google logo' />
                  <h4> Continue with Google</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
