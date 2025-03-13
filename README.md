# Proyecto de Video Interactivo con Preguntas

Este proyecto, desarrollado con **React**, **TypeScript** y **Vite**, implementa un reproductor de video interactivo que se detiene en momentos específicos para mostrar preguntas al usuario. Está pensado para ofrecer una experiencia dinámica en aplicaciones de aprendizaje o entretenimiento.

## Características Principales

- **Reproductor de YouTube Personalizado**  
  - Integración con la API de YouTube para controlar la reproducción, el volumen y la posición del video.  
  - Uso de un hook personalizado para detectar y gestionar automáticamente los "breakpoints" donde se deben mostrar las preguntas.

- **Sistema de Preguntas y Respuestas**  
  - El video se pausa en momentos definidos y se muestra un modal con la pregunta correspondiente.  
  - El usuario debe responder (correctamente o no) para continuar con la reproducción del video.  
  - Registro de respuestas correctas e incorrectas, y activación de un modal final cuando se han respondido todas las preguntas.

- **Controles Personalizados y Pantalla Completa**  
  - Botones para reproducir/pausar, silenciar, ajustar el volumen y alternar el modo pantalla completa.  
  - Estilos gestionados mediante CSS Modules para garantizar una apariencia consistente y modular.

- **Gestión Global del Estado**  
  - Uso de un contexto global (HomeContext) para gestionar el estado del reproductor y las preguntas, facilitando la comunicación entre componentes.

- **Diseño Modular y Escalable**  
  - Código dividido en componentes independientes (por ejemplo, VideoComponent, VideoControls, QuestionModal) y hooks personalizados.  
  - Tipado estricto con TypeScript para mejorar la robustez y escalabilidad del proyecto.

## Aspectos Fundamentales de su Funcionamiento

- **Reproducción y Control del Video:**  
  Se utiliza un hook personalizado (`UseVideoPlayer`) que configura la API de YouTube, permitiendo acciones como reproducir, pausar, silenciar, y saltar a un punto específico en el video mediante la función `seekTo`.

- **Sincronización de Preguntas:**  
  El sistema establece "breakpoints" basados en el tiempo del video. Cada vez que se acerca a un breakpoint, el video se pausa y se muestra un modal con la pregunta correspondiente. La reanudación del video se realiza automáticamente una vez que se ha interactuado con el modal.

- **Modo Pantalla Completa:**  
  El reproductor se adapta al modo pantalla completa usando estilos que lo hacen ocupar toda la ventana, eliminando márgenes y asegurando que tanto el video como la barra de controles se centren correctamente.

- **Interacción con la Interfaz:**  
  Los componentes de controles permiten al usuario:
  - Cambiar la posición del video mediante una barra de progreso interactiva.
  - Ajustar el volumen y alternar entre silenciar y activar el sonido.
  - Alternar entre el modo normal y pantalla completa.

Esta estructura modular y basada en TypeScript permite mantener el código organizado y fácilmente escalable para futuras mejoras o integración de nuevas funcionalidades.

---

