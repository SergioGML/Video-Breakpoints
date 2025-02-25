import React from "react";
import YouTube from "react-youtube";
import { UseVideoPlayer } from "../../hooks/useVideoPlayer";


const VideoPlayer: React.FC<{ videoId: string}> = ({videoId}) => {
  const { opts, onReady } = UseVideoPlayer();
  return (
    <div className="flex flex-col items-center">
      <YouTube videoId={videoId} opts={opts} onReady={onReady} />
    </div>
  );
};

export default VideoPlayer;

