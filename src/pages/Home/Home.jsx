import './Home.css'
import Weather from '../../components/Weather/Weather';
import AvatarUpload from '../../components/AvatarUpload/AvatarUpload';

export default function Home({ user, setUser }) {
    return ( <>
    <div className="yo-mama">YO -  MAMA</div>
    {user && setUser && <AvatarUpload user={user} setUser={setUser} />}
    <Weather /></>
    );}
