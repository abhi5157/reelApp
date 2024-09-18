import React, { useState, useRef, useEffect } from "react";
import { ArrowUpCircle, Volume2, VolumeX, Play, Pause } from "lucide-react";

const ReelVideo = ({ reel, isActive, onToggleActive }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onToggleActive(reel.id);
          if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
          }
        } else {
          if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      });
    }, options);

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [reel.id, onToggleActive]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative w-full h-[600px] bg-black">
      <video
        ref={videoRef}
        src={reel.url}
        className="w-full h-full object-contain"
        loop
        muted={isMuted}
        playsInline
        onClick={togglePlay}
      />
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <button
          onClick={toggleMute}
          className="bg-gray-800 text-white p-2 rounded-full opacity-70 hover:opacity-100 transition-opacity"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black bg-opacity-50 rounded-full p-4">
            <Play size={32} className="text-white" />
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [reels, setReels] = useState([]);
  const [activeReelId, setActiveReelId] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("video/")) {
      const newReel = {
        id: Date.now(),
        url: URL.createObjectURL(file),
        name: file.name,
      };
      setReels((prevReels) => [...prevReels, newReel]);
    } else {
      alert("Please upload a valid video file.");
    }
  };

  const handleToggleActive = (reelId) => {
    setActiveReelId(reelId);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Interactive React Reels App</h1>

      <div className="mb-4">
        <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center">
            <ArrowUpCircle className="w-8 h-8 text-gray-400" />
            <span className="mt-2 text-base text-gray-500">Upload a video</span>
          </div>
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept="video/*"
          />
        </label>
      </div>

      <div className="space-y-4">
        {reels.map((reel) => (
          <ReelVideo
            key={reel.id}
            reel={reel}
            isActive={activeReelId === reel.id}
            onToggleActive={handleToggleActive}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
