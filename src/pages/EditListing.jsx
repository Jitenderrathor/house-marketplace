import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
function EditListing() {
  // const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const auth = getAuth();
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);
  const [formData, setFromData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
    userRef: auth.currentUser.uid,
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
  } = formData;

  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error("You are not the owner of this listing");
      navigate("/");
    }
  },[navigate, params.listingId, auth.currentUser.uid, listing]);
  useEffect(() => {
    setLoading(true);
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setFromData({ ...docSnap.data(), address: docSnap.data().location });
        setLoading(false);
      } else {
        navigate("/");
        toast.error("Listing dose not exists");
      }
    };
    fetchListing();
  }, [navigate, params.listingId]);
  if (loading) {
    return <Spinner />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (discountedPrice >= regularPrice) {
      setLoading(false);
      toast.error("Discounted price needs to be less than regular price");
      return;
    }
    if (images.lenght > 6) {
      setLoading(false);
      toast.error("Upload max 6 images");
      return;
    }

    // Store Images in firebase
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, "images/" + filename);

        const uploadTask = uploadBytesResumable(storageRef, image);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };
    const imageUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false);
      toast.error("Image not uploaded");
      return;
    });

    const formDataCopy = {
      ...formData,
      imageUrls,
      timestamp: serverTimestamp(),
    };

    delete formDataCopy.images;
    delete formDataCopy.address;
    formDataCopy.location = address;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    // const docRef = await addDoc(collection(db, 'listings'), formDataCopy)
    const docRef = doc(db, "listings", params.listingId);
    await updateDoc(docRef, formDataCopy)
    setLoading(false);

    toast.success("Listing saved");
    // console.log(docRef.id)
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };
  const onMutate = (e) => {
    let boolean = null;

    if (e.target.value === true) {
      boolean = true;
    }
    if (e.target.value === false) {
      boolean = false;
    }

    //Files
    if (e.target.files) {
      setFromData((prev) => ({
        ...prev,
        images: e.target.files,
      }));
    }
    // Text/Booleans/Number
    if (!e.target.files) {
      setFromData((prev) => ({
        ...prev,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };
  return (
    <div className="profile">
      <header>
        <p className="pageHeader">Edit Listings</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <label className="formLabel">Sell / Rent</label>
          <div className="formButtons">
            <button
              type="button"
              className={type === "sale" ? "formButtonActive" : "formButton"}
              id="type"
              value="sale"
              onClick={onMutate}
            >
              Sale
            </button>
            <button
              type="button"
              className={type === "rent" ? "formButtonActive" : "formButton"}
              id="type"
              value="rent"
              onClick={onMutate}
            >
              Rent
            </button>
          </div>

          <label className="formLabel">Name</label>
          <input
            type="text"
            className="formInputName"
            id="name"
            value={name}
            onChange={onMutate}
            maxLength="32"
            minLength="10"
            required
          />
          <div className="formRooms flex">
            <div className="">
              <label className="formLabel">Bedrooms</label>
              <input
                type="number"
                className="formInputSmall"
                id="bedrooms"
                value={bedrooms}
                onChange={onMutate}
                min="1"
                max="50"
                required
              />
            </div>
            <div className="">
              <label className="formLabel">Bathrooms</label>
              <input
                type="number"
                className="formInputSmall"
                id="bathrooms"
                value={bathrooms}
                onChange={onMutate}
                min="1"
                max="50"
                required
              />
            </div>
          </div>
          <label className="formLabel">Parking Spot</label>
          <div className="formButtons">
            <button
              type="button"
              className={parking ? "formButtonActive" : "formButton"}
              id="parking"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              type="button"
              className={
                !parking && parking !== null ? "formButtonActive" : "formButton"
              }
              id="parking"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>
          <label className="formLabel">Furnished</label>
          <div className="formButtons">
            <button
              type="button"
              className={furnished ? "formButtonActive" : "formButton"}
              id="furnished"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              type="button"
              className={
                !furnished && furnished !== null
                  ? "formButtonActive"
                  : "formButton"
              }
              id="furnished"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>
          <label className="formLabel">Address</label>
          <textarea
            type="text"
            className="formInputAddress"
            id="address"
            value={address}
            onChange={onMutate}
            required
          />
          <label className="formLabel">Offer</label>
          <div className="formButtons">
            <button
              type="button"
              className={offer ? "formButtonActive" : "formButton"}
              id="offer"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              type="button"
              className={
                !offer && offer !== null ? "formButtonActive" : "formButton"
              }
              id="offer"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>
          <label className="formLabel">Regular Price</label>
          <div className="formPriceDiv">
            <input
              type="number"
              className="formInputSmall"
              id="regularPrice"
              value={regularPrice}
              onChange={onMutate}
              min="50"
              max="75000000"
              required
            />
            {formData.type === "rent" && (
              <p className="formPriceText">$ / Month</p>
            )}
          </div>
          {offer && (
            <>
              <label className="formLabel">Discounted Price</label>
              <input
                type="number"
                className="formInputSmall"
                id="discountedPrice"
                value={discountedPrice}
                onChange={onMutate}
                min="50"
                max="75000000"
                required
              />
            </>
          )}
          <label className="formLabel">Images</label>
          <p className="imagesInfo">The first image will be cover (max 6).</p>
          <input
            type="file"
            className="formInputFile"
            id="images"
            onChange={onMutate}
            max="6"
            accept=".jpg,.png, .jpeg, .webp"
            multiple
            required
          />

          <button type="submit" className="primaryButton createListingButton">
            Edit Listing
          </button>
        </form>
      </main>
    </div>
  );
}

export default EditListing;
