import React, { createContext, useContext, useState } from "react";

interface HomeContextProps {
  activeQuestion: number | null;
  isCorrect: boolean | null;
  answeredQuestions: number[];
  shouldResume: boolean;
  isPlay: boolean;
  volume: number;
  isMuted: boolean;
  time: number;
  setActiveQuestion: (value: number | null) => void;
  setIsCorrect: (value: boolean | null) => void;
  setAnsweredQuestions: (value: number[]) => void;
  setShouldResume: (value: boolean) => void;
  setIsPlay: (value: boolean) => void;
  setVolume: (value: number) => void;
  setIsMuted: (value: boolean) => void;
  setTime: (value: number) => void;
  handleQuestionTrigger: (questionIndex: number) => void;
  onResume: () => void;
}

const HomeContext = createContext<HomeContextProps>({} as HomeContextProps);

export const HomeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shouldResume, setShouldResume] = useState<boolean>(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [isPlay, setIsPlay] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [time, setTime] = useState(0);

  const handleQuestionTrigger = (questionIndex: number) => {
    if (answeredQuestions.includes(questionIndex)) return;
    setIsCorrect(null);
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
        isPlay,
        setIsPlay,
        volume,
        setVolume,
        isMuted,
        setIsMuted,
        time,
        setTime,
        handleQuestionTrigger,
        onResume,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

export const useHomeContext = () => useContext(HomeContext);
