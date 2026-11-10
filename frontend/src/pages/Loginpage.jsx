import React from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './login';

function Loginpage() {

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
      <Login onSubmit={async({email, password})=>{
         await axios.post("/api/users/login",{email,password});
         navigate("/");
      }} />
   )
}

export default Loginpage
