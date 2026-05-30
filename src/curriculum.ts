import { Phase, PathStep } from "./types";

export const CURRICULUM: Phase[] = [
  {
    id: "phase_1",
    title: "Fase 1: Pensar en Lógica",
    subtitle: "Aprender a pensar ordenadamente antes de programar",
    description: "Dominarás las instrucciones secuenciales, la toma de decisiones basada en condiciones reales y los bucles repetitivos para automatizar tareas cotidianas sin la rigidez técnica de un lenguaje de programación formal.",
    badgeName: "Insignia de Lógica de Oro",
    suggestedDuration: "2 semanas",
    explanationOfPhase: "El usuario debe aprender a pensar ordenadamente. Antes de escribir código, debe saber describir un problema, dividirlo en pasos y prever resultados.",
    temas: [
      "Qué es programar",
      "Algoritmos",
      "Entrada, proceso y salida",
      "Variables",
      "Condicionales",
      "Bucles",
      "Pseudocódigo"
    ],
    practices: [
      "Convertir una receta en algoritmo.",
      "Escribir instrucciones para una tarea diaria.",
      "Resolver decisiones con “si / entonces”.",
      "Hacer tablas de prueba manuales."
    ],
    stepByStepGuide: [
      "Paso 1: leer el objetivo.",
      "Paso 2: identificar qué problema se resuelve.",
      "Paso 3: escribir pasos simples.",
      "Paso 4: revisar si falta algo.",
      "Paso 5: convertir a pseudocódigo.",
      "Paso 6: comprobar si la solución es lógica.",
      "Paso 7: corregir errores."
    ],
    evaluationCriteria: [
      "Explicar un problema con sus propias palabras.",
      "Escribir una solución sin código.",
      "Identificar errores lógicos."
    ],
    phaseProjectDescription: "“Mi primer solucionador de problemas”: una serie de algoritmos escritos en pseudocódigo para resolver tareas cotidianas.",
    objectives: [
      "Comprender qué es programar y el concepto de algoritmo secuencial",
      "Dominar las estructuras de Entrada, Proceso y Salida",
      "Declarar y manipular variables sencillas en memoria",
      "Implementar condiciones (SI/SINO) y repeticiones (MIENTRAS) en pseudocódigo"
    ],
    challengeTitle: "Mi Primer Solucionador Inteligente",
    challengeDescription: "Crea una guía lógica (pseudocódigo) para coordinar las actividades matutinas de un hogar inteligente considerando la temperatura exterior.",
    lessons: [
      {
        id: "l1_que_es",
        title: "Lección 1.1: ¿Qué es programar?",
        subtitle: "Pensar de forma estructurada antes de teclear",
        type: "concept",
        content: `Programar no consiste en memorizar símbolos de aspecto futurista. Programar es, en esencia, diseñar secuencias ordenadas de pasos y reglas lógicas para que una computadora pueda solucionar un problema determinado de manera autónoma.

A tus más de 45 años de experiencia, ya has resuelto infinidad de problemas de la vida real (organizar tu hogar, dirigir tu negocio, planificar finanzas). ¡Felicidades! Eso significa que ya eres un pensador lógico entrenado. Programar es simplemente verbalizar esas secuencias lógicas de manera ultra clara.`,
        codeSnippet: `// Comienza tu viaje lúdico activando tu primer interruptor lógico
mente_lista = verdadero
Log "¡Tengo la mente lista para programar!"`,
        expectedOutput: "¡Tengo la mente lista para programar!",
        expectedVariables: { mente_lista: "verdadero" },
        explanationOfGoal: "Declara la variable 'mente_lista' con el valor 'verdadero' y simula la ejecución para ver el saludo en consola."
      },
      {
        id: "l1_algoritmos",
        title: "Lección 1.2: Los Algoritmos",
        subtitle: "La receta precisa del éxito informático",
        type: "concept",
        content: `Un algoritmo es simplemente una receta paso a paso para resolver una tarea o lograr una meta.

Piensa en los pasos para hornear un pastel o cambiar un neumático desinflado. En el mundo del software el orden es estricto: no puedes poner la olla al fuego sin antes haber servido el agua. Si alteras el orden racional de las instrucciones, el programa fallará o devolverá un resultado de descontrol.`,
        codeSnippet: `// Orden lógico: Cocinar antes de servir al comensal
paso1_cocinar = verdadero
paso2_servir = verdadero
Log "¡Algoritmo de cena exitoso!"`,
        expectedOutput: "¡Algoritmo de cena exitoso!",
        expectedVariables: { paso1_cocinar: "verdadero", paso2_servir: "verdadero" },
        explanationOfGoal: "Define paso1_cocinar y paso2_servir como 'verdadero' para comprobar que el algoritmo sigue el orden secuencial correcto y ejecuta la cena."
      },
      {
        id: "l1_entrada_proceso",
        title: "Lección 1.3: Entrada, Proceso y Salida",
        subtitle: "Los tres pilares de cualquier programa",
        type: "concept",
        content: `Cualquier programa informático, desde el más básico hasta la Inteligencia Artificial, trabaja procesando información mediante un flujo de tres fases:

1. Entrada: El software obtiene datos brutos (por ejemplo, el precio de catálogo de un artículo).
2. Proceso: Realiza cálculos o transformaciones lógicas (restarle un descuento por promoción).
3. Salida: Muestra o entrega los resultados ya depurados (el cobro final de caja).

Configura estas variables del negocio para que el cálculo se ejecute correctamente.`,
        codeSnippet: `precio_entrada = 100
descuento_proceso = 20
precio_final_salida = precio_entrada - descuento_proceso
Log "El precio final con descuento es:"
Log precio_final_salida`,
        expectedOutput: "80",
        expectedVariables: { precio_entrada: 100, descuento_proceso: 20, precio_final_salida: 80 },
        explanationOfGoal: "Establece el precio en 100 y el descuento en 20 para validar el proceso matemático de salida."
      },
      {
        id: "l1_variables",
        title: "Lección 1.4: Las Variables",
        subtitle: "Los contenedores donde reside la información",
        type: "concept",
        content: `Una variable es, sencillamente, una caja con nombre impreso donde guardamos información útil.

La información guardada en esa caja puede variar a lo largo del tiempo (por eso se llaman 'variables'). Puedes guardar números detallados, textos explicativos o estados booleanos (falso o verdadero). Por ejemplo, guardemos tu edad inicial para proyectar tus metas de jubilación el próximo año.`,
        codeSnippet: `edad_usuario = 45
edad_siguiente_ano = edad_usuario + 1
Log "Mi edad el próximo año será:"
Log edad_siguiente_ano`,
        expectedOutput: "46",
        expectedVariables: { edad_usuario: 45, edad_siguiente_ano: 46 },
        explanationOfGoal: "Modifica tu variable de 'edad_usuario' a 45 para comprobar cómo la máquina calculará tu edad secuencial el año venidero."
      },
      {
        id: "l1_condicionales",
        title: "Lección 1.5: Las Decisiones (Condicionales)",
        subtitle: "Ramificaciones lógicas con SI y SINO",
        type: "logic_exercise",
        content: `Las computadoras no tienen intuición propia: deciden mediante la estricta evaluación de condiciones verdaderas.

SI una condición se cumple, el programa toma el camino A. SINO (si la condición resulta falsa), toma el camino B. Es idéntico a cómo procedes en tu vida real: 'SI veo que está lloviendo, ENTONCES cojo el paraguas. SINO, salgo sin paraguas'.`,
        codeSnippet: `esta_lloviendo = verdadero
llevar_paraguas = falso

SI esta_lloviendo == verdadero ENTONCES
  llevar_paraguas = verdadero
  Log "Alerta: Debes llevar paraguas contigo"
SINO
  llevar_paraguas = falso
  Log "Cielo despejado: Camina libremente"
FIN_SI`,
        expectedOutput: "Alerta: Debes llevar paraguas contigo",
        expectedVariables: { esta_lloviendo: "verdadero", llevar_paraguas: "verdadero" },
        explanationOfGoal: "Establece la variable esta_lloviendo en verdadero para activar de forma correcta la alarma de paraguas."
      },
      {
        id: "l1_bucles",
        title: "Lección 1.6: Repetir con Eficacia (Bucles)",
        subtitle: "El fin de las tareas repetitivas",
        type: "logic_exercise",
        content: `Un bucle es sencillamente una instrucción que se repite una y otra vez MIENTRAS se mantenga activa una condición de control.

Es perfecto para automatizar tareas mecánicas y aburridas: rellenar celdas de cálculo, regar plantaciones, o contar inventarios en un almacén. Piensa en el siguiente bucle físico: 'Mientras queden platos por fregar, sigue remojando platos'.`,
        codeSnippet: `copias_restantes = 3
MIENTRAS copias_restantes > 0 REPETIR
  copias_restantes = copias_restantes - 1
  Log "Imprimiendo copia..."
FIN_MIENTRAS

Log "¡Impresiones completadas de manera automatizada!"`,
        expectedOutput: "¡Impresiones completadas de manera automatizada!",
        expectedVariables: { copias_restantes: 0 },
        explanationOfGoal: "Define copias_restantes en 3 y permite que el bucle MIENTRAS reduzca el inventario a 0 de forma automatizada."
      },
      {
        id: "l1_pseudocodigo",
        title: "Lección 1.7: El Pseudocódigo",
        subtitle: "Tu partitura lógica en español",
        type: "logic_exercise",
        content: `El pseudocódigo es hablar directo con el computador usando nuestro idioma materno pero de forma ordenada, jerárquica y con reglas de indentación.

Permite que diseñemos algoritmos maravillosos enfocándonos en la lógica intelectual y libres de la molesta ortografía de llaves o corchetes propia de lenguajes formales complicados. Una vez que tu lógica de pseudocódigo funciona, traducirlo a Python es un paseo.`,
        codeSnippet: `// Valida la última lección de la Fase 1
logica_validada = verdadero
Log "¡He completado toda la Fase 1 lógicamente!"`,
        expectedOutput: "¡He completado toda la Fase 1 lógicamente!",
        expectedVariables: { logica_validada: "verdadero" },
        explanationOfGoal: "Haz correr el pseudocódigo para certificar tu dominio completo sobre los fundamentos cognitivos de la programación."
      }
    ]
  },
  {
    id: "phase_2",
    title: "Fase 2: Primer Lenguaje",
    subtitle: "Escribir programas simples sin perder la lógica",
    description: "Dominarás la transición del pensamiento secuencial a la codificación real utilizando Python, un lenguaje de lectura directa e impecable. Aprenderás a configurar tu editor, interactuar con el usuario y estructurar cálculos cotidianos.",
    badgeName: "Placa Profesional Python",
    suggestedDuration: "3 semanas",
    explanationOfPhase: "Aprender a escribir programas simples sin perder la lógica de la programación.",
    temas: [
      "Instalación del entorno",
      "Editor de código",
      "Estructura de un programa",
      "Variables y tipos de datos",
      "Operadores",
      "Condicionales",
      "Bucles",
      "Funciones básicas"
    ],
    practices: [
      "Mostrar texto en pantalla.",
      "Pedir datos al usuario.",
      "Calcular edad.",
      "Saber si un número es par.",
      "Hacer una calculadora básica."
    ],
    stepByStepGuide: [
      "Paso 1: entender qué debe hacer el programa.",
      "Paso 2: escribir entradas y salidas.",
      "Paso 3: crear el código mínimo.",
      "Paso 4: ejecutar el programa.",
      "Paso 5: probar con varios valores.",
      "Paso 6: corregir errores.",
      "Paso 7: mejorar el código."
    ],
    evaluationCriteria: [
      "Crear programas pequeños desde cero.",
      "Corregir errores básicos.",
      "Explicar qué hace cada parte del código."
    ],
    phaseProjectDescription: "“Calculadora básica interactiva” con operaciones simples y validación de entradas.",
    objectives: [
      "Comprender la configuración básica de entornos locales y editores de código modernos",
      "Mostrar textos y capturar valores dinámicos utilizando variables tipadas en Python",
      "Manejar operaciones aritméticas y comprobar la paridad de un número de forma asertiva",
      "Modularizar utilidades mediante funciones parametrizables con salidas lógicas"
    ],
    challengeTitle: "Calculadora Básica Interactiva",
    challengeDescription: "Implementa una calculadora interactiva con operaciones de suma y resta, provista de validación analítica de errores para entradas atípicas.",
    lessons: [
      {
        id: "l2_vars",
        title: "Lección 2.1: Estructura & Mostrar Texto",
        subtitle: "Práctica 1: Tu primer programa en pantalla",
        type: "python_primer",
        content: `Aprenderás la estructura mínima de un script de Python. Utilizamos el comando 'print(...)' para instruir a la máquina que proyecte un mensaje literal directo al terminal.
        
A tus más de 45 años, verás que escribir código en Python se lee casi igual que redactar instrucciones informales en persona. ¡Vamos a crear tu saludo de bienvenida en el editor!`,
        codeSnippet: `print("Iniciando mi primer programa en Python")
print("¡Instalacio del entorno y editor completada!")`,
        expectedOutput: "Iniciando mi primer programa en Python\n¡Instalacio del entorno y editor completada!",
        expectedVariables: {},
        explanationOfGoal: "Ejecuta de forma secuencial las dos instrucciones 'print' del terminal para convalidar la primera lección interactiva de esta fase."
      },
      {
        id: "l2_io",
        title: "Lección 2.2: Leer Datos & Calcular Edad",
        subtitle: "Prácticas 2 & 3: Dinamismo interactivo de variables",
        type: "python_primer",
        content: `En esta lección comprendemos cómo se asignan valores a variables lógicas y matemáticas. 
        
Para simular el ingreso interactivo del usuario ('Pedir datos al usuario') y 'Calcular edad', realizamos una resta aritmética entre el año de control de simulación y el año de nacimiento del mentor de forma totalmente automatizada.`,
        codeSnippet: `anio_nacimiento = 1980
anio_actual = 2026
edad_calculada = amig_actual - anio_nacimiento
# Corregir variable para evitar errores de compilación asertivos
edad_calculada = anio_actual - anio_nacimiento
print("Edad calculada con exito:")
print(edad_calculada)`,
        expectedOutput: "Edad calculada con exito:\n46",
        expectedVariables: { anio_nacimiento: 1980, anio_actual: 2026, edad_calculada: 46 },
        explanationOfGoal: "Establece el año de nacimiento como 1980 para comprobar que el simulador calcula de forma exacta la edad (46) del mentor."
      },
      {
        id: "l2_par",
        title: "Lección 2.3: Operadores & saber si es par",
        subtitle: "Práctica 4: El filtro condicional óptimo",
        type: "python_primer",
        content: `Determinamos si un número es par analizando su residuo. Un número es divisible por dos cuando no tiene remanente.
        
Evaluamos con el condicional 'SI / SINO' para bifurcar el comportamiento si cumple las premisas de control aritmético establecidas.`,
        codeSnippet: `numero_a_evaluar = 42
es_par = "no"

SI numero_a_evaluar == 42 ENTONCES
  es_par = "si"
  print("El numero es par")
SINO
  es_par = "no"
  print("El numero es impar")
FIN_SI`,
        expectedOutput: "El numero es par",
        expectedVariables: { numero_a_evaluar: 42, es_par: "si" },
        explanationOfGoal: "Asigna 42 al numero_a_evaluar para activar la bifurcación afirmativa del condicional de paridad."
      },
      {
        id: "l2_funcs",
        title: "Lección 2.4: Funciones Básicas & Bucles",
        subtitle: "automatizando procesos repetitivos",
        type: "python_primer",
        content: `Una función agrupa código reutilizable. Los bucles automatizan tareas repetitivas de forma óptima sin escribir líneas adicionales innecesarias.
        
Simulamos ciclos sucesivos utilizando 'MIENTRAS' para incrementar un contador hasta un umbral de control de simulación prefijado.`,
        codeSnippet: `def calcular_incremento(valor, factor):
    return valor + factor

ciclos_restantes = 3
resultado_acumulado = 0

MIENTRAS ciclos_restantes > 0 REPETIR
  ciclos_restantes = ciclos_restantes - 1
  resultado_acumulado = resultado_acumulado + 10
FIN_MIENTRAS

print("Ciclos automatizados terminados")
print(resultado_acumulado)`,
        expectedOutput: "Ciclos automatizados terminados\n30",
        expectedVariables: { ciclos_restantes: 0, resultado_acumulado: 30 },
        explanationOfGoal: "Configura ciclos_restantes en 3 y permite que el bucle complete la acumulación matemática automática hasta 30."
      }
    ]
  },
  {
    id: "phase_3",
    title: "Fase 3: Resolver Problemas",
    subtitle: "Aprender a dividir problemas medianos en partes pequeñas",
    description: "Aprenderás de manera organizada a dividir problemas medianos en partes pequeñas utilizando estructuras de datos secuenciales y relacionales como listas y diccionarios, estructurando funciones con parámetros y dominando la depuración lógica.",
    badgeName: "Laurel de Algoritmia Avanzada",
    suggestedDuration: "3 semanas",
    explanationOfPhase: "Aprender a dividir problemas medianos en partes pequeñas.",
    temas: [
      "Listas",
      "Diccionarios",
      "Funciones con parámetros",
      "Depuración",
      "Organización del código"
    ],
    practices: [
      "Lista de compras.",
      "Control de gastos.",
      "Agenda de contactos.",
      "Promedio de notas.",
      "Juego de adivinar el número."
    ],
    stepByStepGuide: [
      "Paso 1: definir el objetivo exacto.",
      "Paso 2: identificar datos de entrada.",
      "Paso 3: definir cómo se almacenan los datos.",
      "Paso 4: crear funciones pequeñas.",
      "Paso 5: probar cada función por separado.",
      "Paso 6: unir las partes.",
      "Paso 7: depurar y mejorar."
    ],
    evaluationCriteria: [
      "Resolver un problema sin copiar una solución completa.",
      "Reutilizar funciones.",
      "Encontrar y corregir fallos lógicos."
    ],
    phaseProjectDescription: "“Sistema personal de organización” con lista de compras, gastos y contactos.",
    objectives: [
      "Aprender a descomponer y estructurar problemas medianos en subproblemas",
      "Implementar listas ordenadas y diccionarios asociativos clave-valor",
      "Escribir y reutilizar funciones modulares con pasaje de parámetros",
      "Ejecutar el diagnóstico interactivo de código y resolver fallos lógicos"
    ],
    challengeTitle: "Sistema Personal de Organización",
    challengeDescription: "Desarrolla el gestor principal de organización que consolide tu lista de compras, gastos del hogar y contactos domésticos.",
    lessons: [
      {
        id: "l3_lists",
        title: "Lección 3.1: Secuencias & Listas",
        subtitle: "Práctica 1: Tu lista de compras digital",
        type: "concept",
        content: `Una lista (o arreglo) es una estructura que permite guardar múltiples elementos bajo un solo nombre, ordenados con un índice numérico que inicia siempre en cero [0].
  
Imagina la lista de compras del hogar:
- Índice 0: "Leche"
- Índice 1: "Manzanas"
- Índice 2: "Pan"

En nuestro simulador interactivo de pseudocódigo, representamos esta secuencia de artículos asignándolos a posiciones indexadas definidas.`,
        codeSnippet: `articulos_total = 3
item_0 = "Leche"
item_1 = "Manzanas"
item_2 = "Pan"
print("Mi lista de compras contiene articulos:")
print(articulos_total)`,
        expectedOutput: "Mi lista de compras contiene articulos:\n3",
        expectedVariables: { articulos_total: 3, item_0: "Leche", item_1: "Manzanas", item_2: "Pan" },
        explanationOfGoal: "Establece articulos_total en 3 para coordinar de forma satisfactoria los elementos de tu lista indexada."
      },
      {
        id: "l3_dicts",
        title: "Lección 3.2: Diccionarios de Consulta",
        subtitle: "Prácticas 2 & 3: Control de gastos y Agenda de contactos",
        type: "concept",
        content: `Los diccionarios asocian una 'clave' única con un 'valor' específico, similar a buscar una palabra en un glosario físico o un contacto en una agenda.
  
- Clave 'mamá' -> Valor '555-1234'
- Clave 'luz' -> Valor 150 (gasto)
  
Familiarízate con las estructuras de clave-valor realizando consultas dinámicas de gastos mensuales y contactos telefónicos directos.`,
        codeSnippet: `gasto_luz = 150
gasto_agua = 45
gasto_total = gasto_luz + gasto_agua
contacto_nombre = "Ana"
contacto_telefono = 5550199
print("Gasto total mensual calculado:")
print(gasto_total)`,
        expectedOutput: "Gasto total mensual calculado:\n195",
        expectedVariables: { gasto_luz: 150, gasto_agua: 45, gasto_total: 195, contacto_nombre: "Ana", contacto_telefono: 5550199 },
        explanationOfGoal: "Suma los gastos de luz (150) and agua (45) para convalidar el total consolidado (195) de la lección."
      },
      {
        id: "l3_funcs",
        title: "Lección 3.3: Funciones & Promedio de Notas",
        subtitle: "Práctica 4: Modularizar cálculos estadísticos simples",
        type: "concept",
        content: `Para resolver problemas de manera organizada, dividimos el algoritmo en funciones con parámetros. Un parámetro es una variable externa que la función recibe para operar.
  
Aquí creamos una simulación del cálculo de promedio de notas de estudios mediante la suma ponderada secuencial dividida por el total de asignaturas.`,
        codeSnippet: `nota1 = 90
nota2 = 80
nota3 = 85
suma_notas = nota1 + nota2 + nota3
cantidad_materias = 3
promedio_final = suma_notas / cantidad_materias
print("Nota promedio de estudios:")
print(promedio_final)`,
        expectedOutput: "Nota promedio de estudios:\n85",
        expectedVariables: { nota1: 90, nota2: 80, nota3: 85, suma_notas: 255, cantidad_materias: 3, promedio_final: 85 },
        explanationOfGoal: "Asigna las notas 90, 80 y 85 para calcular de manera automatizada su promedio final (85)."
      },
      {
        id: "l3_debug",
        title: "Lección 3.4: Organización de Código & Depuración",
        subtitle: "Práctica 5: Identificar fallos lógicos interactivos",
        type: "concept",
        content: `La depuración (o debug) es el arte de buscar, identificar y solucionar fallos dentro de la secuencia de un programa. 
  
En un 'Juego de adivinar el número', si elegimos un valor exacto, el programa debe bifurcar el flujo para informarle al jugador si el intento fue asertivo. Corregimos el condicional para ganar el juego interactivo.`,
        codeSnippet: `numero_secreto = 7
intento_usuario = 7
adivinado = "no"

SI intento_usuario == numero_secreto ENTONCES
  adivinado = "si"
  print("¡Correcto! Has adivinado")
SINO
  adivinado = "no"
  print("Numero incorrecto, sigue intentando")
FIN_SI`,
        expectedOutput: "¡Correcto! Has adivinado",
        expectedVariables: { numero_secreto: 7, intento_usuario: 7, adivinado: "si" },
        explanationOfGoal: "Coloca el intento_usuario idéntico al numero_secreto para simular una victoria lógica perfecta en tu depurador."
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
    whatYouWillLearn: "Flujos lineales, variables en memoria y cómo estructurar bifurcaciones lógicas de decisiones e iteraciones secuenciales.",
    practiceToRealize: "Simular los 7 algoritmos de lección provistos para el control inteligente, recetas y control de flujos.",
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
    whatItUnlocks: "Insignia de Lógica de Oro y acceso a la Fase 2 (Primer Lenguaje).",
    quizQuestions: [
      {
        id: "q1",
        question: "¿Qué ocurre si en un bucle MIENTRAS la condición principal SIEMPRE resulta verdadera de forma inalterada?",
        options: [
          "El ordenador explota físicamente de inmediato.",
          "Se produce un 'Bucle Infinito', congelando la aplicación al consumir toda la potencia de la pestaña de manera indeterminada.",
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
          "Permite diseñar y validar la solución intelectualmente usando palabras en español sin preocuparse por la rigidez estricta de la sintaxis técnica formal.",
          "Genera interfaces de usuario de alta fidelidad automáticamente.",
          "Es exclusivo para expertos programadores de edad avanzada."
        ],
        correctAnswerIndex: 1
      }
    ]
  },
  {
    id: "step_phase2_module",
    label: "Fase 2: Taller de Introducción al Lenguaje",
    type: "phase_module",
    phaseId: "phase_2",
    description: "Dominar de forma práctica e interactiva los 8 temas fundamentales: desde la instalación del entorno hasta las funciones y condicionales.",
    whatYouWillLearn: "Operadores lógicos, cálculo dinámico de edad de usuarios, condicionales de paridad matemática y bucles controlados secuenciales.",
    practiceToRealize: "Completar satisfactoriamente las 4 lecciones de simulación interactiva sobre sintaxis e interactividad.",
    evaluationCondition: "Simular con éxito las instrucciones de las lecciones del taller de la Fase 2.",
    whatItUnlocks: "Lanzamiento y convalidación del Reto del Proyecto de la Fase 2."
  },
  {
    id: "step_phase2_project",
    label: "Proyecto: Calculadora Básica Interactiva",
    type: "phase_project",
    phaseId: "phase_2",
    description: "Programa una calculadora para operaciones simples provista de validación estructurada para prevenir e identificar errores de entrada.",
    whatYouWillLearn: "Estructuras anidadas de bifurcaciones (SI / SINO), operadores aritméticos, y gestión asertiva de detección de errores lógicos.",
    practiceToRealize: "Desarrollar un código interactivo que simule sumas, restas y asocie un indicador especial si la funcionalidad no está contemplada.",
    evaluationCondition: "Codificar la calculadora hasta validar con éxito en la consola de control.",
    whatItUnlocks: "Premio de la Placa Profesional Python y acceso al módulo dinámico de la Fase 3.",
    projectTemplate: {
      instructions: "Modifica o ejecuta el script en el editor para que evalúe 'operacion' y realice operaciones matemáticas elementales. Si es 'suma', establece 'resultado = num1 + num2'. Si es 'resta', realiza 'resultado = num1 - num2'. Si la operación no está contemplada, establece 'error_detectado = verdadero'. Presiona 'Validar Lógica' para convalidar tus avances de forma interactiva.",
      starterCode: `// Calculadora básica interactiva con validación de entradas
operacion = "suma"
num1 = 25
num2 = 15
resultado = 0
error_detectado = "falso"

SI operacion == "suma" ENTONCES
  resultado = num1 + num2
  Log "Suma ejecutada con exito"
SINO
  SI operacion == "resta" ENTONCES
    resultado = num1 - num2
    Log "Resta ejecutada con exito"
  SINO
    error_detectado = "verdadero"
    Log "Sintaxis: Operacion no soportada"
  FIN_SI
FIN_SI`,
      solutionKeywords: ["resultado", "suma", "exito", "error_detectado"]
    }
  },
  {
    id: "step_phase3_module",
    label: "Fase 3: Taller de Resolución de Problemas",
    type: "phase_module",
    phaseId: "phase_3",
    description: "Aprende a descomponer problemas medianos en partes más pequeñas. Estudias listas, diccionarios, paso de parámetros de funciones y técnicas de depuración estructurada.",
    whatYouWillLearn: "Descomposición lógica de objetivos, control secuencial de listas de compras, gestión de glosarios de gastos, cálculo de promedio de notas académicas y depuración rápida.",
    practiceToRealize: "Ejecutar y comprender las 4 lecciones interactivas prácticas sobre resolución estructurada en el editor.",
    evaluationCondition: "Completar la lección interactiva de listas de la Fase 3.",
    whatItUnlocks: "Reto del Proyecto de Organización de la Fase 3."
  },
  {
    id: "step_phase3_project",
    label: "Proyecto: Sistema Personal de Organización",
    type: "phase_project",
    phaseId: "phase_3",
    description: "Programa una calculadora para organizar tus listas, gastos y contactos domésticos con validaciones estructuradas.",
    whatYouWillLearn: "Estructuras asociativas complejas, condicionales anidados lógicos, y reutilización de flujos analíticos.",
    practiceToRealize: "Desarrollar un código en el editor que reciba un selector de consulta y proyecte el estado de compras, el total de gastos o la información del contacto.",
    evaluationCondition: "Codificar el sistema organizador hasta validar con éxito en la consola de control interactivo.",
    whatItUnlocks: "Recepción de la distinción Laurel de Algoritmia Avanzada y Estación de Graduación.",
    projectTemplate: {
      instructions: "Modifica el código de tu Sistema de Organización para evaluar el valor de la variable 'consulta_tipo'. Si es 'compras', establece 'conteo_items = 5' y registra 'estado_completado = verdadero'. Si es 'gastos', establece 'total_estimado = 280' y 'limite_excedido = falso'. Si es 'contactos', establece 'total_contactos = 12'. Si es cualquier otra opción, marca 'error_consulta = verdadero'. ¡Presiona 'Validar Lógica' para convalidar tus avances!",
      starterCode: `// Sistema personal de organización (compras, gastos y contactos)
consulta_tipo = "compras"
conteo_items = 0
estado_completado = "falso"
total_estimado = 0
limite_excedido = "falso"
total_contactos = 0
error_consulta = "falso"

SI consulta_tipo == "compras" ENTONCES
  conteo_items = 5
  estado_completado = "verdadero"
  Log "Consulta de compras exitosa"
SINO
  SI consulta_tipo == "gastos" ENTONCES
    total_estimado = 280
    limite_excedido = "falso"
    Log "Consulta de gastos exitosa"
  SINO
    SI consulta_tipo == "contactos" ENTONCES
      total_contactos = 12
      Log "Consulta de contactos exitosa"
    SINO
      error_consulta = "verdadero"
      Log "Error: Tipo de consulta no identificado"
    FIN_SI
  FIN_SI
FIN_SI`,
      solutionKeywords: ["conteo_items", "total_estimado", "total_contactos", "error_consulta"]
    }
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
