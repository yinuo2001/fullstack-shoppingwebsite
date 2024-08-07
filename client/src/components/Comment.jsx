import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../css/Comment.css";

const Comments = () => {
  const { isAuthenticated, loginWithRedirect, user } = useAuth0();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/comments`);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, []);

  const handlePostComment = async () => {
    if (isAuthenticated) {
      try {
        await axios.post(`http://localhost:8000/comments`, { text: newComment });
        setNewComment("");
        const response = await axios.get(`http://localhost:8000/comments`);
        setComments(response.data);
      } catch (error) {
        console.error("Error posting comment:", error);
      }
    } else {
      alert("You need to log in to post a comment.");
      loginWithRedirect();
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (isAuthenticated) {
      try {
        await axios.delete(`http://localhost:8000/comments/${commentId}`);
        const response = await axios.get(`http://localhost:8000/comments`);
        setComments(response.data);
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    } else {
      alert("You need to log in to delete a comment.");
      loginWithRedirect();
    }
  };

  return (
    <div className="comment">

      {/* Header */}
      <header className="header">
        <Link to="/" className="main-header">Style Haven</Link>
      </header>

      {/* Comment Section */}
      <header className="comment-header">
        <h2>Comments</h2>
      </header>

      <div className="comment-input">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={isAuthenticated ? "Write your comment here..." : "Please log in to comment..."}
        ></textarea>
        <button onClick={handlePostComment}>Post</button>
      </div>
      <hr />
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <p><strong>{comment.user}</strong>: {comment.text}</p>
            {isAuthenticated && comment.userId === user.sub && (
              <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
            )}
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
