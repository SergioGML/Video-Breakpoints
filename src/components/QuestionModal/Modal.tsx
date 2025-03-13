import React from "react";
import { questions } from "../../data/questions";
import { useHomeContext } from "../../context/AppContext";
import styles from "../../components/QuestionModal/Modals.module.css";

//Componente que renderiza el modal de preguntas.

const Modal: React.FC = () => {
  const { //Se obtienen las propiedades del contexto.
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

  const handleAnswer = (selectedAnswer: string) => { //Función que se ejecuta al responder una pregunta.
    if (activeQuestion === null) return; //Si no hay pregunta activa, no hace nada.
    const correctAnswer = questions[activeQuestion].correctAnswer; //Se obtiene la respuesta correcta de la pregunta.
    const isAnswerCorrect = selectedAnswer === correctAnswer; //Se compara la respuesta seleccionada con la respuesta correcta.

    // Actualizamos questionAnswers en la posición de la pregunta actual
    const updatedAnswers = [...questionAnswers]; //Se crea una copia de questionAnswers.
    updatedAnswers[activeQuestion] = isAnswerCorrect; //Se actualiza la respuesta de la pregunta actual.
    setQuestionAnswers(updatedAnswers); 
    setIsCorrect(null); //Se reinicia el estado de isCorrect.

    if (isAnswerCorrect) {
      setIsCorrect(true); //Si la respuesta es correcta, se actualiza el estado de isCorrect a true.
      if (!answeredQuestions.includes(activeQuestion)) { //Si la pregunta no ha sido respondida, se agrega al array de preguntas respondidas.
        setAnsweredQuestions([...answeredQuestions, activeQuestion]); //Seteamos el array de preguntas respondidas.
      }
      setTimeout(() => { //Se ejecuta un timeout de 2 sg para cerrar el modal y continuar con el video.
        setActiveQuestion(null);
        setShouldResume(true);
      }, 2000);
    } else {
      setIsCorrect(false); //Si la respuesta es incorrecta, se actualiza el estado de isCorrect a false.
    }
  };

  const handleCloseModal = () => { //Función que se ejecuta al cerrar el modal.
    if (activeQuestion === null) return; //Si no hay pregunta activa, no hace nada.
    setIsCorrect(null);
    if (!answeredQuestions.includes(activeQuestion)) { //Si la pregunta no ha sido respondida, se agrega al array de preguntas respondidas.
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
