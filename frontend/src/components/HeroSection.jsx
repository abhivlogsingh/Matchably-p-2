import { Link } from "react-router-dom";
import video from "../assets/backgroundV.mp4";

export default function HeroSection() {
  return (
    <div className="relative flex justify-center items-center h-[85vh] w-full p-2 overflow-hidden">
      {/* Background Video - full screen behind content */}

      {/* Semi-transparent overlay for better text readability */}
      <div className="absolute z-10 w-full h-full bg-opacity-40 "></div>

      {/* Your content container */}
      <div className="gap-[80px] lg:gap-[40px] bg-[#8181811f] w-[90%] text-center py-20 px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 h-[90%] rounded-[20px] flex flex-col justify-center items-center relative z-20">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute z-[-1] w-full h-full object-cover rounded-[20px] opacity-[0.5]"
        >
          <source src={video} type="video/mp4" />
        </video>
        <div>

        <h1 className="text-white text-2xl text-[23px] sm:text-3xl font-extrabold leading-tight FontLato">
          <span className="text-lime-300">Get Free Products. Make Content. Get Rewarded.</span>
        </h1>
        <p className="text-gray-200 mt-4 text-base sm:text-lg max-w-3xl mx-auto FontNoto">
        Join brand campaigns and get free products for your content. Simple as that.
        </p>
        </div>
        <div className="flex gap-5">
  <Link
    to="/campaigns"
    className="mt-6 text-white px-5 md:px-8 py-2.5 md:py-3.5 rounded-[25px] text-sm md:text-lg font-semibold FontNoto
      bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500
      border-1 border-white hover:border-white
      shadow-[0_0_10px_2px_rgba(255,0,255,0.4)]
      transition duration-300 transform hover:scale-105 hover:shadow-[0_0_15px_4px_rgba(0,255,255,0.5)] w-[250px] lg:w-auto"
  >
    I'm an Influencer
  </Link>
</div>

      </div>
    </div>
  );
}
