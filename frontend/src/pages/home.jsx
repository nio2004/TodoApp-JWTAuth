import React, { useEffect, useState } from "react";
import Logo from "./../assets/logo.png";

import { MdDeleteSweep } from "react-icons/md";
import { setUsername } from "../redux/slice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Task from "../components/task";

const Home = () => {
  // console.log("home")
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [value, setValue] = useState()
  const [user, setUser] = useState()
  const [reload, setReload] = useState(false);
  const [accesstoken, setAccessToken] = useState()
  // let accesstoken = useSelector((state) => state.accesstoken);
  // setUser(useSelector((state) => state.username));
  // console.log(accesstoken)
  // console.log(user)

  const authenticate = async () => {
    // console.log('auth',user)
    // if (!accesstoken || !user) navigate("/login", { replace: true });
    if (!user || !accesstoken) {
      // If token or user is not stored in localStorage, navigate to login
      navigate("/login", { replace: true });
      return;
    }
    const response = await axios.get("http://localhost:3000/tasks/" + user, {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    });
    setTasks(response.data);
    console.log(response)
    if(response.status != 200) navigate("/login", { replace: true });
    // console.log(res)
    // if(response.ok)
    //   tasks= response.data;
    // else
    // console.log(response)
  };

  useEffect(() => {
    let storedAccessToken = localStorage.getItem("jwt");
    let storedUser = localStorage.getItem('user');
    if (!storedAccessToken || !storedUser) { navigate('/login') }
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    // if (!accesstoken) accesstoken = localStorage.getItem("jwt");
    // setUser(localStorage.getItem('user'));
    // console.log(user)
    // console.log(accesstoken)
    if(user)
      authenticate();
    // console.log(tasks.map((obj)=>{console.log(obj)}))
    // console.log(tasks)
  }, [user,accesstoken,reload]);

  const handleReload = () => {
    setReload(prev => !prev);
  };


  const handleAddtask = async() => {
    // console.log(user)
    // console.log(value)
    
    const response = await axios.post('http://localhost:3000/task',{
      username: user,
      taskbody: value,
      tasktime: "20-09-24"
    })

    setValue('');
    if (response.status >= 200 && response.status < 300) {
      // The response is OK
        console.log('Response is OK:', response.data);
        authenticate();
        // return response.data;
    } else {
        // The response is not OK
        console.error('Response is not OK:', response.status);
    }
  }

  return (
    <>
      <div className="">
        {/* HeadBar */}
        <div className="w-full bg-custom-50">
          <img src={Logo} className="mx-auto"></img>
        </div>
        {/* Add Bar */}
        <div className="flex justify-between mx-auto mt-10 w-3/4 bg-custom-50 border border-gray rounded-xl">
          <input
            placeholder="Add Task"
            className=" w-full text-lg bg-transparent p-2"
            onChange={(e)=>{setValue(e.target.value)}}
            value={value}
          />
          <button className="bg-blue-400 rounded-r-xl text-white text-lg p-2 px-4"
                  onClick={()=>{handleAddtask()}}>
            ADD
          </button>
        </div>

        <div className="w-3/4 h-fit mx-auto bg-custom-50 m-5 p-5 rounded-xl">
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks available.</p>
        ) : (
          tasks.map((obj) => (
            <div key={obj.taskid}>
              <Task taskid={obj.taskid} checked={false} taskbody={obj.taskbody} onReload={handleReload}/>
              <div className="w-full my-2 border border-gray-500" />
            </div>
          ))
        )}

          <div className="flex justify-end mt-2" onClick={() => {}}>
            <MdDeleteSweep className="float-right text-2xl text-custom-100" />
            <div className="text-lg text-custom-100">Clear Completed</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
