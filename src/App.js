import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomeClient from './pages/HomeClient';
import ClientNavigation from './Components/ClientNavigation';
import Login from './auth/Login';
import HomePage from './pages/HomePage';
import Profile from './pages/Profile';
import Registration from './auth/Signup';
import { AuthContextProvider, useAuth } from './auth/AuthContext';
import UserNavigation from './Components/UserNavigation';
import AddArtwork from './pages/AddArtwork';
import PostArtwork from './pages/PostArtwork';
import Gallery from './pages/Dropdown/Grow/Gallery';
import Events from './pages/Dropdown/Grow/Events';
import Shows from './pages/Dropdown/Grow/Shows';
import Museums from './pages/Dropdown/Grow/Museums';
import Stores from './pages/Dropdown/Scale/Stores';
import Howto from './pages/Dropdown/Scale/Howto';
import ArtHubUni from './pages/Dropdown/Scale/ArtHubUni';
import ArtistsProfile from './pages/Dropdown/Audience/ArtistsProfile';
import Links from './pages/Dropdown/Audience/Links';
import SocialMedia from './pages/Dropdown/Audience/SocialMedia';
import AudienceSup from './pages/Dropdown/Audience/AudienceSup';
import Merch from './pages/Dropdown/Merch/Merch';
import LiveEvent from './pages/Dropdown/Merch/LiveEvent';
import Ecommerce from './pages/Dropdown/Merch/Ecommerce';
import HelpArtistProfile from './pages/Dropdown/Help/HelpArtistProfile';
import UserData from './pages/Dropdown/Help/UserData';
import ArtManagement from './pages/Dropdown/Help/ArtManagement';
import HelpPrivacy from './pages/Dropdown/Help/HelpPrivacy';
import Admin from './Components/Admin';
import PostGallery from './Components/PostGallery';
import PostEvent from './Components/PostEvent';

function App() {
  return (
    <AuthContextProvider>
      <MainApp />
    </AuthContextProvider>
  );
}

function MainApp() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      {user ? <UserNavigation /> : <ClientNavigation />}
      <Routes>
        <Route path='/' element={user ? <Profile /> : <HomeClient />} />
        <Route path='/login' element={<Login />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/homepage' element={<HomePage />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/signup' element={<Registration />} />
        <Route path='/postartwork' element={<PostArtwork />} />
        <Route path='/gallery' element={<Gallery />} />
        <Route path='/postgallery' element={<PostGallery />} />
        <Route path='/postevent' element={<PostEvent />} />
        <Route path='/event' element={<Events />} />
        <Route path='/shows' element={<Shows />} />
        <Route path='/musuems' element={<Museums />} />
        <Route path='/stores' element={<Stores />} />
        <Route path='/howto' element={<Howto />} />
        <Route path='/art-hubuniversity' element={<ArtHubUni />} />
        <Route path='/artistsprofile' element={<ArtistsProfile />} />
        <Route path='/links' element={<Links />} />
        <Route path='/socialmedia' element={<SocialMedia />} />
        <Route path='/audiencesupport' element={<AudienceSup />} />
        <Route path='/merch' element={<Merch />} />
        <Route path='/liveevent' element={<LiveEvent />} />
        <Route path='/ecmomerce' element={<Ecommerce />} />
        <Route path='/helpartirstprofile' element={<HelpArtistProfile />} />
        <Route path='/userdata' element={<UserData />} />
        <Route path='/artworkmanagement' element={<ArtManagement />} />
        <Route path='/helpprivacy' element={<HelpPrivacy />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
