import { createContext, useContext, useState } from "react";

//Estructura del contexto
interface HomeContextType {
  shouldResume: boolean;
  activeQuestion: number | null;
  isCorrect: boolean | null;
  setShouldResume: (value: boolean) => void;
  setActiveQuestion: (value: number | null) => void;
  setIsCorrect: (value: boolean | null) => void;

  handleQuestionTrigger: (questionIndex: number) => void;
  onResume: () => void;
}

//Contexto creado
const HomeContext = createContext<HomeContextType | undefined>(undefined);

//Hook useHomeContext
export const useHomeContext = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error("useHomeContext debe usarse dentro de HomeProvider");
  }
  return context;
};

//Provider del Contexto
export const HomeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shouldResume, setShouldResume] = useState(false);

  
  const handleQuestionTrigger = (questionIndex: number) => {
    setIsCorrect(null);
    setActiveQuestion(questionIndex);
  };

  const onResume = () =>{
    setShouldResume(false);
  }
  return (
    <HomeContext.Provider
    value=
    {{
      activeQuestion,
      setActiveQuestion,
      isCorrect,
      setIsCorrect,
      shouldResume,
      setShouldResume,

      handleQuestionTrigger,
      onResume,
    }}
    >
        {children}
    </HomeContext.Provider>
  );
};
