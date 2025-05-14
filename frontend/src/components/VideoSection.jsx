import React from "react";
import video1 from "../assets/videof.mp4";
import video2 from "../assets/videos.mp4";
import video3 from "../assets/videoi.mp4";
import video4 from "../assets/Video.mp4";

const videos = [video1, video2, video3, video4];

export default function VideoSection() {
  return (
    <section className="w-full  py-14 px-4 sm:px-8 md:px-14 lg:px-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {videos.map((vid, i) => (
          <div
            key={i}
            className="bg-[#121212] p-4 rounded-2xl shadow-lg transition-transform transform hover:scale-105 hover:shadow-[0_0_20px_4px_rgba(0,255,255,0.4)]"
          >
            <div className="overflow-hidden rounded-xl border border-[#2a2a2a]">
              <video
                src={vid}
                muted
                loop
                playsInline
                autoPlay
                className="w-full h-[48vh] object-cover bg-black rounded-xl"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
