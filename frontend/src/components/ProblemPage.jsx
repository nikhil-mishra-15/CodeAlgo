import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import CodeEditor from "../utilities/CodeEditor";

const difficultyStyles = {
  Easy: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30",
  Medium: "bg-amber-500/10 text-amber-400 ring-amber-500/30",
  Hard: "bg-rose-500/10 text-rose-400 ring-rose-500/30",
};

function ProblemPage() {
  const API = import.meta.env.VITE_API_URL;

  const { slug } = useParams();
  const [problem, setProblem] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const getProblem = async () => {
    setLoading(true);
    setError("");
    setProblem(null);
    try {
      const res = await fetch(`${API}/api/problems/${slug}`);
      const data = await res.json();

      if (data.success) {
        setProblem(data.data);
      } else {
        setError(data.message || "Could not load problem");
      }

     // console.log(data.data.startcode)
    } catch (err) {
      console.error("error in getting problem", err);
      setError("Could not reach the server. Check that the backend is running.");
    } finally {
     setLoading(false);
    }
  };

  useEffect(() => {
    getProblem();
  }, [slug]);

  return (
    <div className="flex h-screen flex-col bg-black text-zinc-100 lg:flex-row">
      {/* LEFT: problem panel (~30%) */}
      <aside className="flex h-full w-full flex-col border-zinc-800 bg-zinc-950 lg:w-[40%] lg:min-w-[340px] lg:border-r">
        {/* Top bar */}
        <div className="flex items-center border-b border-zinc-800 px-5 py-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition hover:text-white focus:outline-none focus-visible:text-white"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 4l-6 6 6 6" />
            </svg>
            All problems
          </Link>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-6">
          {/* Loading */}
          {loading && (
            <div aria-busy="true" className="space-y-4">
              <div className="h-7 w-2/3 animate-pulse rounded bg-zinc-800" />
              <div className="h-5 w-1/4 animate-pulse rounded bg-zinc-800" />
              <div className="space-y-2 pt-4">
                <div className="h-3.5 w-full animate-pulse rounded bg-zinc-900" />
                <div className="h-3.5 w-full animate-pulse rounded bg-zinc-900" />
                <div className="h-3.5 w-4/5 animate-pulse rounded bg-zinc-900" />
              </div>
            </div>
          )}

          {/* Error */}
          {/* {!loading && (
            <div className="py-10 text-center">
              <p className="font-semibold text-white">Problem failed to load</p>
              <p className="mt-1 text-sm text-zinc-400">{error}</p>
              <button
                onClick={getProblem}
                className="mt-5 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30"
              >
                Try again
              </button>
            </div>
          )} */}

          {/* Problem */}
          {!loading && problem && (
            <article>
              <h1 className="text-2xl font-bold capitalize tracking-tight text-white">
                {problem.title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                    difficultyStyles[problem.difficulty] ||
                    "bg-zinc-800 text-zinc-300 ring-zinc-700"
                  }`}
                >
                  {problem.difficulty}
                </span>
                {problem.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-zinc-900 px-2.5 py-0.5 text-xs text-zinc-400 ring-1 ring-inset ring-zinc-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-zinc-300">
                {problem.desc}
              </p>

              {/* Examples */}
              {problem.examples?.length > 0 && (
                <section className="mt-8">
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                    Examples
                  </h2>
                  <div className="space-y-4">
                    {problem.examples.map((ex, i) => (
                      <div
                        key={ex._id || i}
                        className="rounded-xl border border-zinc-800 bg-black p-4"
                      >
                        <p className="mb-2 text-xs font-medium text-zinc-500">
                          Example {i + 1}
                        </p>
                        <dl className="space-y-2 font-mono text-[13px]">
                          <div>
                            <dt className="text-zinc-500">Input</dt>
                            <dd className="mt-0.5 whitespace-pre-wrap break-words text-zinc-200">
                              {ex.input}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-zinc-500">Output</dt>
                            <dd className="mt-0.5 whitespace-pre-wrap break-words text-zinc-200">
                              {ex.output}
                            </dd>
                          </div>
                        </dl>
                        {ex.explanation && (
                          <p className="mt-3 border-t border-zinc-800 pt-3 text-xs leading-relaxed text-zinc-400">
                            {ex.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Constraints */}
              {problem.constraints?.length > 0 && (
                <section className="mt-8">
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                    Constraints
                  </h2>
                  <ul className="space-y-2">
                    {problem.constraints.map((c, i) => (
                      <li key={i} className="flex gap-2.5 text-sm text-zinc-300">
                        <span className="mt-2 h-1 w-1 flex-none rounded-full bg-indigo-400" />
                        <code className="break-words font-mono text-[13px]">{c}</code>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Limits */}
              {(problem.timelimit || problem.memorylimit) && (
                <section className="mt-8 flex gap-3 pb-6">
                  {problem.timelimit && (
                    <div className="flex-1 rounded-xl border border-zinc-800 px-4 py-3">
                      <p className="text-xs text-zinc-500">Time limit</p>
                      <p className="mt-0.5 text-sm font-medium text-zinc-200">
                        {problem.timelimit} ms
                      </p>
                    </div>
                  )}
                  {problem.memorylimit && (
                    <div className="flex-1 rounded-xl border border-zinc-800 px-4 py-3">
                      <p className="text-xs text-zinc-500">Memory limit</p>
                      <p className="mt-0.5 text-sm font-medium text-zinc-200">
                        {problem.memorylimit} MB
                      </p>
                    </div>
                  )}
                </section>
              )}
            </article>
          )}
        </div>
      </aside>

      {/* RIGHT: editor area (configure later) */}

      <main className="flex min-h-[60vh] flex-1 flex-col bg-black lg:min-h-0 mt-3 ml-3 mr-3">
         {problem && <CodeEditor ley={problem.slug} slug={problem?.slug} starterCode={problem?.startcode}/> }
      </main>
    </div>
  );
}

export default ProblemPage;