import React, { useEffect, useState } from "react";
import "../Style/Login.css";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
} from "firebase/auth";
import { auth, db } from "../Data/Firebase";
import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "./AuthContext";

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 

  const onLogin = (e) => {
    e.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        navigate('/');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        alert('User not signed in, with correct credentials');
      });
  };

  const signWithGoogle = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const today = new Date();
    const date = today.toDateString();
    const Hours = today.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const time = today.toLocaleDateString();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        if (user) {
          const ref = doc(db, 'artistHubUsers', user.uid);
          await setDoc(ref, {
            displayName: user.displayName,
            email:user.email,
            photoURL:user.photoURL,
            userID: user.uid,
            hourJoined: Hours,
            createdAt: today,
            postTime: date,
            dateJoined:time,
           });
          navigate('/');
        } else {
          console.error('No user data available after sign in');
        }
      })
      .catch((error) => {
        console.log("Error", error);
        const errorCode = error.code;
        // Handle error
      });
  };

  const loginWithYahoo = () => {
    const auth = getAuth();
    const provider = new OAuthProvider('yahoo.com');
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = OAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        const idToken = credential.idToken;
        navigate('/profile');
      })
      .catch((error) => {
        console.log(error);
      });
  };







  return (
    <div className="loginMainContainer">
      <section className="loginContainer">
        <div className="LoginInfo">
          <h1>Log In</h1>
          <div className="LoginInfoConetents">
            <form>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="LoginInput"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="LoginInput"
                id="password"
              />
            </form>

            <button className="LoginButton" type="submit" onClick={onLogin}>
              Log in
            </button>
            <p>Or log in with:</p>
            <div className="ServiceLogins">
              <div>
                <div className="faceTweet">
                  <div className="SocialButtons" onClick={signWithGoogle}>
                    {" "}
                    <img
                      src={require("../assets/Google.png")}
                      alt="Google logo"
                    />
                    <h4> Continue with Google</h4>
                  </div>
                  <div className="SocialButtons" onClick={loginWithYahoo}>
                    <img
                      src={require("../assets/Yahoo.png")}
                      alt="Yahoo logo"
                    />
                    <h4> Continue with Yahoo</h4>
                  </div>

                  {/* <div className='SocialButtons'
      onClick={loginInWithFacebook}>
       <img src={require('../images/Logos/Facebook.png')} alt='facebook logo'/><h4> Continue with Facebook</h4>
      </div> */}

                  {/* <div className='SocialButtons'
      onClick={loginWithTwitter}>
       <img src={require('../images/Logos/Twitter.png')} alt='facebook logo'/><h4> Continue with Twitter</h4>
      </div> */}
                </div>
              </div>
              <div></div>
            </div>
            <small>
              Don't have account?{" "}
              <a href="/signup" className="sgnupin">
                Sign up
              </a>
            </small>
            <div>
              <small>
                By signing up, you agree to our Terms, Data Policy and Cookies
                Policy.
              </small>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Sign in With Google

export default Login;
