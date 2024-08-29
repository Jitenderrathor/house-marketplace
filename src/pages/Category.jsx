import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
function Category() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListings, setLastFetchedListings] = useState(null);
  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        //Get refrence
        const listingsRef = collection(db, "listings");

        const q = query(
          listingsRef,
          where("type", "==", params.categoryName),
          orderBy("timestamp", "desc"),
          limit(2)
        );

        // Execute query
        const querySnap = await getDocs(q);

        const lastVisible = querySnap.docs[querySnap.docs.length-1]
        setLastFetchedListings(lastVisible)
        const listings = [];

        querySnap.forEach((doc) => {
          console.log(doc.data());
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listings);
        console.log(listings)
        setLoading(false);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchListings()

  },[]);

  const onFetchMoreListings = async () => {
    try {
      //Get refrence
      const listingsRef = collection(db, "listings");

      const q = query(
        listingsRef,
        where("type", "==", params.categoryName),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListings),
        limit(2)
      );

      // Execute query
      const querySnap = await getDocs(q);

      const lastVisible = querySnap.docs[querySnap.docs.length-1]
      setLastFetchedListings(lastVisible)
      const listings = [];

      querySnap.forEach((doc) => {
        console.log(doc.data());
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings((prev)=>[...prev, ...listings]);
      console.log(listings)
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {params.categoryName === "rent"
            ? "Places for rent"
            : "Places for sale"}
        </p>
      </header>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((listing) => (
                <ListingItem key={listing.id} id={listing.id} listing={listing.data}/>
              ))}
            </ul>
          </main>
          <br />
              {lastFetchedListings && (
                <p className="loadMore" onClick={onFetchMoreListings}>Load More</p>
              )}
        </>
      ) : (
        <p>No listings for {params.categoryName}</p>
      )}
    </div>
  );
}

export default Category;
