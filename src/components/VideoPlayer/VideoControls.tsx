import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faVolumeMute,
  faVolumeUp,
  faExpand,
} from "@fortawesome/free-solid-svg-icons";
import { formatTime } from "../../utils/timeFormatter";
import { questions } from "../../data/questions"; // Para dibujar los marcadores
import styles from "./Video.module.css";

interface VideoControlsProps {
  currentTime: number;
  duration: number;
  togglePlay: () => void;
  isPaused: boolean;
  toggleMute?: () => void;
  handleProgressChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  volume?: number;
  isMuted?: boolean;
  handleVolumeChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFullScreenToggle?: () => void;
  // Opcional: si quieres permitir clic en los marcadores
  onMarkerClick?: (time: number) => void;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  currentTime,
  duration,
  togglePlay,
  isPaused,
  toggleMute,
  handleProgressChange,
  volume = 50,
  isMuted = false,
  handleVolumeChange,
  onFullScreenToggle,
  onMarkerClick,
}) => {
  // Maneja el clic en los marcadores (opcional)
  const handleMarkerClick = (time: number) => {
    if (onMarkerClick) {
      onMarkerClick(time);
    }
  };

  return (
    <div className={styles.vcContainer}>
      {/* Grupo Izquierdo (Play/Pause) */}
      <div className={styles.vcLeftGroup}>
        <button onClick={togglePlay} className={styles.vcIconButton}>
          {isPaused ? (
            <FontAwesomeIcon icon={faPlay} />
          ) : (
            <FontAwesomeIcon icon={faPause} />
          )}
        </button>
      </div>

      {/* Grupo Central: Barra de progreso + marcadores */}
      <div className={styles.vcCenterGroup}>
        <div className={styles.vcProgressContainer}>
          {/* Barra de progreso */}
          <input
            type="range"
            min="0"
            max={duration}
            step="0.1"
            value={currentTime}
            onChange={handleProgressChange}
            className={styles.vcProgressBar}
          />

          {/* Marcadores de preguntas */}
          {questions.map((q, index) => {
            const leftPercent = (q.time / duration) * 100;
            return (
              <div
                key={index}
                className={styles.vcMarker}
                style={{ left: leftPercent + "%" }}
                onClick={() => handleMarkerClick(q.time)}
              />
            );
          })}
        </div>
      </div>

      {/* Grupo Derecho: volumen, tiempo, fullscreen */}
      <div className={styles.vcRightGroup}>
        {toggleMute && handleVolumeChange && (
          <div className={styles.vcVolumeContainer}>
            <button onClick={toggleMute} className={styles.vcIconButton}>
              {isMuted ? (
                <FontAwesomeIcon icon={faVolumeMute} />
              ) : (
                <FontAwesomeIcon icon={faVolumeUp} />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={volume}
              onChange={handleVolumeChange}
              className={styles.vcVolumeSlider}
            />
          </div>
        )}

        <span className={styles.vcTimeText}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

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
