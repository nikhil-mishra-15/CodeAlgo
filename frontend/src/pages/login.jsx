import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Signup from "./Signup";
const Icon = ({ children, size = 22, stroke = 1.8, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
        className={className} aria-hidden="true">
        {children}
    </svg>
);

const fieldBase =
    "group flex h-[40px] items-center gap-3 rounded-[20px] border bg-[#0b0c0f] px-5 transition-colors focus-within:border-[#0ee37c]";

const iconClass = "shrink-0 text-[#9a9ba6] group-focus-within:text-[#0ee37c]";

const inputClass =
    "h-full min-w-0 flex-1 bg-transparent text-[14px] text-[#f4f4f6] outline-none placeholder:text-[#6d6e79]";

export default function Login({ onSubmit }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [show, setShow] = useState(false);
    const [error, setError] = useState({ field: "", message: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return setError({ field: "email", message: "Enter a valid email address." });
        }
        if (password.length < 6) {
            return setError({ field: "password", message: "Password must be at least 6 characters." });
        }
        setError({ field: "", message: "" });
        setLoading(true);
        try {
            await onSubmit?.({ email: email.trim(), password, remember });
        } catch (err) {
            setError({ field: "", message: err?.message || "Login failed. Try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black font-sans text-[#f4f4f6] overflow-hidden">
            {/* Header */}
            <div className="flex flex-row min-h-screen ">
                <div className="w-[40%] place-content-center">
                    <img className="animate-[bounce_3s_ease-in-out_infinite] mx-auto " src="/logo.png" height="250px" width="250px"></img>
                    <h1 className="w-fit mx-auto text-[40px] font-extralight">Algorithms</h1>
                </div>
                {/* Content */}
                <div className="w-[60%] flex justify-start items-center pl-10 place-content-center  h-full bg-black  min-h-screen mx-auto">
                    <main className="w-[70%] bg-black  border border-white rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.5)] p-10 rounded ">

                        <h1 className="text-[40px] font-extrabold leading-none tracking-[-0.04em] text-[#0ee37c]">
                            Log in
                        </h1>
                        <p className="mb-8 mt-4 max-w-[44ch] text-[14px] leading-relaxed text-[#9a9ba6]">
                            Welcome back. Log in to pick up where you left off on your solutions.
                        </p>

                        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                            <label className={`${fieldBase} ${error.field === "email" ? "border-[#ff6b6b]" : "border-[#1d1e24]"}`}>
                                <Icon className={iconClass}>
                                    <rect x="3" y="5" width="18" height="14" rx="3" />
                                    <path d="M3 8l9 6 9-6" />
                                </Icon>
                                <input type="email" placeholder="Email" autoComplete="email" aria-label="Email"
                                    value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
                            </label>

                            <label className={`${fieldBase} ${error.field === "password" ? "border-[#ff6b6b]" : "border-[#1d1e24]"}`}>
                                <Icon className={iconClass}>
                                    <rect x="4" y="10" width="16" height="11" rx="3" />
                                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                </Icon>
                                <input type={show ? "text" : "password"} placeholder="Password" autoComplete="current-password"
                                    aria-label="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                                    className={inputClass} />
                                <button type="button" onClick={() => setShow((s) => !s)}
                                    aria-label={show ? "Hide password" : "Show password"}
                                    className="grid rounded-lg p-1.5 text-[#9a9ba6] hover:text-[#f4f4f6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0ee37c]">
                                    <Icon>
                                        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
                                        <circle cx="12" cy="12" r="3" />
                                        {show && <path d="M3 3l18 18" />}
                                    </Icon>
                                </button>
                            </label>

                            <div role="alert" className="-mt-1.5 min-h-5 px-1 text-sm text-[#ff6b6b]">{error.message}</div>

                            <div className="flex items-center justify-between text-[15px] text-[#9a9ba6]">
                                {/* <label className="flex cursor-pointer items-center gap-2.5">
                                    <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
                                        className="h-[17px] w-[17px] accent-[#0ee37c]" />
                                    Remember me
                                </label> */}
                                <a href="/forgot-password" className="text-[#0ee37c] hover:underline">Forgot password?</a>
                            </div>

                            <button type="submit" disabled={loading}
                                className="mt-2 h-[60px] rounded-full bg-[#0ee37c] text-lg font-semibold text-[#02140b] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0ee37c] disabled:cursor-default disabled:opacity-60">
                                {loading ? "Logging in..." : "Log in"}
                            </button>
                        </form>

                        <p className="mt-7 text-center text-base text-[#9a9ba6]">
                            New here?{" "}
                            <span onClick={()=>{navigate("/Signup")}} className="text-[#0ee37c] hover:underline hover:cursor-grab">Create an account</span>
                        </p>
                    </main>
                </div>
            </div>
        </div>
    );
}