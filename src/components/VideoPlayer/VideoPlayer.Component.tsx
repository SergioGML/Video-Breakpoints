import React from "react";
import YouTube from "react-youtube";
import { UseVideoPlayer } from "../../hooks/useVideoPlayer";

interface VideoPlayerProps {
  videoId: string;
  isFullScreen?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, isFullScreen = false }) => {
  // Se le pasa isFullScreen para ajustar las dimensiones.
  const { opts, onReady } = UseVideoPlayer(isFullScreen);
  return (
    <div className={`flex flex-col items-center ${isFullScreen ? "w-full h-full" : ""}`}>
      <YouTube videoId={videoId} opts={opts} onReady={onReady} />
    </div>
  );
};

export default VideoPlayer;


