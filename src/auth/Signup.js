import React, {  useState } from "react";
import "../Style/Login.css";
import {
  getAuth,
   signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
} from "firebase/auth";
import {  db } from "../Data/Firebase";
import {  doc, setDoc } from "firebase/firestore";
import { useAuth } from "./AuthContext";

const Signup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
 
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
            });
          navigate('/editprofile');
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
           <div className="LoginInfoConetents">
             
            <p>Sign up in with:</p>
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
 
                </div>
              </div>
              <div></div>
            </div>
            <small>
              Already have account?{" "}
              <a href="/login" className="sgnupin">
                Login up
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

export default Signup;
