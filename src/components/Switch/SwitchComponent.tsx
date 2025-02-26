import {useState } from "react";

//Componente que controla el Switch
const SwitchComponent = () => {
  const [isSwitchOn, setSwitchOn] = useState(true);
  const [showBreakpoints, setShowBreakpoints] = useState(true);

  const handleCLick =() =>{
    setSwitchOn(prevState => { 
      const newState = !prevState;
      setShowBreakpoints(newState);
      return newState;
    });
  };

  return (
    <section>
      <button
        onClick={handleCLick}
        className="rounded-md bg-amber-300 px-4 py-2 text-white hover:bg-amber-500 hover:text-neutral-700 cursor-pointer"
        >
        Mostrar Breakpoints
      </button>
    </section>
    
  );
};

export default SwitchComponent;
