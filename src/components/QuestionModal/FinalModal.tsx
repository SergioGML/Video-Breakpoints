import React from "react";
import { useHomeContext } from "../../context/AppContext";
import { questions } from "../../data/questions";
import styles from "../../components/QuestionModal/Modals.module.css";

//Componente que renderiza el modal final.

const FinalModal: React.FC = () => {
  const { showFinalModal, setShowFinalModal, questionAnswers } = useHomeContext(); //Se obtienen las propiedades del contexto.

  if (!showFinalModal) return null; //Si showFinalModal es false, no renderiza nada.

  const total = questions.length; //Se obtiene la cantidad total de preguntas.
  const correctCount = questionAnswers.filter((ans) => ans === true).length; //Se filtran las respuestas correctas y obtiene la longitud del array resultante.

  const handleClose = () => { //Función que se ejecuta al cerrar el modal.
    setShowFinalModal(false);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>¡Has terminado el vídeo!</h2>
        <p className={styles.text}>
          Has acertado <strong>{correctCount}</strong> de{" "}
          <strong>{total}</strong> preguntas.
        </p>
        <button onClick={handleClose} className={styles.closeButton}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default FinalModal;
