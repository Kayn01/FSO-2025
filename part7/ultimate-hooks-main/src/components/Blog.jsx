import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { commentBlog } from "../reducers/blogReducer";

const Blog = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [commentContent, setCommentContent] = useState("");

  const blogs = useSelector((state) => state.blogs);
  const users = useSelector((state) => state.users);

  const blog = blogs.find((b) => b.id === id);

  if (!blog) {
    return null;
  }

  const creator = blog.user ? users.find((u) => u.id === blog.user.id) : null;

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (commentContent.trim() === "") {
      return;
    }
    await dispatch(commentBlog(blog.id, commentContent));
    setCommentContent("");
  };

  return (
    <div>
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <div>
        <a href={blog.url} target="_blank" rel="noopener noreferrer">
          {blog.url}
        </a>
      </div>
      <div>{blog.likes} likes</div>
      <div>
        added by {creator ? creator.name || creator.username : "unknown"}
      </div>

      <h3>Comments</h3>
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={commentContent}
          onChange={({ target }) => setCommentContent(target.value)}
          placeholder="Write a comment..."
        />
        <button type="submit">add comment</button>
      </form>
      {blog.comments && blog.comments.length > 0 ? (
        <ul>
          {blog.comments.map((comment) => (
            <li key={comment.id || comment.content}>{comment.content}</li>
          ))}
        </ul>
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
  );
};

export default Blog;
