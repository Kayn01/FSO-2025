import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const userFromLogin = await loginService.login({
        username,
        password,
      });

      const loggedInUser = {
        ...userFromLogin,
        id: userFromLogin.id || userFromLogin._id, // Prioritize 'id', then '_id'
      };

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(loggedInUser));
      blogService.setToken(loggedInUser.token);
      setUser(loggedInUser);
      setUsername("");
      setPassword("");
      showNotification("login successful", "success");
    } catch (exception) {
      showNotification("Wrong credentials", "error");
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();
    try {
      window.localStorage.removeItem("loggedBlogappUser");
      setUser(null);
      blogService.setToken(null);
      showNotification(null);
    } catch (exception) {
      showNotification("Error logging out user", "error");
    }
  };

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(returnedBlog));

      showNotification(
        `A new blog "${newBlog.title}" by ${newBlog.author} added`,
        "success"
      );
    } catch (exception) {
      showNotification(
        `Error adding blog: ${
          exception.response.data.error || exception.message
        }`,
        "error"
      );
    }
  };

  const updateBlog = async (blog) => {
    try {
      const likedBlog = {
        ...blog,
        likes: blog.likes + 1,
        user: blog.user.id,
      };

      const returnedBlog = await blogService.update(blog.id, likedBlog);

      setBlogs(
        blogs
          .map((b) => (b.id === blog.id ? returnedBlog : b))
          .sort((a, b) => b.likes - a.likes)
      );
      showNotification(
        `A blog "${blog.title}" by ${blog.author} likes updated`,
        "success"
      );
    } catch (exception) {
      showNotification(`Error liking blog: ${exception.message}`, "error");
    }
  };

  const handleDelete = async (blogToDelete) => {
    const confirm = window.confirm(
      `Remove blog "${blogToDelete.title}" by ${blogToDelete.author}?`
    );
    if (confirm) {
      try {
        await blogService.remove(blogToDelete.id);
        setBlogs(blogs.filter((blog) => blog.id !== blogToDelete.id));
        showNotification(
          `Blog "${blogToDelete.title}" by ${blogToDelete.author} removed`,
          "success"
        );
      } catch (exception) {
        showNotification(`Error removing blog: ${exception.message}`, "error");
      }
    }
  };

  const Notification = ({ notification }) => {
    if (!notification) {
      return null;
    }

    const style = {
      color: notification.type === "error" ? "red" : "green",
      background: "lightgrey",
      padding: 10,
      borderStyle: "solid",
    };

    return <div style={style}>{notification.message}</div>;
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>log in to application</h2>
      <Notification notification={notification} />
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const blogForm = () => {
    return (
      <>
        <h2>blogs</h2>
        <Notification notification={notification} />
        <div>
          {user.username} logged in{" "}
          <button onClick={handleLogout}>logout</button>
        </div>

        <Togglable buttonLabel="new blog">
          <BlogForm createBlog={addBlog} />
        </Togglable>

        <div>
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              handleLike={updateBlog}
              handleDelete={handleDelete}
              user={user}
            />
          ))}
        </div>
      </>
    );
  };

  return <div>{user === null ? loginForm() : blogForm()}</div>;
};

export default App;
