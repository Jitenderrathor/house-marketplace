import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import shareIcon from "../assets/svg/shareIcon.svg";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from "swiper/modules";
import { Swiper,SwiperSlide } from "swiper/react";
import 'swiper/swiper-bundle.css'
function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(null);

  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log(docSnap.data());
        setListing(docSnap.data());
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      {/* Slider */}
      <Swiper slidesPerView={1} pagination={{clickable:true}} modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}>
        {listing.imageUrls.map((url,index)=>(
          <SwiperSlide key={index}>
            <div className="swiperSlideDiv" style={{background:`url(${url})`}}></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className="shareIconDiv"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt="" />
      </div>
      {shareLinkCopied && <p className="linkCopied">Link Copied!</p>}
      <div className="listingDetails">
        <p className="listingName">
          {listing.name} - $
          {listing.offer
            ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
        <p className="listingLocation">{listing.location}</p>
        <p className="listingType">
          {listing.type === "rent" ? "Rent" : "Sale"}
        </p>

        {listing.offers && (
          <p className="discountPrice">
            ${listing.discountedPrice - listing.regularPrice} discount
          </p>
        )}
        <ul className="listingDetailsList">
          <li>
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Bedrooms`
              : "1 Bedrooms"}
          </li>
          <li>
            {listing.bathrooms > 1
              ? `${listing.bathrooms} Bathrooms`
              : "1 Bathrooms"}
          </li>
          <li>{listing.parking ? "Parking Spot" : ""}</li>
          <li>{listing.furnished ? "Furnished" : ""}</li>
        </ul>

        {/* <p className="listingLocationTitle">Location</p> */}
        {/* Map */}
        {auth.currentUser?.uid !== listing.userRef &&(
          <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`} className="primaryButton">Contact Landlord</Link>
        )}
      </div>
    </main>
  );
}

export default Listing;
