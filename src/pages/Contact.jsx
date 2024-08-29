import { useParams, useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

function Contact() {
  const [message, setMessage] = useState("");
  const [landloard, setLandloard] = useState("null");
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();

  useEffect(() => {
    const getLandloard = async () => {
      console.log(params.landLordId);
      const docRef = doc(db, "users", params.landLordId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandloard(docSnap.data());
      } else {
        toast.error("Could not get landlord data");
      }
    };
    getLandloard();
  });
  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Contact Landloard</p>
      </header>

      {landloard !== null && (
        <main>
          <div className="contactLandlord">
            <p className="landlordName">Contact {landloard?.name}</p>
          </div>
          <form className="messageForm">
            <div className="messageDiv">
              <label htmlFor="message" className="messageLabel">
                Message
              </label>
              <textarea
                name="message"
                id="message"
                className="textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
            <a href={`mailto:${landloard.email}?Subject=${searchParams.get('listingName')}&body=${message}`}>
              <button type="button" className="primaryButton">Send Message</button>
            </a>
          </form>
        </main>
      )}
    </div>
  );
}

export default Contact;
