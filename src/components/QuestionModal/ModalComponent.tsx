import React from "react";
import { questions } from "../../data/questions";
import { useHomeContext } from "../../context/HomeContext";

const QuestionModal: React.FC = () => {
  const {
    setIsCorrect,
    activeQuestion,
    setActiveQuestion,
    setShouldResume,
    isCorrect,
    answeredQuestions,
    setAnsweredQuestions,
  } = useHomeContext();

  const handleAnswer = (selectedAnswer: string) => {
    setIsCorrect(null);
    const correctAnswer = questions[activeQuestion!].correctAnswer;
    if (selectedAnswer === correctAnswer) {
      setIsCorrect(true);
      if (activeQuestion !== null && !answeredQuestions.includes(activeQuestion)) {
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
    setIsCorrect(null);
    if (activeQuestion !== null && !answeredQuestions.includes(activeQuestion)) {
      setAnsweredQuestions([...answeredQuestions, activeQuestion]);
    }
    setActiveQuestion(null);
    setShouldResume(true);
  };

  if (activeQuestion === null) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(5px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 50,
      }}
    >
      <div className="rounded-lg bg-white p-6 text-center shadow-lg">
        {isCorrect === null ? (
          <>
            <h2 className="mb-4 text-xl font-bold">
              {questions[activeQuestion].question}
            </h2>
            <ul>
              {questions[activeQuestion].options.map((option, index) => (
                <li key={index} className="mb-2">
                  <button
                    onClick={() => handleAnswer(option)}
                    className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : isCorrect ? (
          <h2 className="text-2xl font-bold text-green-500">✅ ¡Correcto!</h2>
        ) : (
          <>
            <h2 className="mb-4 text-2xl font-bold text-red-500">❌ Incorrecto</h2>
            <p className="text-lg font-semibold">La respuesta correcta es:</p>
            <p className="text-lg font-bold text-blue-600">
              {questions[activeQuestion].correctAnswer}
            </p>
            <button
              onClick={handleCloseModal}
              className="mt-4 w-full rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Continuar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionModal;
