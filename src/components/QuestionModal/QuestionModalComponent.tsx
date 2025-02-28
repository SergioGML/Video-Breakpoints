import { questions } from "../../data/questions";
import { useHomeContext } from "../../context/HomeContext";

//Creamos el componente
const QuestionModal = () => {
  const { //Destructuramos el contexto las siguientes variables y funciones para leer y actualizar la información necesaria.
    setIsCorrect,
    activeQuestion,
    setActiveQuestion,
    setShouldResume,
    isCorrect,
    answeredQuestions,
    setAnsweredQuestions,
  } = useHomeContext();

  const handleAnswer = (selectedAnswer: string) => { //Función que recibe la respuesta del usuario.
    setIsCorrect(null); //Antes de procesar la respuesta, se reinicia la respuesta correcta a null para limpiar respuestas anteriores.
    const correctAnswer = questions[activeQuestion!].correctAnswer; //Obtenemos la pregunta correcta de la pregunta actual. activeQuestion! Indica que sabemos que hay una pregunta activa.
    if (selectedAnswer === correctAnswer) { //Comprueba si la respuesta seleccionada es estrictamente igual a la pregunta correcta.
      setIsCorrect(true); //Respuesta correcta se torna a true.

      // Se revisa si activeQuestion es distinta de null y que no esté en el array de contestadas.
      if ( activeQuestion !== null && !answeredQuestions.includes(activeQuestion)) {
        setAnsweredQuestions([...answeredQuestions, activeQuestion]); //Agrega el índice de la pregunta a la lista de contestadas.
      }
      setTimeout(() => { //Esperamos 2 segundos para ver el mensaje, cerrar el modal y continuar con el vídeo.
        setActiveQuestion(null);
        setShouldResume(true); 
      }, 2000);
    } else { //Si no, marca la respuesta como incorrecta.
      setIsCorrect(false);
    }
  };

  const handleCloseModal = () => { //Funcion que se usa cuando el usuario plusa en continuar al acertar una pregunta
    setIsCorrect(null); //Vuelve a setear la respuesta correcta a null para limpiar respuestas anteriores.

    //Si hay una pregunta activa y no está marcada como contestada, se agrega al array de contestadas.
    if ( activeQuestion !== null && !answeredQuestions.includes(activeQuestion)) {
      setAnsweredQuestions([...answeredQuestions, activeQuestion]);
    }
    setActiveQuestion(null);//Se cierra el modal ya que la pregunta activa pasa a ser null.
    setShouldResume(true); // Reanuda el vídeo tras presionar "Continuar"
  };

  if (activeQuestion === null) return null; //Si no hay pregunta activa, no se muestra el modal.
  return ( //Renderizado del modal
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
        {isCorrect === null ? ( //El usuario aun no ha respondido.
          <>
            <h2 className="mb-4 text-xl font-bold"> 
              {questions[activeQuestion].question} {/*Si no ha respondido entonces accede a la pregunta usando el índice de activeQuestion*/}
            </h2>
            <ul>{/*Muestra una lista de respuestas*/}
              {/* Para cada opción uso .map para recorrer la lista y creo un elemento li que contiene un botón*/}
              {questions[activeQuestion].options.map((option, index) => ( 
                <li key={index} className="mb-2"> 
                  {/*EL botón tiene un evento que al hacer click se llama a la función handleAnswer pasando la opción como argumento*/}
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
        ) : isCorrect ? ( //Si es correcto muestra el texto
          <h2 className="text-2xl font-bold text-green-500">✅ ¡Correcto!</h2>
        ) : (
          <>
            <h2 className="mb-4 text-2xl font-bold text-red-500"> {/*Si es incorrecto muestra el error, y la respuesta correcta + botón de continuar*/}
              ❌ Incorrecto
            </h2>
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
