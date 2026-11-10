import Problem from "../models/Problem.js"
import {runOne} from "../services/judge0service.js";

export const runSamples = async(req,res)=>{
    try{
        const {slug,language,code} = req.body;

        if (!slug || !language || !code) {
            return res
              .status(400)
              .json({ message: "slug, language and code are required" });
          }
        
        if(code.length > 50000){
            return res.status(400).json({message:"Code is too long"});
        }

        const problem = await Problem.findOne({slug})
        if(!problem) return res.status(404).json({message:"Problem not found"})
      
        const samples = problem.testcases.filter((t)=>!t.isHidden);
        if(samples.length === 0){
            return res.status(400).json({message:"This problem has no sample test cases yet"})
        }

        const results = [];
        for(let i=0; i<samples.length; i++){
            const t= samples[i];
            const r= await runOne({code,language,stdin:t.input,expectedOutput:t.expectedOutput, timeLimit:problem.timelimit})
        
           results.push({
            index: i+1,
            input:t.input,
            expected:t.expectedOutput,
            ...r,
           });

           if(r.verdict !== "Accepted") break;
        }

        const verdict = results[results.length - 1].verdict;
        res.json({verdict,results});
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Could not run your code. Try again"})
    }
};