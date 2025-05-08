import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/logo_matchably.png";
import { Link } from "react-router-dom";
import Cookie from "js-cookie";
import { FaUserCircle } from "react-icons/fa";

const Navbar = ({ Islogin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!isOpen) {
        const currentScrollY = window.scrollY;
        setIsScrollingDown(currentScrollY > lastScrollY && currentScrollY > 10);
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      Cookie.remove("token");
      localStorage.removeItem("token");
      setIsOpen(false);
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex justify-center items-center h-[15vh]">
        <nav
          ref={menuRef}
          className={`backdrop-blur-md bg-white/10 border border-white/20 text-white px-6 py-3 md:px-12 lg:px-20 rounded-[20px] fixed w-[90%] z-[999] transition-transform duration-300 ${
            isScrollingDown ? "-translate-y-[140%]" : "translate-y-0"
          }`}
        >
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold font-sans">
              <img src={logo} alt="logo" width={120} />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6 text-gray-200 text-sm items-center">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <Link to="/campaigns" className="hover:text-white transition">Campaigns</Link>
              <Link to="/brand" className="hover:text-white transition">For Brands</Link>
              <Link to="/influencer" className="hover:text-white transition">For Influencers</Link>
              <Link to="/aboutus" className="hover:text-white transition">About Us</Link>

              {Islogin ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 border border-white px-4 py-1 rounded-full hover:bg-white hover:text-black transition"
                  >
                    <FaUserCircle size={18} />
                    <span>My Account</span>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-md z-50">
                      <Link to="/myaccount" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                      <Link to="/UserApplyCampaign" className="block px-4 py-2 hover:bg-gray-100">Applied Campaigns</Link>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/signin" className="border border-white rounded-full px-4 py-1 text-sm hover:bg-white hover:text-black transition">
                  Log in
                </Link>
              )}
            </div>

            {/* Mobile Button */}
            <div className="md:hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                }}
                className="text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* ✅ Mobile Menu Inside nav */}
          {isOpen && (
            <div className="fixed mt-[70px] md:hidden bg-[#1a1a1a]/98 backdrop-blur-md rounded-[20px] w-[89%] min-h-[250px] text-gray-200 text-sm flex flex-col items-center justify-center gap-4 z-[999]">
              <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-white">Home</Link>
              <Link to="/campaigns" onClick={() => setIsOpen(false)} className="hover:text-white">Campaigns</Link>
              <Link to="/brand" onClick={() => setIsOpen(false)} className="hover:text-white">For Brands</Link>
              <Link to="/influencer" onClick={() => setIsOpen(false)} className="hover:text-white">For Influencers</Link>
              <Link to="/aboutus" onClick={() => setIsOpen(false)} className="hover:text-white">About Us</Link>

              <div className="flex flex-col items-center gap-2">
                {Islogin ? (
                  <>
                    <Link to="/myaccount" onClick={() => setIsOpen(false)} className="border border-white px-10 py-1 rounded-full hover:bg-white hover:text-black">
                      My Account
                    </Link>
                    <button onClick={handleLogout} className="hover:text-white">
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/signin" onClick={() => setIsOpen(false)} className="border border-white px-10 py-1 rounded-full hover:bg-white hover:text-black">
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
