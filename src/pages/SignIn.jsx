import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
const navigate = useNavigate()
  const { email, password } = formData;
  const onChangeHandle = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if(userCredential.user){
        navigate('/')
      }
    } catch (error) {
      toast.error(error.message)
    }
  };
  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Welcome Back</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
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
        <Link className="registerLink" to="/sign-up">
          Sign Up Instead
        </Link>
      </main>
    </div>
  );
}

export default SignIn;
