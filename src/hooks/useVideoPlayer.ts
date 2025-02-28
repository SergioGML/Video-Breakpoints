import { useRef, useEffect, useState } from "react";
import { YouTubeEvent, YouTubePlayer } from "react-youtube";
import { questions } from "../data/questions";
import { useHomeContext } from "../context/HomeContext";

export const UseVideoPlayer = () => { //Creo y exporto un función como Hook personalizado para manejar el vídeo mejor
  const playerRef = useRef<YouTubePlayer | null>(null); //En useRef guardo el objeto que controla el vídeo
  const [currentTime, setCurrentTime] = useState(0); //EL vídeo comienza en 0, desde el principio
  const [isPaused, setIsPaused] = useState(false); //El vídeo no comienza en pausa
  const { handleQuestionTrigger, shouldResume, onResume, answeredQuestions } = useHomeContext(); //Uso estas propiedades del contexto.

  // Con este useRef evito disparar repetidamente el modal de la pregunta mientras se verifica el tiempo
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

  const onReady = (event: YouTubeEvent) => { //Se llama a esta función cuando el reproductor está listo para usarse. EL evento tiene información del reproductor.
    playerRef.current = event.target; //Guardo el objeto reproductor de event.target en playerRef, asi se puede usar para controlar el vídeo (pausar, etc)
  };

  useEffect(() => { //Función que se ejecuta cuando el componente se ha renderizado
    const interval = setInterval(() => {
      if (playerRef.current && !isPaused) { //Se verifica si el reproductor está disponible y además no está pausado
        const time = playerRef.current.getCurrentTime(); //Se llama a la función para obtener el tiempo actual en el que se encuentra el vídeo.
        setCurrentTime(time); //Actualiza el estado de currentTIme con ese valor obtenido (time)

        const unansweredQuestions = questions // Se obtiene el siguiente breakpoint pendiente
          .map((q, index) => ({ ...q, index })) //Tomo la lista de preguntas y para cada una le añado un objeto que contiene todos los datos de la pregunta.
          .filter(({ index }) => !answeredQuestions.includes(index))//Filtro a aquellas preguntas que no estén ya contestadas.
          .sort((a, b) => a.time - b.time); //Ordeno las preguntas por propiedad time de menor a mayor.

        if (unansweredQuestions.length > 0) { //Compruebo si hay pregutnas pendientes (si la lista no está vacía).
          const nextUnanswered = unansweredQuestions[0]; //Selecciono la próxima pregunta pendiente.
          const tolerance = 0.5; // Añado un margen de 0.5 segundos para evitar problemas al comparar tiempos.

          // Si el tiempo es mayor o igual al breakpoint menos el margen (tolerancia).
          if (time >= nextUnanswered.time - tolerance) {
            if (!modalTriggeredRef.current) { //Y si el modal no se ha ejecutado ya.
              // Fuerzo el seek al breakpoint y disparamos el modal.
              playerRef.current.seekTo(nextUnanswered.time, true);
              modalTriggeredRef.current = true; //Marco que el modal ya está disparado para no repetirlo.
              playerRef.current.pauseVideo();//Se pausa el vídeo.
              setIsPaused(true); //Actualiza el estado del vídeo a pause.
              handleQuestionTrigger(nextUnanswered.index); //Se activa el modal de la pregunta y se le pasa el índice de pregunta a contestar.
            }
          }
        }
      }
    }, 1000); //Se ejecuta este código cada segundo.

    return () => clearInterval(interval);//Se limpia el temporizador para que no se siga ejecutando.
  }, [isPaused, answeredQuestions, handleQuestionTrigger]); //Este useEffect se ejecuta cada vez que cambian estos valores.

  // Reanudar el vídeo cuando se haya contestado la pregunta.
  useEffect(() => {
    if (shouldResume && playerRef.current) { //Si el vídeo debe reanudarse y el reproductor existe.
      playerRef.current.playVideo();//El reproductor continua reproduciendo el vídeo.
      setIsPaused(false); //Setea la pausa a falso para que el vídeo continue.
      onResume(); // Resetea la onResume en el contexto.
      // Reiniciamos para permitir disparar el modal en el siguiente breakpoint.
      modalTriggeredRef.current = false;
    }
  }, [shouldResume, onResume]); //Este useEffect se ejecuta cada vez que cambian estos valores.

  return { playerRef, opts, onReady }; //Devolvemos estos valores para que el componente que use este Hook tenga acceso a los mismos.
};
