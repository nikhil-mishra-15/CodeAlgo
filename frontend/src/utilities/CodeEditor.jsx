import { useState } from "react";
import { Editor } from "@monaco-editor/react";
import axios from "axios";


const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const LANGUAGES = [
    {value: "python", label:"Python"},
    {value:"javascript", label:"Javascript"},
    {value:"cpp",label:"C++"},
    {value:"java", label:"Java"}
];

export default function CodeEditor({slug,starterCode={}}){
  const API = import.meta.env.VITE_API_URL;

    const [language, setlanguage] = useState("python");

    const [drafts,setdrafts] = useState({
        python:starterCode.python || "",
        javascript: starterCode.js || "",
        cpp:starterCode.cpp || "",
        java:starterCode.java || "",
    });

    const [running ,setRunning] = useState(false);
    const [result,setresult] = useState(null);
    const [error,seterror] = useState("");

    const code = drafts[language];

    const handlerun = async()=>{
        setRunning(true);
        seterror("");
        setresult(null);

        try{
            const {data} = await axios.post(
                `${API}/api/problems/submit`,
                {slug,language,code},
                {withCredentials:true}
            );
            setresult(data);
        }catch(e){
            seterror(e.response?.data?.message || "could not reach the server");
        } finally{
            setRunning(false);
        }
        
    };

    return(
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <select 
                  value={language}
                  onChange={(e)=>setlanguage(e.target.value)}
                  className="rounded border border-neutral-300 px-2 py-1 text-sm">
                    {LANGUAGES.map((l)=>(
                        <option key={l.value} value={l.value}>
                            {l.label}
                        </option>
                    ))}
                  </select>

                <button onClick={handlerun} disabled={running || !code.trim()} className="rounded bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50">
                {running ? "Running...":"Run code"}
                </button>
            </div>

            <Editor height="420px" theme="vs-dark" language={language} value={code} onChange={(value)=> setdrafts((d) => ({...d,[language]:value??""}))}
            options={{fontSize:14, minimap:{enabled:false},automaticLayout:true}}
            />
            <OutputPanel result={result} error={error} running={running}/>
        </div>
    );
}

function OutputPanel({ result, error, running }) {
    if (running) return <p className="text-sm text-neutral-500">Running your code...</p>;
    if (error) return <p className="text-sm text-red-600">{error}</p>;
    if (!result) {
      return <p className="text-sm text-neutral-500">Run your code to see the output here.</p>;
    }
   
    const accepted = result.verdict === "Accepted";
   
    return (
      <div className="rounded border border-neutral-200 p-3">
        <h3 className={`text-lg font-semibold ${accepted ? "text-green-700" : "text-red-700"}`}>
          {result.verdict}
        </h3>
   
        {result.results.map((r) => (
          <div key={r.index} className="mt-3 text-sm">
            <p className="font-medium">
              Test case {r.index}: {r.verdict}
              {r.time != null && (
                <span className="font-normal text-neutral-500"> ({r.time}s)</span>
              )}
            </p>
            <Field label="Input" value={r.input} />
            <Field label="Expected" value={r.expected} />
            <Field label="Your output" value={r.stdout} />
            <Field label="Compiler output" value={r.compileOutput} />
            <Field label="Error" value={r.stderr} />
          </div>
        ))}
      </div>
    );
  }
  
function Field({label,value}){
    if(!value) return null;
    return (
        <div className="mt-1">
            <span className="text-neutral-500">{label}</span>
            <pre className="overflow-x-auto text-black rounded bg-neutral-100 p-2 text-xs">{value}</pre>
        </div>
    )
}