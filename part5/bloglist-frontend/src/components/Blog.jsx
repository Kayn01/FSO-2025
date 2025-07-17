import { useState } from "react";

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [showDetails, setShowDetails] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

   const likeBlog = (event) => {
    event.preventDefault()
    handleLike(blog)
  }

  const deleteBlog = (event) => {
    event.preventDefault()
    handleDelete(blog)
  }
  
const showDeleteButton = user && blog.user && (blog.user.id === user.id)
  console.log(user)
  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} &nbsp;
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      {showDetails && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}<button onClick={likeBlog}>like</button>
          </div>
          <div>{blog.user ? blog.user.username : 'unknown'}</div>
          {showDeleteButton && (
            <button onClick={deleteBlog} style={{backgroundColor: 'red', color: 'white' }}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
