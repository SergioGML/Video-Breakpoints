// components/VideoControls.tsx
import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { formatTime } from "../../utils/timeFormatter";

interface VideoControlsProps {
  currentTime: number;
  duration: number;
  togglePlay: () => void;
  isPaused: boolean;
  toggleMute: () => void;
  handleProgressChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  volume: number;
  isMuted: boolean;
  handleVolumeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  currentTime,
  duration,
  togglePlay,
  isPaused,
  toggleMute,
  handleProgressChange,
  volume,
  isMuted,
  handleVolumeChange,
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const volumeTimerRef = useRef<number | null>(null);

  const handleVolumeMouseDown = () => {
    volumeTimerRef.current = window.setTimeout(() => {
      setShowVolumeSlider(true);
    }, 500);
  };

  const handleVolumeMouseUp = () => {
    if (volumeTimerRef.current) {
      clearTimeout(volumeTimerRef.current);
      volumeTimerRef.current = null;
      if (!showVolumeSlider) {
        // Si no se mostró el slider, se trata de un click corto: toggle mute.
        toggleMute();
      }
    }
  };

  const handleVolumeMouseLeave = () => {
    if (volumeTimerRef.current) {
      clearTimeout(volumeTimerRef.current);
      volumeTimerRef.current = null;
    }
  };

  return (
    <div className="w-full max-w-[752px] mt-2 px-4">
      <div className="flex items-center justify-between">
        <button onClick={togglePlay} className=" text-2xl">
          {isPaused ? (
            <FontAwesomeIcon icon={faPlay} />
          ) : (
            <FontAwesomeIcon icon={faPause} />
          )}
        </button>
        <div className="relative">
          <button
            onMouseDown={handleVolumeMouseDown}
            onMouseUp={handleVolumeMouseUp}
            onMouseLeave={handleVolumeMouseLeave}
            className="text-2xl ml-4"
          >
            {isMuted ? (
              <FontAwesomeIcon icon={faVolumeMute} />
            ) : (
              <FontAwesomeIcon icon={faVolumeUp} />
            )}
          </button>
          {showVolumeSlider && (
            <div className="absolute top-0 left-full ml-2 flex items-center bg-white p-1 rounded shadow">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 cursor-pointer"
              />
              <button onClick={() => setShowVolumeSlider(false)} className="ml-2 text-sm">
                x
              </button>
            </div>
          )}
        </div>
        <span className="ml-4 text-sm">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
      <div className="mt-2">
        <input
          type="range"
          min="0"
          max={duration}
          step="0.1"
          value={currentTime}
          onChange={handleProgressChange}
          className="w-full cursor-pointer"
        />
      </div>
    </div>
  );
};

export default VideoControls;
