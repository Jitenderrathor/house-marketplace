import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore"
import { db } from "../firebase.config"
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from "swiper/modules";
import { Swiper,SwiperSlide } from "swiper/react";
import 'swiper/swiper-bundle.css'
import Spinner from "./Spinner";
function Slider() {
    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)

    const navigate = useNavigate()

    useEffect(()=>{
        const fetchListing = async()=>{
            const collRef = collection(db, 'listings')
            const q = query(collRef, orderBy('timestamp', 'asc'), limit(5))
            const collSnap = await getDocs(q)
            let listings = []
            collSnap.forEach((doc)=>{
                return listings.push({id: doc.id, data: doc.data()})
            })
            console.log(listings)
            setListings(listings)
            setLoading(false)
        }
        fetchListing()
    }, [loading])

    if(loading){
        return Spinner
    }
  return listings && (
    <>
     <p className="exploreHeading">Recommend</p>
     {/* Slider */}
     <Swiper slidesPerView={1} pagination={{clickable:true}} modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}>
        {listings.map(({data,id})=>
        (
          <SwiperSlide key={id} onClick={()=> navigate(`/category/${data.type}/${id}`)}>
            <div className="swiperSlideDiv" style={{background:`url(${data.imageUrls[0]})`}}>
              <p className="swiperSlideText">{data.name}</p>
              <p className="swiperSlidePrice">
                ${data.discountedPrice ?? data.regularPrice}
                {data.type === 'rent' && ' / month'}
              </p>
            </div>
          </SwiperSlide>
        )
        )}
      </Swiper>
      
    </>
  )
}

export default Slider
