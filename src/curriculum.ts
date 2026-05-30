import { Phase, PathStep } from "./types";

export const CURRICULUM: Phase[] = [
  {
    id: "phase_1",
    title: "Fase 1: Pensar en Lógica",
    subtitle: "Aprender a programar sin teclear código formal",
    description: "Dominarás las instrucciones secuenciales, la toma de decisiones basada en condiciones reales y los bucles repetitivos para automatizar tareas.",
    badgeName: "Insignia de Lógica de Oro",
    objectives: [
      "Comprender el concepto de algoritmo secuencial",
      "Dominar las estructuras condicionales (SI / SINO)",
      "Controlar flujos repetitivos con Bucles",
      "Escribir pseudocódigo estructurado y libre de errores"
    ],
    challengeTitle: "Mi Primer Solucionador Inteligente",
    challengeDescription: "Crea una guía lógica (pseudocódigo) para coordinar las actividades matutinas de un hogar inteligente considerando la temperatura exterior.",
    lessons: [
      {
        id: "l1_seq",
        title: "Lección 1.1: El Algoritmo Cotidiano",
        subtitle: "La secuencia de pasos lógicos",
        type: "concept",
        content: `Programar no es más que enseñarle a una máquina a resolver un problema mediante pasos sencillos y ordenados. Es lo mismo que haces tú al dar instrucciones detalladas a alguien sobre cómo preparar una taza de café o cambiar un neumático.

En pseudocódigo, representamos esto línea por línea. Cada instrucción debe ser un verbo claro. 

Ejemplo de algoritmo para preparar té:
1. Poner agua a hervir en el hervidor.
2. Si el agua está hirviendo, apagar y verter en la taza.
3. Meter la bolsita de té y esperar 3 minutos.
4. Endulzar al gusto.

Pruébalo tú mismo. Define la variable "agua_temperatura" a 100 para activar el calentamiento completo de la máquina.`,
        codeSnippet: `// Define la temperatura ideal para hervir
agua_temperatura = 100
taza_vacia = verdadero
servir_agua = verdadero
Log "¡Hervidor encendido!"`,
        expectedOutput: "¡Hervidor encendido!",
        expectedVariables: { agua_temperatura: 100, taza_vacia: "verdadero" },
        explanationOfGoal: "Declara las variables para calentar agua seleccionando e ingresando los valores correctos en el taller."
      },
      {
        id: "l1_cond",
        title: "Lección 1.2: El Árbol de Decisiones (SI / SINO)",
        subtitle: "Cómo enseñar lógica condicional a tu máquina",
        type: "logic_exercise",
        content: `Los condicionales son el pilar de toda inteligencia informática. Permiten que tu programa reaccione de distinta forma según los valores de entrada.

Piensa en los sensores de luz de tu patio:
- SI la luz ambiental es menor o igual a 20%, ENTONCES encender bombilla.
- SINO, mantener bombilla apagada.

Modificando las variables de prueba, enseña a tu lógica a reaccionar. Escribe un código lógico condicional asignando un presupuesto. Al rebasar los 1500, activará la alarma de gastos.`,
        codeSnippet: `presupuesto = 1800
alerta_limite = falso

SI presupuesto > 1500 ENTONCES
  alerta_limite = verdadero
  Log "Alerta: Presupuesto crítico excedido"
SINO
  alerta_limite = falso
  Log "Gastos dentro de márgenes saludables"
FIN_SI`,
        expectedOutput: "Alerta: Presupuesto crítico excedido",
        expectedVariables: { presupuesto: 1800, alerta_limite: "verdadero" },
        explanationOfGoal: "Establece el presupuesto arriba de 1500 para activar la condición verdadera correspondiente y desplegar la alerta lógicamente."
      },
      {
        id: "l1_loop",
        title: "Lección 1.3: Bucles y Repeticiones (MIENTRAS)",
        subtitle: "Evitando el trabajo repetitivo",
        type: "logic_exercise",
        content: `Un bucle repite una instrucción muchas veces siempre que se cumpla una condición específica. Es ideal para tareas monótonas como rellenar casillas de un Excel, regar plantas o contar stock.

Ejemplo físico:
"Mientras quede café en la jarra, sigue vertiendo un chorrito en las tazas."

Vamos a simular un contador de pasos de salud para el control de bienestar de adultos de 45+. Si configuramos el paso inicial en 0 y el límite diario en 5 pasos, realizaremos la secuencia iterativamente actualizando la suma paso a paso.`,
        codeSnippet: `pasos = 0
meta = 5

MIENTRAS pasos < meta REPETIR
  pasos = pasos + 1
  Log "Has dado un paso más"
FIN_MIENTRAS

Log "¡Meta diaria superada!"`,
        expectedOutput: "¡Meta diaria superada!",
        expectedVariables: { pasos: 5 },
        explanationOfGoal: "Asegúrate de que la variable final de pasos acumule el valor de meta de manera secuencial mediante bucles repetitivos."
      }
    ]
  },
  {
    id: "phase_2",
    title: "Fase 2: Hola Python Real",
    subtitle: "Dominando la sintaxis del lenguaje más legible del mundo",
    description: "La transición desde el pseudocódigo a Python real es inmediata. Aprenderás a declarar variables, realizar operaciones numéricas y definir funciones portables.",
    badgeName: "Placa Profesional Python",
    objectives: [
      "Traducir lógica estructurada a código Python ejecutable",
      "Asimilar la sintaxis limpia de variables e impresiones (print)",
      "Crear funciones parametrizadas reutilizables",
      "Manejar flujos de datos reales con números y texto"
    ],
    challengeTitle: "Calculador Dinámico de Jubilación",
    challengeDescription: "Codifica un script en Python que evalúe si la cifra de ahorro acumulada garantiza una jubilación feliz a partir de tu año actual.",
    lessons: [
      {
        id: "l2_vars",
        title: "Lección 2.1: Variables y Tipos de Datos",
        subtitle: "El guardado de información en memoria",
        type: "python_primer",
        content: `En Python, no declaras tipos complicados; el sistema detecta si estás guardando letras, enteros o decimales automáticamente basándose en cómo escribes tus datos.

- Texto (String): Debe ir entre comillas, ej: nombre = "Alberto"
- Enteros (Integer): Números sin decimales, ej: edad = 45
- Booleanos (Bool): True o False (notar la mayúscula, muy importante en Python).

¡Tu turno! Define tu nombre de mentor y tu edad para familiarizarte con las asignaciones limpias de Python.`,
        codeSnippet: `nombre = "Alberto"
edad = 45
activo = True
print("Sistemas activos para mentor:")
print(nombre)`,
        expectedOutput: "Sistemas activos para mentor:\nAlberto",
        expectedVariables: { nombre: "Alberto", edad: 45, activo: "True" },
        explanationOfGoal: "Establece las variables del mentor utilizando las cadenas y números exactos para observar la impresión directa en consola de Python."
      },
      {
        id: "l2_funcs",
        title: "Lección 2.2: Automatizar con Funciones",
        subtitle: "La caja de herramientas reutilizable",
        type: "python_primer",
        content: `Una función es un bloque de código al que le pones un nombre descriptivo para no tener que reescribirlo. En Python se definen con la palabra clave "def".

Ejemplo:
def saludar_estudiante(nombre):
    print("Hola, " + nombre)

Puedes llamar a esa función las veces que quieras pasándole distintos nombres.
Creemos un calculador de aportes para el fondo mutuo familiar.`,
        codeSnippet: `def calcular_fondo(ahorro, meses):
    total = ahorro * meses
    return total

gran_total = calcular_fondo(150, 12)
print("Fondo acumulado anual:")
print(gran_total)`,
        expectedOutput: "Fondo acumulado anual:\n1800",
        expectedVariables: { gran_total: 1800 },
        explanationOfGoal: "Utiliza la función modular definida 'calcular_fondo' llamándola con entradas que resulten en un gran total de 1800 de manera asertiva."
      }
    ]
  },
  {
    id: "phase_3",
    title: "Fase 3: Estructuras y Algoritmos de Gestión",
    subtitle: "Manipulación de listas e información ordenada",
    description: "Los flujos informáticos reales requieren archivar colecciones de datos, tales como listados de inventario de un negocio, correos o historiales quirúrgicos.",
    badgeName: "Laurel de Algoritmia Avanzada",
    objectives: [
      "Entender e implementar listas (arrays/vectores)",
      "Recorrer conjuntos de datos mediante índices",
      "Buscar selectivamente elementos óptimos",
      "Filtrar catálogos bajo condiciones de control de salud"
    ],
    challengeTitle: "Optimizador de Medicamentos por Alarma",
    challengeDescription: "Genera una lógica que filtre aquellos medicamentos críticos que deben reabastecerse según su inventario remanente.",
    lessons: [
      {
        id: "l3_lists",
        title: "Lección 3.1: Catálogos de Información (Listas)",
        subtitle: "Estructurando colecciones secuenciales",
        type: "concept",
        content: `Imagina una cómoda con cajones ordenados del 0 en adelante. Cada cajetín contiene un dato de la misma categoría. En programación esto se denomina lista.

- Las listas comienzan siempre en el índice 0. Un error clásico es contar desde el 1.
- Puedes agregar nuevos elementos, eliminar duplicados o saber cuántos elementos hay acumulados.

Simulemos un registro clínico para control de presión arterial sistólica donde determinamos el promedio de tres lecturas registradas consecutivamente: 120, 135 y 130.`,
        codeSnippet: `lectura_uno = 120
lectura_dos = 135
lectura_tres = 130
promedio = (lectura_uno + lectura_dos + lectura_tres) / 3
Log "Promedio calculado de presión cardiaca:"
Log promedio`,
        expectedOutput: "Promedio calculado de presión cardiaca:\n128.33",
        expectedVariables: { promedio: 128.33333333333334 },
        explanationOfGoal: "Establece las tres lecturas y obtén el promedio correcto de presión cardiaca cercano a 128 para convalidar cuantitativamente."
      }
    ]
  }
];

export const GENERAL_PATH_STEPS: PathStep[] = [
  {
    id: "step_start",
    label: "Comenzar el Viaje",
    type: "start",
    description: "Bienvenida oficial a tu nuevo camino formativo. Repasamos tus competencias previas y establecemos metas realistas de aprendizaje sin frustraciones.",
    whatYouWillLearn: "Filosofía del pensador sistémico y por qué la experiencia de vida acumulada es tu mayor ventaja competitiva en informática.",
    practiceToRealize: "Configuración inicial de tu cuaderno físico virtual.",
    evaluationCondition: "Dar clic en iniciar y asimilar el manifiesto de la lógica.",
    whatItUnlocks: "Fase 1: Pensar en Lógica y el taller interactivo de algoritmos."
  },
  {
    id: "step_phase1_module",
    label: "Fase 1: Taller de Lógica Básica",
    type: "phase_module",
    phaseId: "phase_1",
    description: "Ejecutar la secuencia completa de lecciones introductorias en formato interactivo dentro de nuestro simulador integrado.",
    whatYouWillLearn: "Flujos lineales, variables en memoria y cómo estructurar bifurcaciones lógicas robustas con condiciones SI/SINO.",
    practiceToRealize: "Simular los 3 algoritmos de lección provistos para el control inteligente del hogar.",
    evaluationCondition: "Completar satisfactoriamente el taller interactivo simulando los resultados propuestos.",
    whatItUnlocks: "Evaluación formal de Estructuras de Flujo Lógico."
  },
  {
    id: "step_phase1_eval",
    label: "Cuestionario de Estructuras de Flujo Lógico",
    type: "phase_eval",
    phaseId: "phase_1",
    description: "Evaluación teórica interactiva para corroborar tus habilidades de análisis lógico.",
    whatYouWillLearn: "Análisis de diagramas, jerarquía en condiciones booleanas de exclusión y depuración de bucles infinitos molestos.",
    practiceToRealize: "Examen de selección múltiple con casos aplicados de la vida real.",
    evaluationCondition: "Aprobar con el 100% de respuestas correctas en la interfaz.",
    whatItUnlocks: "Insignia de Lógica de Oro y acceso a la Fase 2 (Python Real).",
    quizQuestions: [
      {
        id: "q1",
        question: "¿Qué ocurre si en un bucle MIENTRAS la condición principal SIEMPRE resulta verdadera de forma inalterada?",
        options: [
          "El ordenador explota físicamente de inmediato.",
          "Se produce un 'Bucle Infinito', congelando la aplicación al consumir toda la potencia de manera indeterminada.",
          "El código se salta esa instrucción y avanza al siguiente paso automáticamente.",
          "El sistema corrige la condición usando inteligencia artificial."
        ],
        correctAnswerIndex: 1
      },
      {
        id: "q2",
        question: "Si declaramos una variable: temp = 15. ¿Qué condición evaluará correctamente si la temperatura es templada (mayor que 10 y menor que 20)?",
        options: [
          "SI temp < 10 ENTONCES...",
          "SI temp > 10 Y temp < 20 ENTONCES...",
          "SI temp > 20 O temp < 10 ENTONCES...",
          "SI temp == 15 SINO..."
        ],
        correctAnswerIndex: 1
      },
      {
        id: "q3",
        question: "En computación, ¿cuál es la ventaja clave del Pseudocódigo frente al código en un lenguaje crudo como C o Python?",
        options: [
          "Se ejecuta directo en microprocesadores de última generación.",
          "Permite diseñar y validar la solución intelectualmente usando palabras en español sin preocuparse por la rigidez de la puntuación.",
          "Genera interfaces de usuario de alta fidelidad automáticamente.",
          "Es exclusivo para expertos programadores de edad avanzada."
        ],
        correctAnswerIndex: 1
      }
    ]
  },
  {
    id: "step_phase2_module",
    label: "Fase 2: Taller de Sintaxis Python",
    type: "phase_module",
    phaseId: "phase_2",
    description: "Asimilar las peculiaridades de Python. Creación de variables dinámicas, impresión por pantalla standard y definición estructural de funciones reutilizables.",
    whatYouWillLearn: "Sintaxis limpia de Python, sangrado (indentación) de código e invocación ordenada de rutinas con pasaje de argumentos numéricos.",
    practiceToRealize: "Consolidar las asignaciones de fondos mutuos familiares en el simulador interactivo.",
    evaluationCondition: "Completar de manera práctica las lecciones correspondientes de la Fase 2.",
    whatItUnlocks: "Exposición al Reto de Certificación Práctico."
  },
  {
    id: "step_phase2_project",
    label: "Reto Práctico: Validador de Ahorros para la Jubilación",
    type: "phase_project",
    phaseId: "phase_2",
    description: "Diseño y validación de una aplicación completa de finanzas personales basada en Python.",
    whatYouWillLearn: "Análisis financiero, control y protección ante ingresos insuficientes y devolución modular de información procesada.",
    practiceToRealize: "Desarrollar un código que verifique si los aportes ahorrados bastan para una jubilación feliz según los umbrales institucionales sanitarios de España.",
    evaluationCondition: "Codificar la solución aplicando condicionales lógicos avanzados hasta que la consola de validación se pinte de color verde.",
    whatItUnlocks: "Placa Profesional Python y acceso a la Fase 3 de Estructuras.",
    projectTemplate: {
      instructions: "Modifica el código en el editor para evaluar 'ahorros_actuales' y el umbral requerido. Si los ahorros son mayores o iguales a 50000, establece 'jubilado_feliz = verdadero' e imprime 'Acceso autorizado al descanso'. Si no, establece 'jubilado_feliz = falso' e imprime 'Requiere aportes de refuerzo'. Asegúrate de retornar o consolidar las variables exactas.",
      starterCode: `// Código inicial de jubilación
ahorros_actuales = 62000
jubilado_feliz = falso

SI ahorros_actuales >= 50000 ENTONCES
  jubilado_feliz = verdadero
  Log "Acceso autorizado al descanso"
SINO
  jubilado_feliz = falso
  Log "Requiere aportes de refuerzo"
FIN_SI`,
      solutionKeywords: ["ahorros_actuales", "jubilado_feliz", "verdadero", "Acceso autorizado"]
    }
  },
  {
    id: "step_phase3_module",
    label: "Fase 3: Optimización con Listas",
    type: "phase_module",
    phaseId: "phase_3",
    description: "Estudio holístico de colecciones de datos secuenciales para automatizar el procesamiento repetitivo de catálogos.",
    whatYouWillLearn: "Manejo de colecciones, aritmética de presión arterial, bucles para filtrado e introducción a la resiliencia técnica de la información.",
    practiceToRealize: "Modelar el cálculo de promedio de signos de presión arterial en el simulador.",
    evaluationCondition: "Completar la lección interactiva de listas de la Fase 3.",
    whatItUnlocks: "Estación Final: Conclusión y Certificado."
  },
  {
    id: "step_finish",
    label: "Estación de Graduación",
    type: "finish",
    description: "Consolidación de todo tu camino de aprendizaje. Generación de tu certificado honorífico 'Adulto Programador Sólido' y plan de continuidad para estudiar lenguajes compilados.",
    whatYouWillLearn: "Cómo seguir aprendiendo en universidades abiertas, creación de portafolios de trabajo personales sencillos y mentalidad tecnológica de por vida.",
    practiceToRealize: "Revisar todo tu Cuaderno de Progreso y recopilar tus insignias ganadas.",
    evaluationCondition: "Obtener las insignias requeridas completando los exámenes precedentes de forma proactiva.",
    whatItUnlocks: "Certificado institucional descargable interactivo y soporte ilimitado."
  }
];
