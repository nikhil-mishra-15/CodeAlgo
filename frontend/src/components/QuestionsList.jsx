import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Login from "../pages/login";
import Signup from "../pages/Signup";

const difficultyStyles = {
  Easy: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30",
  Medium: "bg-amber-500/10 text-amber-400 ring-amber-500/30",
  Hard: "bg-rose-500/10 text-rose-400 ring-rose-500/30",
};

function QuestionsList() {
  const navigate = useNavigate();
  const [logged, setlogged] = useState(null);
  const [butt, setbuttons] = useState(false);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {

    const getuser = async () => {
      const res = await fetch("/api/users/current", {
        method: "GET",
        credentials: "include"
      })

      const data = await res.json();
      console.log(data.success);

      if (data.success) {
        setlogged(true);
      }else{
        setlogged(false);
        setbuttons(true);
      }

      console.log(logged);
    }



    const fetchTitles = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/problems/titles");
        const data = await res.json();

        if (data.success) {
          setList(data.data);
        } else {
          setError(data.message || "Could not load problems.");
        }
      } catch (err) {
        console.error("error in getting list of qs's", err);
        setError("Could not reach the server. Check that the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    getuser();
    fetchTitles();

  }, [])

  const logout = async () => {

    try {
      const res = await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include"
      })

      const data = await res.json();

      if (data.success) {
        navigate("/login");
      }

      if (!res.ok) {
        throw new Error(data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  }



  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((p) => p.title.toLowerCase().includes(q));
  }, [list, query]);



  return (
    <div className="w-full h-full bg-black text-zinc-100">
      <div className="flex flex-row w-full justify-between fixed ml-3 mt-2 absolute">
        <div className="flex flex-row gap-2">
          <img className="h-20 w-20" src="/logo.png"></img>
          {/* <h3 className="font-sans text-lg pt-4.5 pl-1 underline underline-offset-9 font-extralight">Algorithms</h3> */}
        </div>

        {logged &&
          <>
            <div className="flex flex-row gap-1 items-center w-[17%] gap-4 ">
              <button onClick={logout} className="bg-green-400 rounded h-[60%] w-[40%] text-black hover:cursor-pointer hover:bg-white font-semibold">
                Log out
              </button>
              <div className=" h-[70px] w-[70px] rounded-full mr-5 mt-1 hover:cursor-pointer  bg-white">
                <img src="/user.png" height="70px" width="70px"></img>
              </div>
            </div>

          </>
        }

        {!logged && butt && <div className="mr-5 pr-5 flex flex-row gap-2 w-[150px] mt-3">
          <button onClick={() => { navigate("/login") }} className="bg-white text-black w-[77%] h-[60%] flex justify-center items-center rounded-full hover:bg-green-400 hover:cursor-grab hover:text-white">
            <img className="h-6 w-6 " src="/enter.png"></img>
          </button>
          <button onClick={() => { navigate("/Signup") }} className="bg-green-400 text-black w-[80%] h-[60%] flex justify-center items-center rounded-full  hover:bg-white hover:cursor-grab hover:text-green-400">
            <img className="h-6 w-6 " src="/add-user.png"></img>

          </button>
        </div>
        }
      </div>
      <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-green-400 sm:text-5xl">
            Problems
          </h1>
          <p className="mt-3 max-w-md text-base text-zinc-400">
            Pick a problem, write your solution, and run it against the test cases.
          </p>
        </header>

        {/* Search + count */}
        <div className="mb-4 flex items-center gap-3">
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="9" r="6" />
              <path d="M14 14l4 4" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search problems"
              aria-label="Search problems"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
            />
          </div>
          {/* {!loading && !error && (
            <p className="whitespace-nowrap text-sm text-zinc-500">
              {filtered.length} of {list.length}
            </p>
          )} */}
        </div>

        {/* List container */}
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
          {/* Loading skeleton */}
          {loading && (
            <ul aria-busy="true">
              {[...Array(6)].map((_, i) => (
                <li
                  key={i}
                  className="flex items-center gap-4 border-b border-zinc-900 px-5 py-4 last:border-b-0"
                >
                  <div className="h-4 w-6 animate-pulse rounded bg-zinc-800" />
                  <div
                    className="h-4 animate-pulse rounded bg-zinc-800"
                    style={{ width: `${40 + ((i * 13) % 35)}%` }}
                  />
                </li>
              ))}
            </ul>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="px-6 py-14 text-center">
              <p className="font-semibold text-white">Problems failed to load</p>
              <p className="mt-1 text-sm text-zinc-400">{error}</p>
              <button
                onClick={fetchTitles}
                className="mt-5 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty: no problems in DB */}
          {!loading && !error && list.length === 0 && (
            <div className="px-6 py-14 text-center">
              <p className="font-semibold text-white">No problems yet</p>
              <p className="mt-1 text-sm text-zinc-400">
                Add one with a POST request to /api/problems/postquestion.
              </p>
            </div>
          )}

          {/* Empty: search has no match */}
          {!loading && !error && list.length > 0 && filtered.length === 0 && (
            <div className="px-6 py-14 text-center">
              <p className="font-semibold text-white">
                No problems match “{query}”
              </p>
              <button
                onClick={() => setQuery("")}
                className="mt-3 text-sm font-medium text-indigo-400 hover:text-indigo-300 focus:outline-none focus-visible:underline"
              >
                Clear search
              </button>
            </div>
          )}

          {/* Rows */}
          {!loading && !error && filtered.length > 0 && (
            <ul>
              {filtered.map((problem, index) => (
                <li
                  key={problem._id}
                  className="border-b border-zinc-900 last:border-b-0"
                >
                  <Link to={`/problems/${problem.slug}`}
                    className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-zinc-900 focus:outline-none focus-visible:bg-zinc-900 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-400"
                  >
                    <span className="w-7text-sm tabular-nums text-zinc-600">
                      <span>:::</span>
                    </span>

                    <span className="flex-1 truncate text-base font-semibold text-white-400 group-hover:text-white">
                      {problem.title}
                    </span>

                    {problem.difficulty && (
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${difficultyStyles[problem.difficulty] ||
                          "bg-white text-zinc-300 ring-zinc-700"
                          }`}
                      >
                        {problem.difficulty || "Missing"}
                      </span>
                    )}

                    {/* <span className="hidden rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100 sm:inline-block">
                      Solve
                    </span> */}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuestionsList;