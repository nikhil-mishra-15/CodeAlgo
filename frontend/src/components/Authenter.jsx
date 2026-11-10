import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProblemPage from "./ProblemPage";
import Login from "../pages/login";
import Signup from "../pages/Signup";
function Authenter() {
  const [enter, setenter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // const handleui = async () => {
  //   //setLoading1(true);
  //   await delay(2000);
  //   setLoading1(false);
  // }

  useEffect(() => {
    const getuser = async () => {
      try {
        const res = await fetch(`${API}/api/users/current`, {
          credentials: "include",
        });

        const data = await res.json();
        console.log(data.name);

        if (data.success) {
          setenter(true);
        } else {
          setenter(false);
          setLoading1(false);
        }
      } catch (error) {
        console.log("fffff");
        setenter(false);
      } finally {
        setLoading(false);
      }
    };

    getuser();
  //  handleui();
  }, [])






  console.log(enter)



  return (
    <div className="relative min-h-screen bg-black">

      {/* Your existing page */}
      {!loading && <div
        className={`transition-all duration-300 ${!enter
          ? "blur-[3px] pointer-events-none select-none"
          : ""
          }`}
      >
        <ProblemPage />
      </div>}

      {/* Login overlay */}
      {!enter && !loading1 &&  (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

          <div className="w-[90%] max-w-md rounded-2xl border border-zinc-700 bg-zinc-950 p-8 text-center shadow-2xl">

            <h2 className="text-2xl font-bold text-white">
              Login Required
            </h2>

            <p className="mt-3 text-sm text-zinc-400">
              Please login to run code, submit solutions
              and access all problem features.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="mt-6 w-full rounded-lg bg-white py-3 font-semibold hover:cursor-pointer text-black transition hover:bg-zinc-300"
            >
              Login to Continue
            </button>

            <div className="flex flex-row place-content-center gap-1">
              <p className="mt-4 text-xs text-zinc-500">
                Don't have an account?
              </p>
              <p className="mt-4 text-xs text-zinc-500 underline text-blue-600 hover:cursor-pointer hover:text-blue-700" onClick={() => { navigate("/Signup") }}>Create one</p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Authenter
