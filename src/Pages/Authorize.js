import React, {useState} from "react";
import { createClient } from '@supabase/supabase-js'
import {useNavigate} from "react-router-dom";
import "../Styles/Authorisation.css";

function Authorize() {
    const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_ANON_KEY);
    const [isLogin, setIsLogin] = useState(true);
    let navigate = useNavigate();

    //Sign up values
    const [signUpName, setSignUpName] = useState();
    const [signUpEmail, setSignUpEmail] = useState();
    const [signUpPassword, setSignUpPassword] = useState();
    const [confirmEmail, setConfirmEmail] = useState(false);

    //Sign in values
    const [signInEmail, setSignInEmail] = useState();
    const [signInPassword, setSignInPassword] = useState();
   const [isSigninIn, setIsSigningIn] = useState(false);
    async function signUp() {
        const { data, error } = await supabase.auth.signUp(
            {
            email: signUpEmail,
            password: signUpPassword,
            options: {
                data: {
                name: signUpName,
                }
            }
            }
        )
        if(error) {
            console.log(error);
            alert("An error occurd");
        } else {
            setConfirmEmail(true);
        }
    }

    async function SignIn() {
        setIsSigningIn(true)
            const { data, error } = await supabase.auth.signInWithPassword({
                email: signInEmail,
                password: signInPassword,
            })
            if(error) {
                console.log(error);
                alert(error);
                setIsSigningIn(false)
            } else {
                window.localStorage.setItem("session", JSON.stringify(data))
                navigate("/profile")
            }
    }


    return (
        <div class="container page auth-page">
            {isLogin? <>
               <h1>Sign In</h1>
               <h5>Login with your credentials</h5>
               {!isSigninIn?
               <form>
                   <div class="mb-4">
                       <label for="exampleFormControlInput1" class="form-label">Email address</label>
                       <input type="email" onChange={e=>setSignInEmail(e.target.value)} value={signInEmail} class="form-control" id="exampleFormControlInput1" placeholder="name@example.com"/>
                   </div>
                   <div class="mb-4">
                       <label for="exampleFormControlInput1" class="form-label">Password</label>
                       <input type="password" onChange={e=>setSignInPassword(e.target.value)} value={signInPassword} class="form-control" id="exampleFormControlInput1" placeholder="********"/>
                   </div>
                   <button type="button" onClick={()=> SignIn()}class="btn btn-primary login">Sign In</button>
                   <a class="login-bottom-link" onClick={()=> setIsLogin(false)}>Dont have an acount? Sign Up</a>
                   
               </form>:
                <div class="sk-chase">
                    <div class="sk-chase-dot"></div>
                    <div class="sk-chase-dot"></div>
                    <div class="sk-chase-dot"></div>
                    <div class="sk-chase-dot"></div>
                    <div class="sk-chase-dot"></div>
                    <div class="sk-chase-dot"></div>
                </div>
                }
               
               </>:<>
            <h1>Sign Up</h1>
            <h5>All fields are required.</h5>

            {!confirmEmail? 
            <form>
                <div class="mb-4">
                    <label for="exampleFormControlInput1" class="form-label">Name</label>
                    <input type="text" onChange={e=>setSignUpName(e.target.value)} value={signUpName} class="form-control" id="exampleFormControlInput1" placeholder="John Doe"/>
                </div>
                <div class="mb-4">
                    <label for="exampleFormControlInput1" class="form-label">Email address</label>
                    <input type="email" onChange={e=>setSignUpEmail(e.target.value)} value={signUpEmail} class="form-control" id="exampleFormControlInput1" placeholder="name@example.com"/>
                </div>
                <div class="mb-4">
                    <label for="exampleFormControlInput1" class="form-label">Password</label>
                    <input type="password" class="form-control" onChange={e=>setSignUpPassword(e.target.value)} value={signUpPassword}   id="exampleFormControlInput1" placeholder="********"/>
                </div>
                <button type="button" onClick={()=> signUp()}class="btn btn-primary login">Sign Up</button>
                <a class="login-bottom-link" onClick={()=> setIsLogin(true)}>Already have an acount? Sign In</a>
            </form> : 
            <div class="confirm-email">
                <img src="https://www.flaticon.com/svg/vstatic/svg/3916/3916632.svg?token=exp=1668438865~hmac=5a55b1e5df5fdb94808f74644fdeb3f7" width="50"></img>
                <h2>Verification link sent!</h2>
                <span>We emailed a confirmation link to {signUpEmail}. Check your email for a link to sign in and create your account.</span>
                <div><a class="login-bottom-link" onClick={()=> setIsLogin(true)}>Sign In</a></div>

            </div>}
            </>}
            <div class="background-overlay overlay-login"></div>

        </div>
    )
}

export default Authorize;