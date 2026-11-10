// server/services/judge0Service.js
// Talks to your local Judge0. Set JUDGE0_URL=http://127.0.0.1:2358 in server/.env
// (use 127.0.0.1, not localhost, to avoid IPv6 problems on Windows)

const JUDGE0_URL = process.env.JUDGE0_URL || "http://127.0.0.1:2358";

// Language names used by your app -> Judge0 language ids
const LANGUAGE_IDS = {
  javascript: 63, // Node.js 12.14.0
  python: 71,     // Python 3.8.1
  cpp: 54, 
  java: 62       // C++ (GCC 9.2.0)
};

// Judge0 status id -> verdict shown to the user / saved in Submission.status
function verdictFromStatus(id) {
  if (id === 3) return "Accepted";
  if (id === 4) return "Wrong Answer";
  if (id === 5) return "Time Limit Exceeded";
  if (id === 6) return "Compilation Error";
  if (id >= 7 && id <= 12) return "Runtime Error";
  return "Internal Error";
}

// Runs ONE test case. Judge0 compiles (if needed), runs, and compares
// stdout with expectedOutput (ignoring trailing whitespace).
async function runOne({ code, language, stdin, expectedOutput, timeLimit }) {
  const languageId = LANGUAGE_IDS[language];
  if (!languageId) throw new Error(`Unsupported language: ${language}`);

  const cpuSeconds = Math.min((timeLimit || 1000) / 1000, 15);
  const memoryLimit = language === "java" ? 512000 : 256000;

  const res = await fetch(
    `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language_id: languageId,
        source_code: code,
        stdin,
        expected_output: expectedOutput,
        cpu_time_limit:Math.min(cpuSeconds * 2 + 1, 20),
        memory_limit: memoryLimit, // seconds
        // memory_limit is left at Judge0's default on purpose: with the
        // per-process memory setting you enabled, a low limit can crash Node.
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`Judge0 returned ${res.status}: ${await res.text()}`);
  }

  const r = await res.json();
  return {
    verdict: verdictFromStatus(r.status.id),
    stdout: r.stdout,
    stderr: r.stderr,
    compileOutput: r.compile_output,
    time: r.time ? Number(r.time) : null, // seconds
    memory: r.memory,                     // KB
  };
}

export { runOne, LANGUAGE_IDS };