import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, AuthErrorCodes } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../Data/Firebase';
import '../Style/Signup.css';

const Registration = () => {
  const [displayName, setDisplayName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState('');
  const navigate = useNavigate();

  const RegisterHandler = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const ref = doc(db, 'artistHubUsers', user.uid);
      await setDoc(ref, {
        displayName,
        lastName,
        email,
        userID: user.uid,
      });
      navigate('/profile');
      console.log('sign up successfully with user ID:', user.uid);
    } catch (error) {
      console.log('error signing up', error);
      if (error.code === "auth/email-already-in-use") {
        setErrors("Email already in use");
      } else if (error.code === AuthErrorCodes.WEAK_PASSWORD) {
        setErrors("Password should be at least 6 characters");
      } else if (error.code === "auth/operation-not-allowed") {
        setErrors("Email/password sign-in method is not enabled.");
      } else {
        setErrors(error.message);
      }
    }
  };

  return (
    <main>
      <section>
        <div className='upContainer'>
          <div className='upContent'>
            <div className='upImg'>
              <img src='https://images.unsplash.com/photo-1536849460588-696219a9e98d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1131&q=80' alt='Sign Up' />
            </div>
            <div className='upInfo'>
              <h1>Sign Up</h1>
              <div className='signupError'>
                {errors && <span>{errors}</span>}
              </div>
              <form onSubmit={RegisterHandler}>
                <div className='upInfoContents'>
                  <input 
                    type='text' 
                    placeholder='First Name' 
                    className='signInput' 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)} 
                    id='displayName' 
                  />
                  <input 
                    type='text' 
                    placeholder='Last Name' 
                    className='signInput' 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                    id='lastName' 
                  />
                  <input 
                    type='email' 
                    placeholder='Email' 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className='signInput' 
                    id='email' 
                  />
                  <input 
                    type='password' 
                    placeholder='Password' 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className='signInput' 
                    id='password' 
                  />
                  <button className='signButton' type="submit">Sign Up</button>
                </div>
              </form>
              <small>Already have an account? <a href='/login' className='sgnupin'>Sign In</a></small>
              <small>Artist Signing Up <a href='/register' className='sgnupin'>Artist sign Up</a></small>
              <div>
                <small>By signing up, you agree to our <a href='/privacypolicy' style={{textDecoration: 'underline'}}>Privacy and Policy</a>.</small>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Registration;
