import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import "../css/Profile.css";

const Profile = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [profile, setProfile] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      const fetchProfile = async () => {
        try {
          const response = await axios.get("/api/verify-user");
          setProfile(response.data);
          setName(response.data.name);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };

      const fetchComments = async () => {
        try {
          const response = await axios.get("/api/comments");
          setComments(response.data.filter(comment => comment.user.email === user.email));
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      };

      fetchProfile();
      fetchComments();
    } else {
      loginWithRedirect();
    }
  }, [isAuthenticated, user.email, loginWithRedirect]);

  const handleUpdateProfile = async () => {
    try {
      await axios.put("/api/verify-user", { name });
      const response = await axios.get("/api/verify-user");
      setProfile(response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="profile-container">
      {profile && (
        <>
          <h2>Profile</h2>
          <div className="profile-section">
            <label>Email:</label>
            <p>{profile.email}</p>
          </div>
          <div className="profile-section">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <button onClick={handleUpdateProfile}>Update Profile</button>

          <h3>My Comments</h3>
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <p>{comment.text}</p>
                <hr />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
