import React from 'react'
import '../Style/HomeClient.css'
import { Link } from 'react-router-dom'
import Section1 from '../Components/Section1'
const HomePage = () => {
  return (
    <div>
      <div>
        <img src={require('../assets/3.jpg')} className='homeImg' width={'100%'} 
        height={800}
        alt=''/>

        <div className='texth1'>
          <h1>A place for artists.</h1>
        </div>
        <div className='texth2'>
          <h2>
            Post and manage your artworks all in one place.
          </h2>
        </div>

        

       <Section1/>

      
      </div>
    </div>
  )
}

export default HomePage