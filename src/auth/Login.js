import React, {   useState } from "react";
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
 
const Login = () => {
   const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = (e) => {
    e.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        alert("User not signed in, with correct credentials");
      });
  };

  const signWithGoogle = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;

        navigate("/");
      })
      .catch((error) => {
        console.log("Error", error);
        const errorCode = error.code;
        // Handle error
      });
  };

  const loginWithYahoo = () => {
    const auth = getAuth();
    const provider = new OAuthProvider("yahoo.com");
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = OAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        const idToken = credential.idToken;
        navigate("/profile");
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
