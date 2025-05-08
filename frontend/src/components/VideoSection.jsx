import React from "react";
import video1 from "../assets/videof.mp4";
import video2 from "../assets/videos.mp4";
import video3 from "../assets/videoi.mp4";

const videos = [video1, video2, video3];

export default function VideoSection() {
  return (
    <section className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-10 bg-black">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((vid, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl shadow-md transform transition duration-300 hover:scale-105 hover:shadow-[0_0_12px_3px_rgba(0,255,255,0.3)] bg-[#1a1a1a] p-3"
          >
            <video
              src={vid}
              muted
              loop
              playsInline
              autoPlay
              className="w-full h-[50vh] sm:h-[60vh] lg:h-[55vh] object-contain rounded-xl bg-black"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
