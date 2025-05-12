import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { SignInFunction } from "../utils/auth";
import config from "../config";
import { toast } from "react-toastify";
import useAuthStore from "../state/atoms";
import { Helmet } from "react-helmet";
import { GoogleLogin } from '@react-oauth/google';

export default function Signin() {
  const { setSignin, verifyLogin } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();

  const HandleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    const res = await SignInFunction({ email, password });
    const { status, message } = res;

    if (status === "success") {
      toast.success(message, { theme: "dark" });
      verifyLogin();
      setSignin(true);
      Navigate("/");
    } else if (message === "Please verify your email first") {
      toast.error("⚠️ Please verify your email via the link sent to your inbox.", { theme: "dark" });
    } else {
      toast.error(message || "Login failed", { theme: "dark" });
    }

    setLoading(false);
  };

  const handleGoogleLogin = async (idToken) => {
    try {
      const res = await fetch(`${config.BACKEND_URL}/auth/google-auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (data.status === "success") {
        localStorage.setItem("token", data.token);
        toast.success("Login successful via Google", { theme: "dark" });
        verifyLogin();
        setSignin(true);
        Navigate("/");
      } else {
        toast.error(data.message, { theme: "dark" });
      }
    } catch (err) {
      toast.error("Google login failed", { theme: "dark" });
    }
  };

  return (
    <div className="flex bg-customBg justify-center items-center h-[80vh]">
      <Helmet>
        <title>Sign In | Matchably</title>
      </Helmet>

      <div className="flex flex-col justify-center w-[90%] md:w-auto px-5 bg-[#ffffff1b] lg:min-w-[400px] rounded-[5px] py-[20px] my-[10px]">
        <h2 className="text-center text-2xl font-bold text-gray-100">Login to your account</h2>

        <form className="space-y-6 mt-10" onSubmit={HandleSignIn}>
          <div>
            <label htmlFor="email" className="text-sm text-gray-200 block">Email address</label>
            <input id="email" name="email" type="email" required className="w-full mt-2 rounded-md bg-[#ffffff29] px-3 py-1 text-base text-gray-300" />
          </div>

          <div>
            <label htmlFor="password" className="text-sm text-gray-200 block">Password</label>
            <input id="password" name="password" type="password" required minLength={6} className="w-full mt-2 rounded-md bg-[#ffffff29] px-3 py-1.5 text-base text-gray-300" />
          </div>

          <div>
            <button type="submit" disabled={loading} className={`w-full rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow ${loading ? "bg-gray-500" : "bg-indigo-600"}`}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        <div className="mt-6 flex justify-center items-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              const idToken = credentialResponse.credential;
              handleGoogleLogin(idToken);
            }}
            onError={() => {
              toast.error("Google Login Failed", { theme: "dark" });
            }}
          />
        </div>

        <p className="mt-10 text-center text-sm text-gray-300">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-400 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
