import { useNavigate, useLocation } from "react-router-dom"
import {ReactComponent as OfferIcon} from '../assets/svg/localOfferIcon.svg'
import {ReactComponent as ExploreIcon} from '../assets/svg/exploreIcon.svg'
import {ReactComponent as PersonOutLineIcon} from '../assets/svg/personOutlineIcon.svg'
function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()
    const pathMatchRoute = (route) =>{
        if(route === location.pathname){
            return true
        }
    }
  return (
    <footer className="navbar">
      <div className="navbarNav">
        <ul className="navbarListItems">
            <li className="navbarListItem">
                <ExploreIcon fill={pathMatchRoute('/')? '#2c2c2c':'#8f8f8f'} width='36px' height='36px' onClick={()=>navigate('/')}/>
                <p className={pathMatchRoute('/')? 'navbaarListItemNameActive':'navbaarListItemName'}>Explore</p>
            </li>
            <li className="navbarListItem">
                <OfferIcon fill={pathMatchRoute('/offers')? '#2c2c2c':'#8f8f8f'} width='36px' height='36px'onClick={()=>navigate('/offers')}/>
                <p className={pathMatchRoute('/offers')? 'navbaarListItemNameActive':'navbaarListItemName'}>Offers</p>
            </li>
            <li className="navbarListItem">
                <PersonOutLineIcon fill={pathMatchRoute('/profile')? '#2c2c2c':'#8f8f8f'} width='36px' height='36px' onClick={()=>navigate('/profile')}/>
                <p className={pathMatchRoute('/profile')? 'navbaarListItemNameActive':'navbaarListItemName'}>Profile</p>
            </li>
        </ul>
      </div>
    </footer>
  )
}

export default Navbar
