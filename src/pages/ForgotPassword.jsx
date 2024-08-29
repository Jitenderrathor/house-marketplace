import { useState } from "react";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getAuth, sendPasswordResetEmail } from "firebase/auth/web-extension";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const onChange = () => {};
  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth, email)
      toast.success("Email was send successfully")
    } catch (error) {
      toast.error(error.message)
    }
  };
  return (
    <div className="pageContainer">
      <header>
        <div className="pageHeader">Forgot Password</div>
      </header>
      <main>
          <form onSubmit={onSubmit}>
            <input
              type="email"
              className="emailInput"
              placeholder="Email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Link className="forgotPasswordLink" to='/sign-in'>
            Sign In
            </Link>
            <div className="signInBar">
              <div className="signInText"> Send Reset Link</div>
              <button className="signInButton">
                <ArrowRightIcon fill="#ffffff" width='34px' height="34px"/>
              </button>
            </div>
          </form>
        </main>
    </div>
  );
}

export default ForgotPassword;
