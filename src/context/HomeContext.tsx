// HomeContext.tsx
import React, { createContext, useContext, useState } from "react";

interface HomeContextProps {
  activeQuestion: number | null;
  setActiveQuestion: (value: number | null) => void;
  isCorrect: boolean | null;
  setIsCorrect: (value: boolean | null) => void;
  shouldResume: boolean;
  setShouldResume: (value: boolean) => void;
  answeredQuestions: number[];
  setAnsweredQuestions: (value: number[]) => void;
  handleQuestionTrigger: (questionIndex: number) => void;
  onResume: () => void;
}

const HomeContext = createContext<HomeContextProps>({} as HomeContextProps);

export const HomeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shouldResume, setShouldResume] = useState<boolean>(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);

  const handleQuestionTrigger = (questionIndex: number) => {
    if (answeredQuestions.includes(questionIndex)) return; //Si la pregunta fue contestada, no la incluimos de nuevo.
    setIsCorrect(null); // Reiniciamos el estado para la nueva pregunta.
    setActiveQuestion(questionIndex);
  };

  const onResume = () => {
    setShouldResume(false);
  };

  return (
    <HomeContext.Provider
      value={{
        activeQuestion,
        setActiveQuestion,
        isCorrect,
        setIsCorrect,
        shouldResume,
        setShouldResume,
        answeredQuestions,
        setAnsweredQuestions,
        handleQuestionTrigger,
        onResume,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

export const useHomeContext = () => useContext(HomeContext);
