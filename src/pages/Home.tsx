import React, { useState } from "react";
import VideoComponent from "../components/VideoPlayer/VideoComponent";
import Modal from "../components/QuestionModal/Modal";
import FinalModal from "../components/QuestionModal/FinalModal";
import styles from "../pages/Home.module.css";

const Home: React.FC = () => {
  const [isSimulatedFullScreen, setIsSimulatedFullScreen] = useState<boolean>(false);

  const toggleSimulatedFullScreen = (): void => {
    setIsSimulatedFullScreen((prev) => !prev);
  };

  const container = isSimulatedFullScreen
    ? styles.fullScreenContainer
    : styles.container;

  const videoContainer = isSimulatedFullScreen
    ? `${styles.videoContainer} ${styles.fullScreenVideoContainer}`
    : `${styles.videoContainer} ${styles.normalVideoContainer}`;

  return (
    <div className={container}>
      <div className={videoContainer}>
        <VideoComponent
          videoId="5m-R7XxFLCs"
          isFullScreen={isSimulatedFullScreen}
          onFullScreenToggle={toggleSimulatedFullScreen}
        />
        <Modal />
        <FinalModal />
      </div>
    </div>
  );
};

export default Home;


