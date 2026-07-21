import { useState } from "react";
import Notes from "./components/Notes";
import Notification from "./components/Notification";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm"
import NoteSection from "./components/NoteSection";

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null);

  const showNotification = (message) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(null))
  }

  const loginForm = () => {
    return( 
      <>
        <LoginForm setUser={setUser} showNotification={showNotification}/>
      </>
    )
  }
  
  const noteSection = () => {
    return (
      <>
          <p>{user.name} is logged in</p>
          <NoteSection showNotification={showNotification}/>
      </>)
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      {!user && loginForm()}
      {user && noteSection()}
      <Footer />
    </div>
  );
};

export default App;
