import { Slide, ToastContainer } from "react-toastify";
import Login from "./components/login/Login";
import "./scss/styles.scss";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { TokenManager } from "./utils/tokenmanager";
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";

function App() {
  useEffect(() => {
    TokenManager.loadToken();
  }, []);

  return (
    <div className="app">
      <ToastContainer
        theme="dark"
        toastStyle={{ borderRadius: ".5rem" }}
        transition={Slide}
      />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
