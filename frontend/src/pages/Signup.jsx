import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import ReCAPTCHA from "react-google-recaptcha";
import config from "../config";

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const Navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    if (!recaptchaToken) {
      toast.error("Please complete reCAPTCHA", { theme: "dark" });
      return setLoading(false);
    }

    const res = await fetch(`${config.BACKEND_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (data.status === "success") {
      toast.success("Verification link sent to your email", { theme: "dark" });
      Navigate("/signin");
    } else {
      toast.error(data.message, { theme: "dark" });
    }
    setLoading(false);
  };

  const handleGoogleSignup = async (decoded) => {
    try {
      const res = await fetch(`${config.BACKEND_URL}/auth/google-auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: decoded.email,
          name: decoded.name,
        }),
      });

      const data = await res.json();
      if (data.status === "success") {
        localStorage.setItem("token", data.token);
        toast.success("Signed up with Google", { theme: "dark" });
        Navigate("/signin");
      } else {
        toast.error(data.message, { theme: "dark" });
      }
    } catch (err) {
      toast.error("Google signup failed", { theme: "dark" });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[var(--background)]">
      <Helmet>
        <title>Sign Up | Matchably</title>
      </Helmet>

      <div className="w-[90%] md:w-[400px] p-5 rounded bg-[#ffffff1b]">
        <h2 className="text-center text-xl font-semibold text-white mb-6">
          Create an account
        </h2>

        <form onSubmit={handleFormSubmit} className="space-y-5">
          <input name="name" type="text" placeholder="Name" required className="w-full p-2 rounded bg-gray-700 text-white" />
          <input name="email" type="email" placeholder="Email" required className="w-full p-2 rounded bg-gray-700 text-white" />
          <input name="password" type="password" placeholder="Password" required className="w-full p-2 rounded bg-gray-700 text-white" />

          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={(token) => setRecaptchaToken(token)}
          />

          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white p-2 rounded mt-2">
            {loading ? "Submitting..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-5 text-center text-gray-300">OR</div>

        <div className="mt-3 flex justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              const decoded = jwtDecode(credentialResponse.credential);
              handleGoogleSignup(decoded);
            }}
            onError={() => {
              toast.error("Google Login Failed", { theme: "dark" });
            }}
          />
        </div>

        <p className="mt-5 text-center text-gray-300 text-sm">
          Already have an account?{" "}
          <Link to="/signin" className="text-indigo-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
