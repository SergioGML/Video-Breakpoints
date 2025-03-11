import React from "react";
import { useHomeContext } from "../../context/HomeContext";
import { questions } from "../../data/questions";
import styles from "../../components/QuestionModal/Modals.module.css";

const FinalModal: React.FC = () => {
  const { showFinalModal, setShowFinalModal, questionAnswers } = useHomeContext();

  if (!showFinalModal) return null;

  const total = questions.length;
  const correctCount = questionAnswers.filter((ans) => ans === true).length;

  const handleClose = () => {
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
