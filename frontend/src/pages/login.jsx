import { useState } from "react";
import React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAccessToken, setRefreshToken, setUsername } from "../redux/slice";


const Login = () => {
  const [username, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const dispatch = useDispatch();
  // const userauth = useSelector((state) => !state.auth.accesstoken);
  
  const OnSubmit = async () => {
    // e.preventDefault();
    console.log("clicked")
    setMessage("");
    // console.log('in');
    if (!username || !password) {
      setMessage("Fill Details");
    } else {
      try {
        const response = await axios.post("http://localhost:3000/login", {
          username: username,
          password: password,
        });
        
        console.log(response);
        setMessage("Login successful!");
        
        console.log(response.data.username);
    
        dispatch(setUsername(response.data.username));
        
        dispatch(setAccessToken(response.data.accessToken))
        dispatch(setRefreshToken(response.data.refreshToken))
        navigate("/", { replace: true });
      } catch (error) {
        console.error("There was an error logging in:", error);
        setMessage("Login failed. Please try again.");
      }
    }
  };

  return (
    <div>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Log in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {/* <form className="space-y-6"> */}
          <div>
            <label
              value={username}
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              User Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                placeholder="Username"
                onChange={(e) => setUser(e.target.value)}
                className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                // for="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              {/* <div className="text-sm">
                    <a
                      href="#"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot password?
                    </a>
                  </div> */}
            </div>
            <div className="mt-2">
              <input
                placeholder="Password"
                type="password"
                // value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                required
              />
            </div>
          </div>

          <div className="my-6">
            <button
              onClick={
                () => {OnSubmit()}}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Log in
            </button>
            {/* <button
              onClick={()=>{onclickdispatch()}}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Redux
            </button> */}
          </div>
          {message}
          {/* </form> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
