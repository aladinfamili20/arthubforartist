import React from 'react'
import '../Style/HomeClient.css'
import { Link } from 'react-router-dom'
import Section1 from '../Components/Section1'
const HomeClient = () => {
  return (
    <div>
      <div>
        <img src={require('../assets/3.jpg')} className='homeImg' width={'100%'} 
        height={800}
        alt=''/>

        <div className='texth1'>
          <h1>A platform for artists.</h1>
        </div>
        <div className='texth2'>
          <h2>
            Post and manage your artworks all in one place.
          </h2>
        </div>

        <div className='texth3'>               
          <a href='/signup'>
          <h2>Sign up</h2>
          </a> 
        </div>

       <Section1/>

      
      </div>
    </div>
  )
}

export default HomeClient