import React from 'react'
import './homepage.css'
import { TypeAnimation } from 'react-type-animation';
import { useAuth } from '../../context/AuthContext';
import { useNavigate ,Link} from 'react-router-dom';
import { SyncLoader } from 'react-spinners';



const HomePage = () => {
  const {user,isAuthenticated,isLoading} = useAuth()


  const navigate = useNavigate();
  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/sign-in');
    }
  };
  if(isLoading){
    return(
      <div>
        <SyncLoader color="#36D7B7" />
      </div>
    )
  }
  return (
    <div className='homepage'>
      <img src="/orbital.png" alt="" className='orbital' />
      <div className="left">
        
        <h1>SMARTER AI</h1>
        <h2>Supercharge your creativity and productivity</h2>
        <h3>Fast, intelligent, responsive, user-friendly, automated, multilingual, secure, customizable, efficient, scalable, interactive, adaptive, 24/7, insightful, innovative.</h3>
        <button onClick={handleGetStarted} className="get-started-btn">
          Get Started
        </button>
      </div>
      <div className="right">
        <div className="imgContainer">
          <div className="bgContainer">
            <div className="bg"></div>
          </div>
          <img src="/bot.png" alt="" className='bot' />
          <div className="chat">
            <img src="/bot.png" alt="" />
            <TypeAnimation
              sequence={[
                'Fast, intelligent, responsive',
                1000,
                'user-friendly, automated, multilingual',
                1000,
                'secure, customizable, efficient',
                1000,
                'interactive, adaptive, 24/7, insightful',
                1000
              ]}

              style={{ fontSize: '2em', display: 'inline-block' }}
              repeat={Infinity}
            />
          </div>
        </div>
      </div>
      <div className="terms">
        <img src="/logo.png" alt="" />
        <div className="links">
          <Link to='/'>Terms of service</Link>
          <span>|</span>
          <Link to='/'>Privacy policy</Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage
