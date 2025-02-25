import  { useRef, useEffect, useState } from "react";
import  { YouTubeEvent, YouTubePlayer } from "react-youtube";
import { questions } from "../data/questions";
import { useHomeContext } from "../context/HomeContext";


export const UseVideoPlayer = () => {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { handleQuestionTrigger, shouldResume, setShouldResume, onResume} = useHomeContext();

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

  // Monitorear el tiempo de reproducción para pausar en breakpoints
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && !isPaused) {
        const time = playerRef.current.getCurrentTime();
        setCurrentTime(time);

        // Revisar si el tiempo coincide con un breakpoint
        const questionIndex = questions.findIndex(
          (q) => Math.floor(q.time) === Math.floor(time),
        );
        if (questionIndex !== -1) {
          playerRef.current.pauseVideo();
          setIsPaused(true);
          handleQuestionTrigger(questionIndex);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Verifica si debe reanudar el vídeo cuando la respuesta es correcta
  useEffect(() => {
    if (shouldResume && playerRef.current) {
      playerRef.current.playVideo();
      setIsPaused(false);
      onResume(); // Resetea onResume en el contexto
    }
  }, [shouldResume]);
  
  return { playerRef, opts, onReady };
};


