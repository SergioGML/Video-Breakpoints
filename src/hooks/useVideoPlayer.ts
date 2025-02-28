// useVideoPlayer.ts
import { useRef, useEffect, useState } from "react";
import { YouTubeEvent, YouTubePlayer } from "react-youtube";
import { questions } from "../data/questions";
import { useHomeContext } from "../context/HomeContext";

export const UseVideoPlayer = () => {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { handleQuestionTrigger, shouldResume, setShouldResume, onResume, answeredQuestions } = useHomeContext();

  // Referencia para evitar disparar repetidamente el modal
  const modalTriggeredRef = useRef(false);

  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1,
      controls: 1,
      rel: 0,
      showinfo: 0,
    },
  };

  const onReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && !isPaused) {
        const time = playerRef.current.getCurrentTime();
        setCurrentTime(time);

        // Obtener el siguiente breakpoint pendiente
        const unansweredQuestions = questions
          .map((q, index) => ({ ...q, index }))
          .filter(({ index }) => !answeredQuestions.includes(index))
          .sort((a, b) => a.time - b.time);

        if (unansweredQuestions.length > 0) {
          const nextUnanswered = unansweredQuestions[0];
          const tolerance = 0.5; // margen de 0.5 segundos

          // Si el tiempo es mayor o igual al breakpoint menos el margen
          if (time >= nextUnanswered.time - tolerance) {
            if (!modalTriggeredRef.current) {
              // Forzamos el seek al breakpoint y disparamos el modal
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

  // Reanudar el vídeo cuando se haya contestado la pregunta
  useEffect(() => {
    if (shouldResume && playerRef.current) {
      playerRef.current.playVideo();
      setIsPaused(false);
      onResume(); // Resetea la bandera en el contexto
      // Reiniciamos la bandera para permitir disparar el modal en el siguiente breakpoint
      modalTriggeredRef.current = false;
    }
  }, [shouldResume, onResume]);

  return { playerRef, opts, onReady };
};
