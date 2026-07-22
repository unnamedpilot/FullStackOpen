import { useState, useEffect } from "react";
import BlogView from "./components/BlogView";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification/Notification";
import blogService from "./services/blogs";

const App = () => {
  const [user, setUser] = useState(() => {
    const user = window.localStorage.getItem("loggedUser");
    return user === null ? null : JSON.parse(user);
  });
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationOptions, setNotificationOptions] = useState(null);

  useEffect(() => {
    if (user) {
      blogService.setToken(user.token);
    }
  }, [user]);

  const showNotification = (message, options) => {
    setNotificationMessage(message);
    setNotificationOptions(options);
    setTimeout(() => setNotificationMessage(null), 5000);
  };

  const updateLoggedUser = (userData) => {
    window.localStorage.setItem("loggedUser", JSON.stringify(userData));
    setUser(userData);
    blogService.setToken(userData.token);
  };

  const cleanLoggedUser = () => {
    window.localStorage.removeItem("loggedUser");
    setUser(null);
    blogService.setToken(null);
  };

  const loginForm = () => {
    return (
      <LoginForm
        showNotification={showNotification}
        updateLoggedUser={updateLoggedUser}
      />
    );
  };

  const blogView = () => {
    return (
      <>
        <BlogView showNotification={showNotification} />
      </>
    );
  };

  return (
    <div>
      <h2>blogs</h2>
      <Notification
        message={notificationMessage}
        options={notificationOptions}
      />
      {!user && loginForm()}
      {user && (
        <div>
          <p>
            {user.name} is logged in
            <button type="button" onClick={cleanLoggedUser}>
              logout
            </button>
          </p>
          {blogView()}
        </div>
      )}
    </div>
  );
};

export default App;
