import "./Login.scss";
import logo from "../../assets/logo.png";
import Textfield from "../../components/textfield/Textfield";
import Button from "../../components/button/Button";
import React, { useRef, useState } from "react";
import { loginRequest, signupRequest } from "../../api/auth";
import { toast } from "react-toastify";
import axios from "axios";
import { TokenManager } from "../../utils/tokenmanager";
import { UserContext } from "../../App";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loginError, setLoginError] = useState("");
  const [singupError, setSingupError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const loginRef = useRef<HTMLFormElement>(null);
  const signupRef = useRef<HTMLFormElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const { setUser } = React.useContext(UserContext);

  React.useEffect(() => {
    if (!loginError) return;
    setTimeout(() => {
      setLoginError("");
    }, 6000);
  }, [loginError]);

  React.useEffect(() => {
    if (!singupError) return;
    setTimeout(() => {
      setSingupError("");
    }, 6000);
  }, [singupError]);

  React.useEffect(() => {
    if (!sliderRef.current) return;
    if (currentPage === 0) {
      sliderRef.current.style.height = loginRef.current?.offsetHeight + "px";
    } else {
      sliderRef.current.style.height = signupRef.current?.offsetHeight + "px";
    }
  }, [currentPage, sliderRef]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginRequest(email, password);
      TokenManager.setToken(data.token!);
      setUser(data);
      toast.success(`Login was successful!`);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        setLoginError(error?.response?.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
    setLoading(false);
  };

  const handleRegiser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await signupRequest(email, username, password);
      setUser(data);
      TokenManager.setToken(data.token!);
      toast.success(`Account created successfully!`);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        setSingupError(error?.response?.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
    setLoading(false);
  };

  return (
    <div className="login">
      <div className="login-content">
        <div className="login-header">
          <img src={logo} alt="" />
          ListenAnywhere
        </div>
        <div className="login-text">Login or Register</div>
        <div
          className="login-slider"
          style={{ "--page": currentPage } as React.CSSProperties}
          ref={sliderRef}
        >
          <form
            className="login-slider-item"
            ref={loginRef}
            onSubmit={handleLogin}
          >
            <Textfield
              label="Email address"
              onChange={setEmail}
              placeholder="Enter your email address"
              value={email}
              error={
                loginError?.toLowerCase()?.includes("user")
                  ? loginError
                  : undefined
              }
            />
            <Textfield
              label="Password"
              onChange={setPassword}
              placeholder="Enter your password"
              value={password}
              type="password"
              error={
                loginError?.toLowerCase()?.includes("password")
                  ? loginError
                  : undefined
              }
            />
            <Button
              onClick={() => {}}
              text="Login"
              type="submit"
              loading={loading}
            />

            <div className="login-separator">OR</div>

            <Button
              onClick={() => setCurrentPage(1)}
              text="Create an account"
              color="#999"
            />
          </form>

          <form
            className="login-slider-item"
            ref={signupRef}
            onSubmit={handleRegiser}
          >
            <Textfield
              label="Email address"
              onChange={setEmail}
              placeholder="Enter your email address"
              value={email}
              error={
                singupError?.toLowerCase()?.includes("email") ||
                singupError?.toLowerCase()?.includes("user")
                  ? singupError
                  : undefined
              }
            />
            <Textfield
              label="Username"
              onChange={setUsername}
              placeholder="Enter your username"
              value={username}
              error={
                singupError?.toLowerCase()?.includes("username")
                  ? singupError
                  : undefined
              }
            />
            <Textfield
              label="Password"
              onChange={setPassword}
              placeholder="Enter your password"
              value={password}
              type="password"
              error={
                singupError?.toLowerCase()?.includes("password")
                  ? singupError
                  : undefined
              }
            />

            <Button
              onClick={() => {}}
              text="Sign up"
              type="submit"
              loading={loading}
            />
            <div className="login-separator">OR</div>
            <Button
              onClick={() => setCurrentPage(0)}
              text="Log in"
              color="#999"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
