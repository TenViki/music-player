import { Slide, ToastContainer } from "react-toastify";
import Login from "./components/login/Login";
import "./scss/styles.scss";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="app">
      <ToastContainer
        theme="dark"
        toastStyle={{ borderRadius: ".5rem" }}
        transition={Slide}
      />
      <Login />
    </div>
  );
}

export default App;
