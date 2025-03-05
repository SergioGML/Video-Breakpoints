import { useRef, useEffect, useState } from "react";
import { YouTubeEvent, YouTubePlayer } from "react-youtube";
import { questions } from "../data/questions";
import { useHomeContext } from "../context/HomeContext";
import React from "react";

export const UseVideoPlayer = (isFullScreen: boolean) => {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const { handleQuestionTrigger, shouldResume, onResume, answeredQuestions } = useHomeContext();
  const modalTriggeredRef = useRef(false);

  const opts = {
    height: isFullScreen ? window.innerHeight.toString() : "423",
    width: isFullScreen ? window.innerWidth.toString() : "752",
    playerVars: {
      autoplay: 1,
      controls: 0,
      rel: 0,
      showinfo: 0,
      fs: 0, // Desactiva el botón nativo de pantalla completa.
    },
  };

  const onReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
    const videoDuration = event.target.getDuration();
    setDuration(videoDuration);
  };

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

  useEffect(() => {
    if (shouldResume && playerRef.current) {
      playerRef.current.playVideo();
      setIsPaused(false);
      onResume();
      modalTriggeredRef.current = false;
    }
  }, [shouldResume, onResume]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPaused) {
      playerRef.current.playVideo();
      setIsPaused(false);
    } else {
      playerRef.current.pauseVideo();
      setIsPaused(true);
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (playerRef.current.isMuted()) {
      playerRef.current.unMute();
    } else {
      playerRef.current.mute();
    }
  };

  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!playerRef.current || duration === 0) return;
    const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    playerRef.current.seekTo(newTime, true);
    setCurrentTime(newTime);
  };

  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!playerRef.current || duration === 0) return;
    const newTime = parseFloat(event.target.value);
    playerRef.current.seekTo(newTime, true);
    setCurrentTime(newTime);
  };

  return {
    playerRef,
    opts,
    onReady,
    currentTime,
    duration,
    togglePlay,
    isPaused,
    toggleMute,
    handleProgressClick,
    handleProgressChange,
  };
};

