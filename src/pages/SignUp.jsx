import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import OAuth from "../components/OAuth";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { name, email, password } = formData;
  const onChangeHandle = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      updateProfile(auth.currentUser, {
        displayName: name,
      });
      const formDataCopy = {...formData}
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp()
      formDataCopy.admin = false
      await setDoc(doc(db, 'users', user.uid), formDataCopy)
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Welcome Back</p>
      </header>
      <main>
        <form onSubmit={onSubmitHandler}>
          <input
            type="text"
            id="name"
            value={name}
            className="nameInput"
            placeholder="Name"
            onChange={onChangeHandle}
          />
          <input
            type="text"
            id="email"
            value={email}
            className="emailInput"
            placeholder="Email"
            onChange={onChangeHandle}
          />
          <div className="passwordInputDiv">
            <input
              type={showPassword ? "text" : "password"}
              className="passwordInput"
              id="password"
              value={password}
              onChange={onChangeHandle}
              placeholder="Password"
            />
            <img
              src={visibilityIcon}
              className="showPassword"
              alt=""
              onClick={() => setShowPassword((prev) => !prev)}
            />
          </div>
          <Link to="forgot-password" className="forgotPasswordLink">
            Forgot Password
          </Link>
          <div className="signInBar">
            <p className="signInText">Sign In</p>
            <button className="signInButton">
              <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
            </button>
          </div>
        </form>
        {/* Google OAuth */}
        <OAuth/>
        <Link className="registerLink" to="/sign-in">
          Sign In Instead
        </Link>
      </main>
    </div>
  );
}

export default SignIn;
