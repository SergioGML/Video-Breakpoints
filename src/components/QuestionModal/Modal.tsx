import React from "react";
import { questions } from "../../data/questions";
import { useHomeContext } from "../../context/HomeContext";
import styles from "../../components/QuestionModal/Modals.module.css";

const Modal: React.FC = () => {
  const {
    setIsCorrect,
    activeQuestion,
    setActiveQuestion,
    setShouldResume,
    isCorrect,
    answeredQuestions,
    setAnsweredQuestions,
    questionAnswers,
    setQuestionAnswers,
  } = useHomeContext();

  const handleAnswer = (selectedAnswer: string) => {
    if (activeQuestion === null) return;
    const correctAnswer = questions[activeQuestion].correctAnswer;
    const isAnswerCorrect = selectedAnswer === correctAnswer;

    // Actualizamos questionAnswers en la posición de la pregunta actual
    const updatedAnswers = [...questionAnswers];
    updatedAnswers[activeQuestion] = isAnswerCorrect;
    setQuestionAnswers(updatedAnswers);

    setIsCorrect(null);
    if (isAnswerCorrect) {
      setIsCorrect(true);
      if (!answeredQuestions.includes(activeQuestion)) {
        setAnsweredQuestions([...answeredQuestions, activeQuestion]);
      }
      setTimeout(() => {
        setActiveQuestion(null);
        setShouldResume(true);
      }, 2000);
    } else {
      setIsCorrect(false);
    }
  };

  const handleCloseModal = () => {
    if (activeQuestion === null) return;
    setIsCorrect(null);
    if (!answeredQuestions.includes(activeQuestion)) {
      setAnsweredQuestions([...answeredQuestions, activeQuestion]);
    }
    setActiveQuestion(null);
    setShouldResume(true);
  };

  if (activeQuestion === null) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {isCorrect === null && (
          <>
            <h2 className={styles.questionTitle}>
              {questions[activeQuestion].question}
            </h2>
            <ul className={styles.optionsList}>
              {questions[activeQuestion].options.map((option, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleAnswer(option)}
                    className={`${styles.button} ${styles.answerButton}`}
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
        {isCorrect === true && (
          <h2 className={styles.correctText}>✅ ¡Correcto!</h2>
        )}
        {isCorrect === false && (
          <>
            <h2 className={styles.incorrectText}>❌ Incorrecto</h2>
            <p className={styles.answerText}>La respuesta correcta es:</p>
            <p className={styles.correctAnswer}>
              {questions[activeQuestion].correctAnswer}
            </p>
            <button
              onClick={handleCloseModal}
              className={`${styles.button} ${styles.continueButton}`}
            >
              Continuar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;
