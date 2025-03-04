import { useRef, useEffect, useState } from "react";
import { YouTubeEvent, YouTubePlayer } from "react-youtube";
import { questions } from "../data/questions";
import { useHomeContext } from "../context/HomeContext";

export const UseVideoPlayer = (isFullScreen: boolean) => {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { handleQuestionTrigger, shouldResume, onResume, answeredQuestions } = useHomeContext();
  const modalTriggeredRef = useRef(false);

  // Definimos las opciones del reproductor.
  // Si isFullScreen es true, usamos window.innerWidth e innerHeight para que el vídeo ocupe toda la ventana.
  const opts = {
    height: isFullScreen ? window.innerHeight.toString() : "390",
    width: isFullScreen ? window.innerWidth.toString() : "640",
    playerVars: {
      autoplay: 1,
      controls: 1,
      rel: 0,
      showinfo: 0,
      fs: 0, // Desactiva el botón nativo de pantalla completa.
    },
  };

  // onReady se ejecuta cuando el reproductor está listo.
  const onReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
  };

  // useEffect para monitorear el tiempo del vídeo y disparar el modal en los breakpoints.
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && !isPaused) {
        const time = playerRef.current.getCurrentTime();
        setCurrentTime(time);

        const unansweredQuestions = questions
          .map((q, index) => ({ ...q, index }))
          .filter(({ index }) => !answeredQuestions.includes(index))
          .sort((a, b) => a.time - b.time);

        if (unansweredQuestions.length > 0) {
          const nextUnanswered = unansweredQuestions[0];
          const tolerance = 0.5; // margen de 0.5 segundos

          if (time >= nextUnanswered.time - tolerance) {
            if (!modalTriggeredRef.current) {
              playerRef.current.seekTo(nextUnanswered.time, true);
              modalTriggeredRef.current = true;
              playerRef.current.pauseVideo();
              setIsPaused(true);
              handleQuestionTrigger(nextUnanswered.index);
            }
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, answeredQuestions, handleQuestionTrigger]);

  // useEffect para reanudar el vídeo cuando se ha contestado la pregunta.
  useEffect(() => {
    if (shouldResume && playerRef.current) {
      playerRef.current.playVideo();
      setIsPaused(false);
      onResume();
      modalTriggeredRef.current = false;
    }
  }, [shouldResume, onResume]);

  return { playerRef, opts, onReady };
};
