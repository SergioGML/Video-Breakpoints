import { useState } from "react";
import VideoPlayer from "../components/VideoPlayer/VideoPlayer.Component";
import QuestionModal from "../components/QuestionModal/QuestionModalComponent";

const Home = () => {
  // Estado para controlar si estamos en modo pantalla completa simulado.
  const [isSimulatedFullScreen, setIsSimulatedFullScreen] = useState(false);

  // Alterna el modo pantalla completa simulado.
  const toggleSimulatedFullScreen = () => {
    setIsSimulatedFullScreen((prev) => !prev);
  };

  return (
    <div
      // Si está activo, el contenedor se expande para ocupar toda la ventana.
      className={`relative flex flex-col items-center justify-center ${
        isSimulatedFullScreen
          ? "fixed top-0 left-0 w-screen h-screen bg-black"
          : "min-h-screen bg-gray-100"
      }`}
    >
      <h1
        className={`mb-4 text-2xl font-bold ${
          isSimulatedFullScreen ? "text-white" : ""
        }`}
      >
        YouTube
      </h1>
      {/* Pasamos isSimulatedFullScreen como prop para que el reproductor use dimensiones dinámicas */}
      <VideoPlayer videoId="KPcHiQ0wpBw" isFullScreen={isSimulatedFullScreen} />
      <QuestionModal />
      {/* Botón personalizado para alternar pantalla completa simulado */}
      <div className="relative w-full max-w-[640px]">
        {/* Aquí se coloca el reproductor */}
        {/* Botón sobre el reproductor */}
        <button
          onClick={toggleSimulatedFullScreen}
          className="absolute bottom-4 right-4 z-50 p-2 bg-gray-800 text-white rounded"
        >
          {isSimulatedFullScreen ? "Salir Pantalla Completa" : "Pantalla Completa"}
        </button>
    </div>
    </div>
  );
};

export default Home;

