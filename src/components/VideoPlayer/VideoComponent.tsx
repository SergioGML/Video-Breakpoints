import React, { useEffect } from "react";
import YouTube from "react-youtube";
import VideoControls from "./VideoControls";
import { UseVideoPlayer } from "../../hooks/useVideoPlayer";
import { useHomeContext } from "../../context/AppContext";
import styles from "./Video.module.css";

//Componente que renderiza el video, coordina la visualziación del video y controla el sistema de preguntas.

interface VideoComponentProps { //Interfaz que define las propiedades que recibe el componente y su type.
  videoId: string;
  isFullScreen?: boolean;
  onFullScreenToggle?: () => void;
}

const VideoComponent: React.FC<VideoComponentProps> = ({ //Componente funcional que recibe las propiedades videoId, isFullScreen y onFullScreenToggle.
  videoId,
  isFullScreen = false,
  onFullScreenToggle,
}) => {
  const { //Se obtienen las propiedades del hook UseVideoPlayer.
    playerRef,
    opts,
    currentTime,
    duration,
    isPaused,
    volume,
    isMuted,
    onReady,
    onStateChange,
    togglePlay,
    toggleMute,
    handleProgressChange,
    handleVolumeChange,
  } = UseVideoPlayer(isFullScreen);

  const { activeQuestion } = useHomeContext(); //Se obtiene activeQuestion del contexto.

  useEffect(() => { //Control del mute. Si hay pregunta activa, se mutea el video, si no, se desmutea.
    if (playerRef.current) {
      if (activeQuestion !== null) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
      }
    }
  }, [activeQuestion, playerRef]); //Se ejecuta cada vez que cambia activeQuestion.

  const containerClasses = [
    styles.container,
    isFullScreen ? styles.fullScreen : styles.normal, //Si isFullScreen es true, se aplica la clase styles.fullScreen, si no, styles.normal.
    activeQuestion !== null && styles.hidden, //Si activeQuestion es distinto de null, se aplica la clase styles.hidden.
  ]
    .filter(Boolean) //Recorre el array y elimina los valores falsos del array.
    .join(" "); //Convierte el array en un string ya que className espera un string.

  const youtubeClasses = [
    styles.youtube,
    isFullScreen ? styles.youtubeFullScreen : styles.youtubeNormal, //Si isFullScreen es true, se aplica la clase styles.youtubeFullScreen, si no, styles.youtubeNormal.
  ]
    .filter(Boolean) //Recorre el array y elimina los valores falsos del array.
    .join(" ");   //Convierte el array en un string ya que className espera un string.

  return (
    <div className={containerClasses}>
      <YouTube
        className={youtubeClasses}
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        onStateChange={onStateChange}
      />
      <div className={styles.controlsContainer}>
        <VideoControls
          currentTime={currentTime}
          duration={duration}
          isPaused={isPaused}
          volume={volume}
          isMuted={isMuted}
          togglePlay={togglePlay}
          toggleMute={toggleMute}
          handleProgressChange={handleProgressChange}
          handleVolumeChange={handleVolumeChange}
          onFullScreenToggle={onFullScreenToggle}
        />
      </div>
    </div>
  );
};

export default VideoComponent;