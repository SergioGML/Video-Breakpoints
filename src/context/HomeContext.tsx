import { createContext, useContext, useState } from "react";

//Estructura del contexto, contiene todos los valores y funciones que serán accesibles por los componentes que lo utilicen.
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

//Contexto creado, inicializa en undefined para poder manejar el caso de contexto no proporcionado aún.
const HomeContext = createContext<HomeContextType | undefined>(undefined);

//Hook personalizado useHomeContext para el contexto HomeContext.
export const useHomeContext = () => {
  const context = useContext(HomeContext);
  //Si no está envuelto con el Provider (contexto no disponible) lanzamos un error.
  if (!context) {
    throw new Error("useHomeContext debe usarse dentro de HomeProvider");
  }
  return context;
};

//Definición del Provider del contexto. Se definen los estados de la pregunta, si es correcta y si se debe reanudar el vídeo.
export const HomeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shouldResume, setShouldResume] = useState(false);

//Función para manejar las preguntas y setear de nuevo la respuesta a null
  const handleQuestionTrigger = (questionIndex: number) => {
    setIsCorrect(null);
    //Se establece la pregunta activa al índice de la nueva pregunta.
    setActiveQuestion(questionIndex);
  };

//Función que actualiza shouldResume a false para no reanudar la actividad.
  const onResume = () =>{
    setShouldResume(false);
  }

  return (
    //Envolvemos los children con el Provider del Contexto = acceso de los componentes hijos a todos estos valores y funciones.
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
