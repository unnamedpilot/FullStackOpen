import { useState } from "react";
import loginService from "../services/login"
import noteService from "../services/notes";

const LoginForm = ({ setUser, showNotification }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      noteService.setToken(user.token)
      setUsername("");
      setPassword("");
    } catch {
      showNotification("wrong credentials")
    }
  };
  
  return (
      <>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>
          <button type="submit">login</button>
        </form>
      </>
    );
};

export default LoginForm
