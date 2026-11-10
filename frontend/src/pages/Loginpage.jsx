import React from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './login';

function Loginpage() {
   const API = import.meta.env.VITE_API_URL;
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
         await axios.post(`${API}/api/users/login`,{email,password},{withCredentials:true});
         navigate("/");
      }} />
   )
}

export default Loginpage
