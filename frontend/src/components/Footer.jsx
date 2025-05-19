import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebook, FaLinkedin, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full flex justify-center items-center bg-[#80808029] text-gray-300 py-6">
      <div className="container mx-auto px-6 flex flex-col items-center">
        <div className="flex w-4/5 justify-between items-center flex-wrap gap-9">
          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Quick Links</h2>
            <ul>
              <li className="mb-1">
                <Link to="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li className="mb-1">
                <Link to="/campaigns" className="text-gray-300 hover:text-white">
                  Campaigns
                </Link>
              </li>
              <li className="mb-1">
                <Link to="/rewards&affiliation" className="text-gray-300 hover:text-white">
                  Rewards & Affiliation
                </Link>
              </li>
              <li className="mb-1">
                <Link to="/brand" className="text-gray-300 hover:text-white">
                  For Brands
                </Link>
              </li>
              
              {/* <li className="mb-1">
                <Link to="/ProductFeedback" className="text-gray-300 hover:text-white">
                  Product Feedback
                </Link>
              </li> */}
            </ul>
          </div>
          <div>
            <ul>
<li className="mb-1">
                <Link to="/influencer" className="text-gray-300 hover:text-white">
                  For Influencers
                </Link>
              </li>
              <li className="mb-1">
                <Link to="/aboutus" className="text-gray-300 hover:text-white">
                  About Us 
                </Link>
              </li>
              </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Contact Us</h2>
            <p className="text-sm FontNoto">
              Email: <a href="mailto:info@guideway.kr" className="text-blue-400 hover:underline">info@matchably.kr</a>
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Follow Us</h2>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/matchably_official/" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="text-gray-300 hover:text-white text-xl" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook className="text-gray-300 hover:text-white text-xl" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="text-gray-300 hover:text-white text-xl" />
              </a>
              <a href="https://www.tiktok.com/@matchably_officia?lang=en" target="_blank" rel="noopener noreferrer">
                <FaTiktok className="text-gray-300 hover:text-white text-xl" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-6 text-sm">
          © 2025 Guideway Consulting. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
