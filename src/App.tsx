import { useState } from "react";
import VideoComponent from "./components/VideoPlayer/VideoComponent";
import Modal from "./components/QuestionModal/Modal";
import FinalModal from "./components/QuestionModal/FinalModal";
import styles from "./App.module.css";

//Punto de entrada de la aplicación, controla el estado de la pantalla completa simulada. renderiza el componente VideoComponent y los modales.

function App() {
  const [isSimulatedFullScreen, setIsSimulatedFullScreen] = useState<boolean>(false);
  
  //Función que cambia el estado de la pantalla completa simulada.
  const toggleSimulatedFullScreen = (): void => {
    setIsSimulatedFullScreen((prev) => !prev);
  };

  //Estilos del contenedor de la aplicación.
  const container = isSimulatedFullScreen
    ? styles.fullScreenContainer
    : styles.container;

  //Estilos del contenedor del video.
  const videoContainer = isSimulatedFullScreen
    ? `${styles.videoContainer} ${styles.fullScreenVideoContainer}`
    : `${styles.videoContainer} ${styles.normalVideoContainer}`;

  return (
    <div className={container}>
      <div className={videoContainer}>
        <VideoComponent
          videoId="rdZpiYkWC_E"
          isFullScreen={isSimulatedFullScreen}
          onFullScreenToggle={toggleSimulatedFullScreen}
        />
        <Modal />
        <FinalModal />
      </div>
    </div>
  );
}

export default App;
