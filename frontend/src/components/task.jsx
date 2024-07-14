import React from 'react'
import { useState } from 'react';
import { FaRegCheckCircle } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { FaRegCircle } from "react-icons/fa";
import axios from 'axios';

const Task = ({ taskid, checked, taskbody, onReload }) => {
    const [clicked, setClick] = useState(checked);
    console.log('task ',{ taskid, checked, taskbody,username: localStorage.getItem('user') })
    const handleDelete = async () => {
      const user = localStorage.getItem('user')
      const response = await axios.delete(`http://localhost:3000/task`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
        params: {
          username: localStorage.getItem('user'),
          taskid: taskid
        }
      });
      onReload()
        console.log(response)
    }
    return (
      <div className="flex justify-between">
        {clicked ? (
          <FaRegCheckCircle
            className="text-2xl text-custom-100"
            onClick={() => {
              setClick(false);
            }}
          />
        ) : (
          <FaRegCircle
            className="text-2xl text-custom-100"
            onClick={() => {
              setClick(true);
            }}
          />
        )}
        <div  className="flex  text-clip w-full ml-4 justify-start truncate">
          {clicked ? (
            <p className="truncate line-through text-gray-500 text-xl">{taskbody}</p>
          ) : (
            <p className="text-clip text-xl text-gray-500 no-underline">{taskbody}</p>
          )}
        </div>
        <button onClick={() => {handleDelete()}}>
          <FaTrashCan className="text-2xl text-custom-100" />
        </button>
      </div>
    );
  };

export default Task