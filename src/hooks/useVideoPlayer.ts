import { useRef, useEffect, useState, useCallback } from "react";
import { YouTubeEvent, YouTubePlayer } from "react-youtube";
import { questions } from "../data/questions";
import { useHomeContext } from "../context/HomeContext";

enum PlayerState { //Estados posibles del reproductor de YouTube
  ENDED = 0, //El vídeo ha terminado.
  PLAYING = 1, //El vídeo se está reproduciendo.
  PAUSED = 2, //El vídeo está pausado.
  BUFFERING = 3, //El vídeo se está cargando.
}

export const UseVideoPlayer = (isFullScreen: boolean) => {
  //Hook personalizado para el reproductor de YouTube
  const playerRef = useRef<YouTubePlayer | null>(null); //Referencia al reproductor de YouTube
  const [currentTime, setCurrentTime] = useState(0); //Estado para el tiempo actual del vídeo
  const [isPaused, setIsPaused] = useState(false); //Estado para saber si el vídeo está pausado
  const [duration, setDuration] = useState(0); //Estado para la duración del vídeo

  const {
    //Extrae los valores del contexto
    activeQuestion,
    handleQuestionTrigger,
    shouldResume,
    onResume,
    answeredQuestions,
    setShowFinalModal,
    questionAnswers,
  } = useHomeContext();

  const modalTriggeredRef = useRef(false); //Referencia para saber si se ha activado el modal. Ayuda a saber si se ha activado ya un modal para no disparar otra vez una pregunta.
  const [volume, setVolume] = useState(50); //Estado para el volumen del vídeo
  const [isMuted, setIsMuted] = useState(false); //Estado para saber si el vídeo está muteado

  const opts = {
    //Opciones del reproductor de YouTube
    height: isFullScreen ? window.innerHeight.toString() : "423", //Si está en pantalla completa, la altura es la altura de la ventana, si no, 423. Convertido a string para la API de Youtube.
    width: isFullScreen ? window.innerWidth.toString() : "752", //Si está en pantalla completa, el ancho es el ancho de la ventana, si no, 752. Convertido a string para la API de Youtube.
    playerVars: {
      //Variables del reproductor
      autoplay: 1,
      controls: 0,
      rel: 0,
      showinfo: 0,
      fs: 0, // Deshabilita el botón de pantalla completa
      disablekb: 1, // Deshabilita atajos de teclado nativos de YouTube
      iv_load_policy: 3, // Deshabilita anotaciones
    },
  };

  const TOLERANCE = 0.5; //Tolerancia para activar modal de preguntas. Compensa retrasos en la medición del tiempo.

  const onStateChange = useCallback(
    (event: any) => {
      //Callback para el cambio de estado del reproductor de YouTube. Comprueba si hay preguntas sin contestar y si el vídeo ha terminado.
      if (event.data === PlayerState.PLAYING && activeQuestion !== null) {
        //Si el vídeo está reproduciendo y hay una pregunta activa. event.data es la propiedad que la API utiliza para reportar el estado del reproductor.
        event.target.pauseVideo(); //Pausa el vídeo
        setIsPaused(true); //Cambia el estado de pausa a true
        return;
      }

      if (event.data === PlayerState.ENDED) {
        // Si el vídeo terminó, comprobamos si todas las preguntas fueron contestadas
        const allAnswered = questionAnswers.every((ans) => ans !== null); //Comprueba si todas las respuestas son distintas de null
        if (allAnswered) {
          // Si todas las respuestas son distintas de null, se muestra el modal final
          setShowFinalModal(true);
        } else {
          // Buscamos la siguiente pregunta pendiente según el tiempo
          const unanswered = questions // Filtra las preguntas que no han sido contestadas
            .map((q, index) => ({ ...q, index })) // Añade el índice de la pregunta
            .filter(({ index }) => questionAnswers[index] === null) // Filtra las preguntas que no han sido contestadas
            .sort((a, b) => a.time - b.time); // Ordena las preguntas por tiempo
          const unansweredAfterCurrent = unanswered.filter(
            (q) => q.time > currentTime,
          ); // Filtra las preguntas que no han sido contestadas y están después del tiempo actual
          let nextUnanswered; // Siguiente pregunta sin contestar
          if (unansweredAfterCurrent.length > 0) {
            // Si hay preguntas sin contestar después del tiempo actual
            nextUnanswered = unansweredAfterCurrent[0]; // La siguiente pregunta sin contestar es la primera después del tiempo actual
          } else if (unanswered.length > 0) {
            // Si no hay preguntas sin contestar después del tiempo actual
            nextUnanswered = unanswered[0];
          }
          if (nextUnanswered && playerRef.current) {
            // Si hay una pregunta sin contestar y el reproductor de YouTube existe
            playerRef.current.seekTo(nextUnanswered.time, true); // Se mueve al tiempo de la siguiente pregunta sin contestar
            modalTriggeredRef.current = false; // Se reinicia la referencia del modal
          }
        }
      }
    },
    [activeQuestion, currentTime, questionAnswers, setShowFinalModal],
  ); // Se ejecuta cada vez que cambia activeQuestion, currentTime, questionAnswers y setShowFinalModal

  const onReady = (event: YouTubeEvent) => {
    //Función para cuando el reproductor de YouTube está listo
    playerRef.current = event.target; //Asigna el reproductor de YouTube a la referencia
    const videoDuration = event.target.getDuration(); //Obtiene la duración del vídeo
    setDuration(videoDuration); //Asigna la duración del vídeo al estado
    event.target.setVolume(volume); //Asigna el volumen al reproductor de YouTube
  };

  useEffect(() => {
    //Efecto para controlar los breakpoints de las preguntas
    const interval = setInterval(() => {
      // Intervalo para controlar los breakpoints de las preguntas
      if (playerRef.current && !isPaused) {
        // Si el reproductor de YouTube existe y no está pausado
        const time = playerRef.current.getCurrentTime(); // Obtiene el tiempo actual del vídeo
        setCurrentTime(time); // Asigna el tiempo actual al estado

        const unanswered = questions // Filtra las preguntas que no han sido contestadas
          .map((q, index) => ({ ...q, index })) // Añade el índice de la pregunta
          .filter(({ index }) => questionAnswers[index] === null) // Filtra las preguntas que no han sido contestadas
          .sort((a, b) => a.time - b.time); // Ordena las preguntas por tiempo

        if (unanswered.length > 0) {
          // Si hay preguntas sin contestar
          const nextUnanswered = unanswered[0]; // Siguiente pregunta sin contestar
          if (time >= nextUnanswered.time - TOLERANCE) {
            // Si el tiempo actual es mayor o igual al tiempo de la siguiente pregunta sin contestar menos la tolerancia
            if (!modalTriggeredRef.current) {
              // Si no se ha activado el modal
              playerRef.current.seekTo(nextUnanswered.time, true); // Se mueve al tiempo de la siguiente pregunta sin contestar
              modalTriggeredRef.current = true; // Se activa el modal
              playerRef.current.pauseVideo(); // Pausa el vídeo
              setIsPaused(true); // Cambia el estado de pausa a true
              handleQuestionTrigger(nextUnanswered.index); // Activa la pregunta
            }
          }
        }
      }
    }, 100); // Se ejecuta cada 0.1 segundos para mayor precisión.

    return () => clearInterval(interval); // Limpia el intervalo.
  }, [isPaused, questionAnswers, handleQuestionTrigger]); // Se ejecuta cada vez que cambia isPaused, questionAnswers y handleQuestionTrigger.

  useEffect(() => {
    // Reanuda el vídeo cuando se haya contestado la pregunta.
    if (shouldResume && playerRef.current) {
      //Si shouldResume es true y el reproductor de YouTube existe.
      playerRef.current.playVideo(); //Reproduce el vídeo.
      setIsPaused(false); //Cambia el estado de pausa a false.
      onResume(); //Reanuda el vídeo.
      modalTriggeredRef.current = false; //Reinicia la referencia del modal.
    }
  }, [shouldResume, onResume]); //Se ejecuta cada vez que cambia shouldResume y onResume.

  const togglePlay = () => { //Función para pausar o reproducir el vídeo SOLO si no hay pregunta activa.
    if (activeQuestion !== null) return; //Si hay una pregunta activa, salimos de la función sin hacer nada.

    if (isPaused) { //Si el vídeo está pausado.
      playerRef.current?.playVideo(); //Reproduce el vídeo.
      setIsPaused(false); //Cambia el estado de pausa a false.
    } else { //Si el vídeo no está pausado.
      playerRef.current?.pauseVideo(); //Pausa el vídeo.
      setIsPaused(true); //Cambia el estado de pausa a true.
    }
  };

  const toggleMute = () => { //Función para mutear o desmutear el vídeo.
    if (!playerRef.current) return; //Si el reproductor de YouTube no existe, salimos de la función sin hacer nada.
    if (isMuted) { //Si el vídeo está muteado.
      playerRef.current.unMute(); //Desmutea el vídeo.
      setIsMuted(false); //Cambia el estado de muteado a false.
    } else {
      playerRef.current.mute(); //Mutea el vídeo.
      setIsMuted(true); //Cambia el estado de muteado a true.
    }
  };

  const handleProgressClick = ( //Función para cambiar el tiempo del vídeo al hacer click en la barra de progreso.
    event: React.MouseEvent<HTMLDivElement, MouseEvent>, //Evento del click en la barra de progreso <div>.
  ) => {
    if (!playerRef.current || duration === 0) return; //Si el reproductor de YouTube no existe o la duración es 0, salimos de la función sin hacer nada.
    const rect = ( //Obtiene el rectángulo de la barra de progreso.
      event.currentTarget as HTMLDivElement  //Convierte el evento actual a un <div>.
    ).getBoundingClientRect(); //Obtiene el rectángulo de la barra de progreso.
    const clickX = event.clientX - rect.left; //Obtiene la posición del click en X. event.clientX es la posición del click en X y rect.left es la posición del borde izquierdo del rectángulo.
    const newTime = (clickX / rect.width) * duration; //Calcula el nuevo tiempo. clickX dividido por el ancho del rectángulo multiplicado por la duración del vídeo.
    playerRef.current.seekTo(newTime, true); //Mueve el vídeo al nuevo tiempo. true indica que el cambio debe ser inmediato y exacto.
    setCurrentTime(newTime); //Cambia el estado de tiempo actual al nuevo tiempo.
  };

  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => { //Función para cambiar el tiempo del vídeo al cambiar el valor del input de la barra de progreso.
    if (!playerRef.current || duration === 0) return; //Si el reproductor de YouTube no existe o la duración es 0, salimos de la función sin hacer nada.
    const newTime = parseFloat(event.target.value); //Obtiene el nuevo tiempo. Convierte el valor del input a un número decimal.
    playerRef.current.seekTo(newTime, true); //Mueve el vídeo al nuevo tiempo. true indica que el cambio debe ser inmediato y exacto.
    setCurrentTime(newTime); //Cambia el estado de tiempo actual al nuevo tiempo.
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => { //Función para cambiar el volumen del vídeo al cambiar el valor del input del volumen.
    if (!playerRef.current) return; //Si el reproductor de YouTube no existe, salimos de la función sin hacer nada.
    const newVolume = parseFloat(event.target.value); //Obtiene el nuevo volumen. Convierte el valor del input a un número decimal.
    playerRef.current.setVolume(newVolume); //Cambia el volumen del reproductor de YouTube al nuevo volumen.
    setVolume(newVolume); //Cambia el estado de volumen al nuevo volumen.
    if (newVolume > 0) { //Si el nuevo volumen es mayor que 0.
      setIsMuted(false); //Cambia el estado de muteado a false.
    } else {
      setIsMuted(true); //Cambia el estado de muteado a true.
    }
  };

  return {
    playerRef,
    opts,
    onReady,
    onStateChange,
    currentTime,
    duration,
    togglePlay,
    isPaused,
    toggleMute,
    handleProgressClick,
    handleProgressChange,
    volume,
    isMuted,
    handleVolumeChange,
  };
};
