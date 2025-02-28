import React, { createContext, useContext, useState } from "react";

interface HomeContextProps {
  activeQuestion: number | null; // Guarda el índice de la pregunta activa. Si es null, no hay pregunta visible.
  setActiveQuestion: (value: number | null) => void; // Función para actualizar activeQuestion.
  isCorrect: boolean | null; // Indica si la respuesta actual es correcta (true), incorrecta (false) o aún no se ha respondido (null).
  setIsCorrect: (value: boolean | null) => void; // Función para actualizar isCorrect.
  shouldResume: boolean; // Indica si el vídeo debe reanudarse (true) o no (false).
  setShouldResume: (value: boolean) => void; // Función para actualizar shouldResume.
  answeredQuestions: number[]; // Array que guarda los índices de las preguntas YA contestadas.
  setAnsweredQuestions: (value: number[]) => void; // Función para actualizar answeredQuestions.
  handleQuestionTrigger: (questionIndex: number) => void; // Función que activa el modal de pregunta para un índice recibida.
  onResume: () => void; // Función que reinicia shouldResume a false, indicando que el vídeo se reanudó.
}

//Creamos el contexto HomeContext con la forma definida de la interfaz HomeContextProps
const HomeContext = createContext<HomeContextProps>({} as HomeContextProps); //Inicialmente es un objeto vacío, pero indicamos a TS que lo trate con la forma de HomeContextProps.

//Creamos y exportamos el componente llamado HomeProvider
export const HomeProvider: React.FC<{ children: React.ReactNode }> = ({ //Indicamos que HomeProvider es un componente en forma de función y no de clase.
  children, //Recibe la propiedad children, que son todos los componentes que se incluyan dentro de él.
}) => {
  //Definimos variables reactivas
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shouldResume, setShouldResume] = useState<boolean>(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);

  const handleQuestionTrigger = (questionIndex: number) => { //La función recibe una parámetro llamado questionIndex.Es un número que indica que pregunta se debe activar.
    if (answeredQuestions.includes(questionIndex)) return; //Si la pregunta fue contestada, no la incluimos de nuevo.
    setIsCorrect(null); // Reiniciamos el estado para la nueva pregunta.Null indica que no se ha respondido la nueva pregunta y limpia la respuesta anterior.
    setActiveQuestion(questionIndex); //Función que establece la pregunta activa. Recibe questionIndex para saber que pregunta mostrar.
  };

  const onResume = () => {
    setShouldResume(false); //Indicamos que una vez el vídeo se ha reanudado ya no necesita volver a reanudarse.
  };

  return (
    <HomeContext.Provider //Retornamos todas las variables y funciones que queremos compartir para que los componentes puedan acceder a estos valores.
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
    </HomeContext.Provider> //Los componentes dentro de el HomeProvider pueden usar los valores definidos en este contexto.
  );
};

export const useHomeContext = () => useContext(HomeContext);
