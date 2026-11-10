import React from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Signup from './Signup';
import Login from './login';

function Signuppage() {
   const navigate = useNavigate();
   //     const handlelogin= async()=>{
   //         await axios.post("/api/users/login",{
   //             email:data.email,
   //             password:data.password
   //         });
   //         navigate("/problems");
   //     }
   //   return ( <Login onSubmit={()=>{handlelogin}} />)

   return (
      <Signup
         onSubmit={async ({ name, email, password }) => {
            console.log("Signup props received");

            const res = await axios.post(
               "/api/users/register",
               { name, email, password }
            );

            console.log(res.data);
            navigate("/login");
         }}
      />
   )
}

export default Signuppage
