import React from "react";
import YouTube from "react-youtube";
import { UseVideoPlayer } from "../../hooks/useVideoPlayer";
import VideoControls from "./VideoControls";

interface VideoComponentProps {
  videoId: string;
  isFullScreen?: boolean;
}

const VideoComponent: React.FC<VideoComponentProps> = ({ videoId, isFullScreen = false }) => {
  const {
    opts,
    onReady,
    currentTime,
    duration,
    togglePlay,
    isPaused,
    toggleMute,
    handleProgressChange,
    volume,
    isMuted,
    handleVolumeChange,
  } = UseVideoPlayer(isFullScreen);

  return (
    <div className={`flex flex-col items-center ${isFullScreen ? "w-full h-full" : ""}`}>
      <YouTube videoId={videoId} opts={opts} onReady={onReady} />
      <VideoControls 
         currentTime={currentTime}
         duration={duration}
         togglePlay={togglePlay}
         isPaused={isPaused}
         toggleMute={toggleMute}
         handleProgressChange={handleProgressChange}
         volume={volume}
         isMuted={isMuted}
         handleVolumeChange={handleVolumeChange}
      />
    </div>
  );
};

export default VideoComponent;

