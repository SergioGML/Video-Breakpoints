// pages/Home.tsx
import React, { useState } from "react";
import VideoComponent from "../components/VideoPlayer/VideoComponent";
import QuestionModal from "../components/QuestionModal/ModalComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareFull } from "@fortawesome/free-regular-svg-icons";

const Home: React.FC = () => {
  const [isSimulatedFullScreen, setIsSimulatedFullScreen] = useState(false);

  const toggleSimulatedFullScreen = () => {
    setIsSimulatedFullScreen((prev) => !prev);
  };

  return (
    <div
      className={
        isSimulatedFullScreen
          ? "fixed inset-0 flex items-center justify-center bg-black"
          : "flex min-h-screen flex-col items-center justify-center bg-gray-100"
      }
    >
      <div
        className={`relative flex flex-col items-center justify-center ${
          isSimulatedFullScreen ? "h-[100vh] w-[100vw]" : ""
        }`}
      >
        <h1
          className={`mb-4 text-2xl font-bold ${
            isSimulatedFullScreen ? "text-white" : ""
          }`}
        >
          YouTube
        </h1>

        <VideoComponent videoId="KPcHiQ0wpBw" isFullScreen={isSimulatedFullScreen} />
        <QuestionModal />

        <button
          onClick={toggleSimulatedFullScreen}
          className="absolute bottom-4 right-4 z-50 py-3 px-4 text-lg bg-gray-800 text-white cursor-pointer rounded hover:transform hover:scale-110"
        >
          <FontAwesomeIcon
            icon={faSquareFull}
            className={isSimulatedFullScreen ? "p-5 px-6 text-2xl" : ""}
          />
        </button>
      </div>
    </div>
  );
};

export default Home;
