import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

export default function Profile() {
  const { user, isAuthenticated } = useAuth0();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetch(`${process.env.REACT_APP_API_URL}/profile/${user.sub}`)
        .then(response => response.json())
        .then(data => setProfile(data))
        .catch(error => console.error('Error fetching profile:', error));
    }
  }, [user, isAuthenticated]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile">
      <h1>{user.name}'s Profile</h1>
      <p>Email: {user.email}</p>
      <p>Favorites: {profile.favorites.join(', ')}</p>
    </div>
  );
}
