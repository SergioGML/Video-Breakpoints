import React from "react";
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
}

const VideoControls: React.FC<VideoControlsProps> = ({
  currentTime,
  duration,
  togglePlay,
  isPaused,
  toggleMute,
  handleProgressChange,
}) => {
  return (
    <div className="w-full max-w-[752px] mt-2 px-4">
      <div className="flex items-center justify-between">
        <button onClick={togglePlay} className="text-2xl">
          {isPaused ? (
            <FontAwesomeIcon icon={faPlay} />
          ) : (
            <FontAwesomeIcon icon={faPause} />
          )}
        </button>
        <button onClick={toggleMute} className="text-2xl ml-4">
          {/* Puedes ajustar el icono según el estado de mute si lo deseas */}
          <FontAwesomeIcon icon={faVolumeMute} />
        </button>
        <span className="ml-4 text-sm">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
      {/* Barra de progreso draggable */}
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
