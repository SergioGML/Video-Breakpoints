import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPlay,faPause,faVolumeMute,faVolumeUp,faExpand} from "@fortawesome/free-solid-svg-icons";
import { formatTime } from "../../utils/timeFormatter";
import { questions } from "../../data/questions";
import styles from "./Video.module.css";

//Componente que se encarga de mostrar los controles del video.

//Interfaz que define las propiedades que recibe el componente desde VideoComponent.
interface VideoControlsProps {
  currentTime: number;
  duration: number;
  volume?: number;
  isPaused: boolean;
  isMuted?: boolean;
  togglePlay: () => void;
  toggleMute?: () => void;
  handleProgressChange: (event: React.ChangeEvent<HTMLInputElement>) => void; //Evento que se dispara al cambiar la barra de progreso.
  handleVolumeChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; //Evento que se dispara al cambiar el volumen.
  onFullScreenToggle?: () => void;
}

//Componente funcional que recibe las propiedades y renderiza los controles del video.
const VideoControls: React.FC<VideoControlsProps> = ({
  currentTime,
  duration,
  volume = 50,
  isPaused,
  isMuted = false,
  togglePlay,
  toggleMute,
  handleProgressChange,
  handleVolumeChange,
  onFullScreenToggle,

}) => {


  return (
    <div className={styles.vcContainer}>
      {/* Grupo Izquierdo del reproductor (Play/Pause) */}
      <div className={styles.vcLeftGroup}>
        <button onClick={togglePlay} className={styles.vcIconButton}>
          {isPaused ? (
            <FontAwesomeIcon icon={faPlay} />
          ) : (
            <FontAwesomeIcon icon={faPause} />
          )}
        </button>
      </div>

      {/* Grupo Central del reproductor: Barra de progreso + marcadores */}
      <div className={styles.vcCenterGroup}>
        <div className={styles.vcProgressContainer}>
          {/* Barra de progreso */}
          <input
            className={styles.vcProgressBar}
            type="range"
            min="0"
            max={duration}
            step="0.1"
            value={currentTime}
            onChange={handleProgressChange}
          />

          {/* Marcadores de preguntas */}
          {/* Se recorren las preguntas y se renderiza un marcador en la barra de progreso por cada pregunta. */}
          {questions.map((q, index) => {
            const leftPercent = (q.time / duration) * 100; //Se calcula el porcentaje de la barra de progreso en el que se debe renderizar el marcador.
            return (
              <div
                key={index}
                className={styles.vcMarker}
                style={{ left: leftPercent  + "%" }}
              />
            );
          })}
        </div>
      </div>

      {/* Grupo Derecho del reproductor : se renderiza volumen, tiempo y fullscreen */}
      <div className={styles.vcRightGroup}>
        {toggleMute && handleVolumeChange && (        //Si se recibe la función de toggleMute y handleVolumeChange se renderiza el control de volumen.
          <div className={styles.vcVolumeContainer}>
            <button onClick={toggleMute} className={styles.vcIconButton}> 
              {isMuted ? (                            //Si el video está en mute se renderiza el icono de mute, sino el de volumen.
                <FontAwesomeIcon icon={faVolumeMute} />
              ) : (
                <FontAwesomeIcon icon={faVolumeUp} />
              )}
            </button>
            <input
              className={styles.vcVolumeSlider}
              type="range"
              min="0"
              max="100"
              step="1"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
        )}

        {/* Se renderiza el tiempo actual y el total del video. */}
        <span className={styles.vcTimeText}>
          {formatTime(currentTime)} / {formatTime(duration)} 
        </span>

        {/*Si se recibe la función de onFullScreenToggle se renderiza el botón de fullscreen.*/}
        {onFullScreenToggle && ( 
          <button onClick={onFullScreenToggle} className={styles.vcIconButton}>
            <FontAwesomeIcon icon={faExpand} />
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoControls;
