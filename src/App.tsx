import { useState, useEffect, useRef } from "react";
import { 
  Brain, 
  BookOpen, 
  Code, 
  Terminal, 
  Award, 
  HelpCircle, 
  RotateCcw, 
  CheckCircle, 
  Lock, 
  Sparkles, 
  Trophy, 
  Play, 
  FileText, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  BookOpenCheck,
  User,
  ExternalLink,
  Save,
  LineChart as LineIcon,
  TrendingUp,
  Calendar,
  LogIn,
  UserPlus,
  LogOut,
  Shield,
  Trash2,
  Database,
  UserCheck,
  Plus,
  Sliders,
  Edit,
  Settings
} from "lucide-react";
import { CURRICULUM, GENERAL_PATH_STEPS } from "./curriculum";
import { runPseudocode } from "./utils/interpreter";
import { PathStep, QuizQuestion, Phase, Lesson, StepType } from "./types";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface CustomConfirmConfig {
  title: string;
  message: string;
  onConfirm: () => void;
  isDanger?: boolean;
}

interface CustomAlertConfig {
  title: string;
  message: string;
}

export default function App() {
  // Gestión de Estado Centralizada (Solicitado por el usuario)
  const [alumnoActual, setAlumnoActual] = useState<string | null>(() => {
    return localStorage.getItem("adult_mentor_current_user") || null;
  });

  const prevUserRef = useRef<string | null>(alumnoActual);
  useEffect(() => {
    prevUserRef.current = alumnoActual;
  }, [alumnoActual]);

  const [listaAlumnos, setListaAlumnos] = useState<{ username: string; name: string; pin: string }[]>(() => {
    const saved = localStorage.getItem("adult_mentor_registered_users");
    let users = saved ? JSON.parse(saved) : [
      { username: "admin", name: "Admin (Administrador)", pin: "1104" },
      { username: "Alberto", name: "Alberto", pin: "1234" },
      { username: "Beatriz", name: "Beatriz", pin: "1234" }
    ];
    
    // Ensure "admin" account with pin "1104" is registered and enabled
    const adminIndex = users.findIndex((u: any) => u.username.toLowerCase() === "admin");
    if (adminIndex === -1) {
      users.unshift({ username: "admin", name: "Admin (Administrador)", pin: "1104" });
    } else {
      // Force PIN to 1104 to be absolutely sure
      users = users.map((u: any) => u.username.toLowerCase() === "admin" ? { ...u, pin: "1104", name: u.name || "Admin (Administrador)" } : u);
    }
    
    localStorage.setItem("adult_mentor_registered_users", JSON.stringify(users));
    return users;
  });

  const [estacionesCompletadas, setEstacionesCompletadas] = useState<string[]>(() => {
    // Intentar leer para el alumno actual
    const active = localStorage.getItem("adult_mentor_current_user");
    if (active) {
      const saved = localStorage.getItem(`adult_mentor_completed_steps_${active}`);
      return saved ? JSON.parse(saved) : [];
    }
    const saved = localStorage.getItem("adult_mentor_completed_steps");
    return saved ? JSON.parse(saved) : [];
  });

  // Mapeos de compatibilidad con las variables existentes de la app
  const currentUser = alumnoActual;
  const setCurrentUser = setAlumnoActual;
  const registeredUsers = listaAlumnos;
  const setRegisteredUsers = setListaAlumnos;
  const completedStepIds = estacionesCompletadas;
  const setCompletedStepIds = setEstacionesCompletadas;

  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [loginUsername, setLoginUsername] = useState<string>("");
  const [loginPin, setLoginPin] = useState<string>("");
  const [registerUsername, setRegisterUsername] = useState<string>("");
  const [registerName, setRegisterName] = useState<string>("");
  const [registerPin, setRegisterPin] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);

  // States for prompt PIN verification of quick access profiles
  const [profileForPinPrompt, setProfileForPinPrompt] = useState<{ username: string; name: string; pin: string } | null>(null);
  const [promptPinInput, setPromptPinInput] = useState<string>("");
  const [promptPinError, setPromptPinError] = useState<string | null>(null);

  // Custom alert and confirm overlay states
  const [customConfirm, setCustomConfirm] = useState<CustomConfirmConfig | null>(null);
  const [customAlert, setCustomAlert] = useState<CustomAlertConfig | null>(null);

  const showConfirm = (title: string, message: string, onConfirm: () => void, isDanger = false) => {
    setCustomConfirm({ title, message, onConfirm, isDanger });
  };

  const showAlert = (title: string, message: string) => {
    setCustomAlert({ title, message });
  };

  // Admin section states
  const [adminNewName, setAdminNewName] = useState<string>("");
  const [adminNewUsername, setAdminNewUsername] = useState<string>("");
  const [adminNewPin, setAdminNewPin] = useState<string>("");

  // Account editing state
  const [editingUsernameForPin, setEditingUsernameForPin] = useState<string | null>(null);
  const [editingPinValue, setEditingPinValue] = useState<string>("");
  const [editingNameValue, setEditingNameValue] = useState<string>("");

  // Advanced CMS Admin Tab Sub-state
  const [adminSubTab, setAdminSubTab] = useState<"stations" | "lessons">("stations");

  // Logic Station editor state
  const [selectedStationIdForForm, setSelectedStationIdForForm] = useState<string>("new");
  const [stationFormId, setStationFormId] = useState("");
  const [stationFormLabel, setStationFormLabel] = useState("");
  const [stationFormType, setStationFormType] = useState<StepType>("phase_module");
  const [stationFormDesc, setStationFormDesc] = useState("");
  const [stationFormLearn, setStationFormLearn] = useState("");
  const [stationFormPractice, setStationFormPractice] = useState("");
  const [stationFormEval, setStationFormEval] = useState("");
  const [stationFormUnlock, setStationFormUnlock] = useState("");
  const [stationFormPhaseId, setStationFormPhaseId] = useState("");

  // Lessons editor state
  const [selectedPhaseIdForLessonAdmin, setSelectedPhaseIdForLessonAdmin] = useState("phase_1");
  const [selectedLessonIdForForm, setSelectedLessonIdForForm] = useState<string>("new");
  const [lessonFormId, setLessonFormId] = useState("");
  const [lessonFormTitle, setLessonFormTitle] = useState("");
  const [lessonFormSubtitle, setLessonFormSubtitle] = useState("");
  const [lessonFormType, setLessonFormType] = useState<"concept" | "logic_exercise" | "python_primer">("concept");
  const [lessonFormContent, setLessonFormContent] = useState("");
  const [lessonFormSnippet, setLessonFormSnippet] = useState("");
  const [lessonFormExpectedOutput, setLessonFormExpectedOutput] = useState("");
  const [lessonFormGoal, setLessonFormGoal] = useState("");

  // Persistence state
  const [studentName, setStudentName] = useState<string>(() => {
    const active = localStorage.getItem("adult_mentor_current_user");
    if (active) {
      return localStorage.getItem(`adult_mentor_name_${active}`) || active;
    }
    return localStorage.getItem("adult_mentor_name") || "Alberto";
  });

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    const active = localStorage.getItem("adult_mentor_current_user");
    if (active) {
      const saved = localStorage.getItem(`adult_mentor_completed_lessons_${active}`);
      return saved ? JSON.parse(saved) : [];
    }
    const saved = localStorage.getItem("adult_mentor_completed_lessons");
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    const active = localStorage.getItem("adult_mentor_current_user");
    if (active?.toLowerCase() === "admin") {
      return true;
    }
    return localStorage.getItem("adult_mentor_admin_mode") === "true";
  });

  const [pathSteps, setPathSteps] = useState<PathStep[]>(() => {
    const saved = localStorage.getItem("adult_mentor_path_steps");
    return saved ? JSON.parse(saved) : GENERAL_PATH_STEPS;
  });

  const [curriculum, setCurriculum] = useState<Phase[]>(() => {
    const saved = localStorage.getItem("adult_mentor_curriculum");
    return saved ? JSON.parse(saved) : CURRICULUM;
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    const active = localStorage.getItem("adult_mentor_current_user");
    if (active) {
      return localStorage.getItem(`adult_mentor_active_tab_${active}`) || "camino";
    }
    return localStorage.getItem("adult_mentor_active_tab") || "camino";
  });

  const [textSize, setTextSize] = useState<"normal" | "grande" | "muyGrande">(() => {
    const active = localStorage.getItem("adult_mentor_current_user");
    if (active) {
      return (localStorage.getItem(`adult_mentor_text_size_${active}`) as any) || "grande";
    }
    return (localStorage.getItem("adult_mentor_text_size") as any) || "normal";
  });

  // Active Lesson Context
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>("phase_1");
  const [selectedLessonIdx, setSelectedLessonIdx] = useState<number>(0);

  // Playground workspace variables
  const [playgroundCode, setPlaygroundCode] = useState<string>(`// Control de Riego para el Patio
temperatura = 28
humedad = 15
riego_activo = falso

SI temperatura > 25 Y humedad < 20 ENTONCES
  riego_activo = verdadero
  Log "Activando surtidores: temperatura abrasadora detectada"
SINO
  riego_activo = falso
  Log "Surtidores apagados"
FIN_SI`);

  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [simulationVariables, setSimulationVariables] = useState<{ [key: string]: any }>({});
  const [runningError, setRunningError] = useState<string | null>(null);

  // Active Lesson simulation terminal
  const [lessonCode, setLessonCode] = useState<string>("");
  const [lessonLogs, setLessonLogs] = useState<string[]>([]);
  const [lessonVars, setLessonVars] = useState<{ [key: string]: any }>({});
  const [lessonSuccess, setLessonSuccess] = useState<boolean>(false);
  const [lessonError, setLessonError] = useState<string | null>(null);

  // Examen theoretical answers
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<{ [questionId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizPassed, setQuizPassed] = useState<boolean>(false);

  // Reto Práctico (Project) variable code
  const [projectCode, setProjectCode] = useState<string>("");
  const [projectLogs, setProjectLogs] = useState<string[]>([]);
  const [projectSuccess, setProjectSuccess] = useState<boolean>(false);
  const [projectError, setProjectError] = useState<string | null>(null);

  // Notebook annotations/notes
  const [studentNotes, setStudentNotes] = useState<string>(() => {
    const active = localStorage.getItem("adult_mentor_current_user");
    const defaultNotes = `Mis anotaciones de hoy:
- Los algoritmos son simplemente órdenes en secuencia para la computadora.
- El condicional 'SI' funciona igual que mi toma de decisiones diarias (si llueve, salgo con paraguas).
- Un bucle infinito se previene modificando la variable de control dentro del cuerpo repetitivo.`;
    if (active) {
      return localStorage.getItem(`adult_mentor_notes_${active}`) || defaultNotes;
    }
    return localStorage.getItem("adult_mentor_notes") || defaultNotes;
  });

  const [notesSaveStatus, setNotesSaveStatus] = useState<boolean>(false);

  // Unlocked badge celebration modal state
  const [unlockedBadgeName, setUnlockedBadgeName] = useState<string | null>(null);

  // Curriculum timeline completion timestamps
  const [completionDates, setCompletionDates] = useState<{ [stepId: string]: string }>(() => {
    const active = localStorage.getItem("adult_mentor_current_user");
    const dateThreeDaysAgo = new Date();
    dateThreeDaysAgo.setDate(dateThreeDaysAgo.getDate() - 3);
    const defaultDates = {
      step_start: dateThreeDaysAgo.toISOString().split('T')[0]
    };
    if (active) {
      const saved = localStorage.getItem(`adult_mentor_completed_dates_${active}`);
      return saved ? JSON.parse(saved) : defaultDates;
    }
    const saved = localStorage.getItem("adult_mentor_completed_dates");
    return saved ? JSON.parse(saved) : defaultDates;
  });

  // Keep completion dates synchronized and backdate appropriately for beautiful rendering
  useEffect(() => {
    if (prevUserRef.current !== currentUser) {
      return;
    }
    const todayStr = new Date().toISOString().split('T')[0];
    let changed = false;
    const updated = { ...completionDates };
    
    // Remove dates for IDs that are no longer completed
    Object.keys(updated).forEach(id => {
      if (!completedStepIds.includes(id)) {
        delete updated[id];
        changed = true;
      }
    });

    // Add dates for newly completed IDs
    completedStepIds.forEach(id => {
      if (!updated[id]) {
        const idx = pathSteps.findIndex(s => s.id === id);
        if (idx >= 0) {
          const dateOffset = 5 - idx;
          const simulatedDate = new Date();
          simulatedDate.setDate(simulatedDate.getDate() - (dateOffset > 0 ? dateOffset : 0));
          updated[id] = simulatedDate.toISOString().split('T')[0];
        } else {
          updated[id] = todayStr;
        }
        changed = true;
      }
    });

    if (changed) {
      setCompletionDates(updated);
      if (currentUser) {
        localStorage.setItem(`adult_mentor_completed_dates_${currentUser}`, JSON.stringify(updated));
      } else {
        localStorage.setItem("adult_mentor_completed_dates", JSON.stringify(updated));
      }
    }
  }, [completedStepIds, currentUser]);

  // Synchronize localStorage
  useEffect(() => {
    if (prevUserRef.current !== currentUser) {
      return;
    }
    if (currentUser) {
      localStorage.setItem(`adult_mentor_name_${currentUser}`, studentName);
    } else {
      localStorage.setItem("adult_mentor_name", studentName);
    }
  }, [studentName, currentUser]);

  useEffect(() => {
    if (prevUserRef.current !== currentUser) {
      return;
    }
    if (currentUser) {
      localStorage.setItem(`adult_mentor_completed_steps_${currentUser}`, JSON.stringify(completedStepIds));
    } else {
      localStorage.setItem("adult_mentor_completed_steps", JSON.stringify(completedStepIds));
    }
  }, [completedStepIds, currentUser]);

  useEffect(() => {
    if (prevUserRef.current !== currentUser) {
      return;
    }
    if (currentUser) {
      localStorage.setItem(`adult_mentor_completed_lessons_${currentUser}`, JSON.stringify(completedLessonIds));
    } else {
      localStorage.setItem("adult_mentor_completed_lessons", JSON.stringify(completedLessonIds));
    }
  }, [completedLessonIds, currentUser]);

  useEffect(() => {
    localStorage.setItem("adult_mentor_admin_mode", String(isAdminMode));
  }, [isAdminMode]);

  useEffect(() => {
    localStorage.setItem("adult_mentor_path_steps", JSON.stringify(pathSteps));
  }, [pathSteps]);

  useEffect(() => {
    localStorage.setItem("adult_mentor_curriculum", JSON.stringify(curriculum));
  }, [curriculum]);

  useEffect(() => {
    localStorage.setItem("adult_mentor_registered_users", JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    if (prevUserRef.current !== currentUser) {
      return;
    }
    if (currentUser) {
      localStorage.setItem(`adult_mentor_active_tab_${currentUser}`, activeTab);
    } else {
      localStorage.setItem("adult_mentor_active_tab", activeTab);
    }
  }, [activeTab, currentUser]);

  useEffect(() => {
    if (prevUserRef.current !== currentUser) {
      return;
    }
    if (currentUser) {
      localStorage.setItem(`adult_mentor_text_size_${currentUser}`, textSize);
    } else {
      localStorage.setItem("adult_mentor_text_size", textSize);
    }
  }, [textSize, currentUser]);

  // Set default lesson code when selecting phases
  useEffect(() => {
    const phase = curriculum.find(p => p.id === selectedPhaseId);
    if (phase && phase.lessons[selectedLessonIdx]) {
      setLessonCode(phase.lessons[selectedLessonIdx].codeSnippet || "");
      setLessonLogs([]);
      setLessonVars({});
      setLessonSuccess(false);
      setLessonError(null);
    }
  }, [selectedPhaseId, selectedLessonIdx, curriculum]);

  // Set default project starter code
  useEffect(() => {
    const projectStep = pathSteps.find(s => s.type === "phase_project" && s.phaseId === selectedPhaseId);
    if (projectStep?.projectTemplate) {
      setProjectCode(projectStep.projectTemplate.starterCode);
      setProjectLogs([]);
      setProjectSuccess(false);
      setProjectError(null);
    }
  }, [pathSteps, selectedPhaseId]);

  // Text Sizes utilities for elegant sizing multiplier
  const getFontSizeClass = (type: "title" | "subtitle" | "body" | "code") => {
    if (type === "title") {
      if (textSize === "grande") return "text-2xl md:text-3xl font-bold tracking-tight font-display";
      if (textSize === "muyGrande") return "text-3xl md:text-4xl font-extrabold tracking-tight font-display";
      return "text-xl md:text-2xl font-bold tracking-tight font-display";
    }
    if (type === "subtitle") {
      if (textSize === "grande") return "text-lg md:text-xl font-medium text-slate-300";
      if (textSize === "muyGrande") return "text-xl md:text-2xl font-semibold text-slate-200";
      return "text-base md:text-lg font-normal text-slate-400";
    }
    if (type === "body") {
      if (textSize === "grande") return "text-lg text-slate-250 leading-relaxed";
      if (textSize === "muyGrande") return "text-xl text-slate-200 leading-relaxed font-semibold";
      return "text-sm md:text-base text-slate-300 leading-relaxed";
    }
    // Code monospace sizing
    if (textSize === "grande") return "text-sm font-medium font-mono";
    if (textSize === "muyGrande") return "text-base font-bold font-mono";
    return "text-xs font-normal font-mono";
  };

  // Cálculo Reactivo del Progreso (Solicitado por el usuario)
  // Fórmula: Progreso % = (Estaciones Checkeadas / Total de Estaciones Activas) * 100
  const totalPathSteps = pathSteps.length;
  // Filtramos las estaciones completadas que se encuentren activas en pathSteps
  const estacionesCheckeadasCount = completedStepIds.filter(id => pathSteps.some(step => step.id === id)).length;
  const overallPercentage = totalPathSteps > 0
    ? Math.min(100, Math.round((estacionesCheckeadasCount / totalPathSteps) * 100))
    : 0;
  const porcentajeProgreso = overallPercentage;

  // Generate completion rate timeline for Recharts line chart
  const getCompletionRateOverTime = () => {
    const dataPoints = [];
    const today = new Date();
    
    // Generate data starting from 6 days ago up to today (7 data points)
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      
      // Determine how many steps were completed on or before this day
      const completedOnOrBefore = pathSteps.filter(step => {
        const compDate = completionDates[step.id];
        return compDate && compDate <= dateStr;
      });
      
      const count = completedOnOrBefore.length;
      const percentage = Math.round((count / totalPathSteps) * 100);
      
      // Format label (e.g., "24 May")
      const formattedDate = d.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
      });
      
      dataPoints.push({
        fecha: formattedDate,
        "Avance Real (%)": percentage,
        "Meta Recomendada (%)": Math.min(100, Math.round(((7 - i) / 7) * 100)),
      });
    }
    return dataPoints;
  };

  const getStepStatus = (step: PathStep) => {
    const isCompleted = completedStepIds.includes(step.id);
    if (isAdminMode) {
      return { state: isCompleted ? "completed" as const : "active" as const };
    }
    // Find previous step to check if unlocked
    const currentIdx = pathSteps.findIndex(s => s.id === step.id);
    if (currentIdx === 0) {
      return { state: isCompleted ? "completed" : "active" as const };
    }
    const prevStep = pathSteps[currentIdx - 1];
    const prevCompleted = completedStepIds.includes(prevStep.id);
    
    if (isCompleted) return { state: "completed" as const };
    if (prevCompleted) return { state: "active" as const };
    return { state: "locked" as const };
  };



  const handleStepClick = (stepId: string) => {
    const step = pathSteps.find(s => s.id === stepId);
    if (!step) return;

    const status = getStepStatus(step);
    if (status.state === "locked") return;

    // Route tab properly
    if (step.type === "start") {
      setActiveTab("camino");
    } else if (step.type === "phase_module" && step.phaseId) {
      setSelectedPhaseId(step.phaseId);
      setSelectedLessonIdx(0);
      setActiveTab("modulo");
    } else if (step.type === "phase_eval") {
      setActiveTab("taller"); // Go to active evaluation
      // Setup phase id for evaluation reference
      if (step.phaseId) {
        setSelectedPhaseId(step.phaseId);
      }
      // Find the eval element to show
      const element = document.getElementById("evaluation-quiz-panel");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else if (step.type === "phase_project") {
      setActiveTab("taller");
      // Setup phase id for project reference to ensure correctly loaded
      if (step.phaseId) {
        setSelectedPhaseId(step.phaseId);
      }
      // Find project element to show
      const element = document.getElementById("project-test-panel");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else if (step.type === "finish") {
      setActiveTab("progreso");
    }
  };

  // Execute playground pseudocode
  const handleRunPlayground = () => {
    try {
      setRunningError(null);
      const res = runPseudocode(playgroundCode);
      setTerminalOutput(res.logs.length > 0 ? res.logs : ["Simulación vacía. No se imprimió nada."]);
      setSimulationVariables(res.variables);
      if (!res.success) {
        setRunningError(res.error || "Ocurrió un error en la simulación lógica.");
      }
    } catch (e: any) {
      setRunningError(e.message || "Error al interpretar.");
    }
  };

  // Execute currently active lesson pseudocode
  const handleRunLesson = () => {
    try {
      setLessonError(null);
      const activePhase = curriculum.find(p => p.id === selectedPhaseId);
      const activeLesson = activePhase?.lessons[selectedLessonIdx];
      if (!activeLesson) return;

      const res = runPseudocode(lessonCode);
      setLessonLogs(res.logs);
      setLessonVars(res.variables);

      if (!res.success) {
        setLessonError(res.error || "Error de ejecución");
        setLessonSuccess(false);
        return;
      }

      // Validate targets condition
      let goalSucceeded = true;
      if (activeLesson.expectedOutput) {
        const containsOutputCheck = res.logs.join("\n").toLowerCase().includes(activeLesson.expectedOutput.toLowerCase());
        if (!containsOutputCheck) goalSucceeded = false;
      }

      if (activeLesson.expectedVariables) {
        for (const [key, expectedVal] of Object.entries(activeLesson.expectedVariables)) {
          // Compare as strings to tolerate true/false types
          if (String(res.variables[key]).toLowerCase() !== String(expectedVal).toLowerCase()) {
            goalSucceeded = false;
          }
        }
      }

      setLessonSuccess(goalSucceeded);
    } catch (e: any) {
      setLessonError(e.message || "Error al procesar la lógica de la lección.");
      setLessonSuccess(false);
    }
  };

  const handleCompleteActiveLesson = () => {
    // Check if there's a corresponding step in path for this phase
    const pathStep = pathSteps.find(s => s.phaseId === selectedPhaseId && s.type === "phase_module");
    if (!pathStep) return;

    // Promote step completion
    if (!completedStepIds.includes(pathStep.id)) {
      setCompletedStepIds(prev => [...prev, pathStep.id]);
    }
    
    // Auto proceed to next or route back to RoadMap
    setActiveTab("camino");
    // Celebrate
    setUnlockedBadgeName(curriculum.find(p => p.id === selectedPhaseId)?.badgeName || "Fase Completada");
  };

  // Evaluation Quiz checker
  const handleQuizAnswerSelect = (questionId: string, idx: number) => {
    setSelectedQuizAnswers(prev => ({
      ...prev,
      [questionId]: idx
    }));
  };

  const handleSubmitQuiz = (questions: QuizQuestion[], phaseId: string) => {
    let allCorrect = true;
    for (const q of questions) {
      if (selectedQuizAnswers[q.id] !== q.correctAnswerIndex) {
        allCorrect = false;
      }
    }
    
    setQuizSubmitted(true);
    setQuizPassed(allCorrect);

    if (allCorrect) {
      // Unlock evaluation step in path
      const evalStep = pathSteps.find(s => s.phaseId === phaseId && s.type === "phase_eval");
      if (evalStep && !completedStepIds.includes(evalStep.id)) {
        setCompletedStepIds(prev => [...prev, evalStep.id]);
        
        // Find corresponding badge to celebrate
        const phase = curriculum.find(p => p.id === phaseId);
        if (phase) {
          setUnlockedBadgeName(phase.badgeName);
        }
      }
    }
  };

  // Project code verification trigger
  const handleRunProject = (keywords: string[]) => {
    try {
      setProjectError(null);
      const res = runPseudocode(projectCode);
      setProjectLogs(res.logs);

      if (!res.success) {
        setProjectError(res.error || "Ocurrió un error.");
        setProjectSuccess(false);
        return;
      }

      // Check keywords inside code and outputs
      let matchedAll = true;
      const flatVariablesAndLogs = JSON.stringify(res.variables) + res.logs.join(" ");
      for (const keyword of keywords) {
        if (!flatVariablesAndLogs.toLowerCase().includes(keyword.toLowerCase()) && !projectCode.toLowerCase().includes(keyword.toLowerCase())) {
          matchedAll = false;
        }
      }

      setProjectSuccess(matchedAll);
    } catch (e: any) {
      setProjectError(e.message || "Fallo en compilación interna.");
      setProjectSuccess(false);
    }
  };

  const handleCompleteProject = (stepId: string, badgeName: string) => {
    if (!completedStepIds.includes(stepId)) {
      setCompletedStepIds(prev => [...prev, stepId]);
      setUnlockedBadgeName(badgeName);
    }
    setActiveTab("camino");
  };

  const handleSaveNotes = () => {
    if (currentUser) {
      localStorage.setItem(`adult_mentor_notes_${currentUser}`, studentNotes);
    } else {
      localStorage.setItem("adult_mentor_notes", studentNotes);
    }
    setNotesSaveStatus(true);
    setTimeout(() => {
      setNotesSaveStatus(false);
    }, 2000);
  };

  const handleResetCourse = () => {
    showConfirm(
      "Reiniciar Progreso de Curso",
      "¿Seguro que deseas borrar tu progreso actual del cuaderno para comenzar desde cero?",
      () => {
        const active = currentUser || "Alberto";
        localStorage.removeItem(`adult_mentor_completed_steps_${active}`);
        localStorage.removeItem(`adult_mentor_completed_dates_${active}`);
        localStorage.removeItem(`adult_mentor_notes_${active}`);
        localStorage.removeItem(`adult_mentor_name_${active}`);
        localStorage.removeItem(`adult_mentor_active_tab_${active}`);
        localStorage.removeItem(`adult_mentor_text_size_${active}`);

        localStorage.removeItem("adult_mentor_completed_steps");
        localStorage.removeItem("adult_mentor_completed_dates");
        localStorage.removeItem("adult_mentor_notes");
        localStorage.removeItem("adult_mentor_name");
        localStorage.removeItem("adult_mentor_active_tab");
        localStorage.removeItem("adult_mentor_text_size");

        setCompletedStepIds([]);
        setCompletionDates({});
        setStudentName(currentUser || "Alberto");
        setSelectedQuizAnswers({});
        setQuizSubmitted(false);
        setQuizPassed(false);
        setSelectedPhaseId("phase_1");
        setSelectedLessonIdx(0);
        setActiveTab("camino");
        setStudentNotes(`Mis anotaciones de hoy:
- Los algoritmos son simplemente órdenes en secuencia para la computadora.
- El condicional 'SI' funciona igual que mi toma de decisiones diarias (si llueve, salgo con paraguas).
- Un bucle infinito se previene modificando la variable de control dentro del cuerpo repetitivo.`);
        
        showAlert("Progreso Reiniciado", "¡Todo tu progreso y cuaderno han sido limpiados con éxito! Puedes iniciar el camino desde cero.");
      }
    );
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerUsername.trim() || !registerName.trim() || !registerPin.trim()) {
      setAuthError("Por favor, rellena todos los campos.");
      return;
    }

    const cleanUsername = registerUsername.trim().toLowerCase();
    const userExists = registeredUsers.some(u => u.username.toLowerCase() === cleanUsername);
    if (userExists) {
      setAuthError("Este nombre de usuario ya existe. Intenta con otro o inicia sesión.");
      return;
    }

    const newUser = {
      username: registerUsername.trim(),
      name: registerName.trim(),
      pin: registerPin.trim()
    };

    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem("adult_mentor_registered_users", JSON.stringify(updatedUsers));

    // Initialize all progress fields in localStorage as empty/clean for this new user
    localStorage.setItem(`adult_mentor_name_${newUser.username}`, newUser.name);
    localStorage.setItem(`adult_mentor_completed_steps_${newUser.username}`, JSON.stringify([]));
    localStorage.setItem(`adult_mentor_active_tab_${newUser.username}`, "camino");
    localStorage.setItem(`adult_mentor_text_size_${newUser.username}`, "grande"); // Encourage grande for accessibility
    localStorage.setItem(`adult_mentor_notes_${newUser.username}`, `Mis anotaciones de hoy:
- Los algoritmos son simplemente órdenes en secuencia para la computadora.
- El condicional 'SI' funciona igual que mi toma de decisiones diarias (si llueve, salgo con paraguas).
- Un bucle infinito se previene modificando la variable de control dentro del cuerpo repetitivo.`);
    
    localStorage.setItem(`adult_mentor_completed_dates_${newUser.username}`, JSON.stringify({}));

    // Reset current active memory states
    setStudentName(newUser.name);
    setCompletedStepIds([]);
    setActiveTab("camino");
    setTextSize("grande");
    setStudentNotes(`Mis anotaciones de hoy:
- Los algoritmos son simplemente órdenes en secuencia para la computadora.
- El condicional 'SI' funciona igual que mi toma de decisiones diarias (si llueve, salgo con paraguas).
- Un bucle infinito se previene modificando la variable de control dentro del cuerpo repetitivo.`);
    setCompletionDates({});
    setSelectedQuizAnswers({});
    setQuizSubmitted(false);
    setQuizPassed(false);
    setSelectedPhaseId("phase_1");
    setSelectedLessonIdx(0);

    // Login
    localStorage.setItem("adult_mentor_current_user", newUser.username);
    setCurrentUser(newUser.username);
    setAuthError(null);
    setRegisterUsername("");
    setRegisterName("");
    setRegisterPin("");
  };

  const handleLogin = (e?: React.FormEvent, directUser?: typeof registeredUsers[0]) => {
    if (e) e.preventDefault();
    
    const targetUsername = directUser ? directUser.username : loginUsername.trim();
    const targetPin = directUser ? directUser.pin : loginPin.trim();

    if (!targetUsername) {
      setAuthError("Por favor, ingresa el nombre de usuario.");
      return;
    }

    const matchedUser = registeredUsers.find(
      u => u.username.toLowerCase() === targetUsername.toLowerCase()
    );

    if (!matchedUser) {
      setAuthError("Usuario no encontrado. Registra una cuenta nueva.");
      return;
    }

    if (matchedUser.pin !== targetPin) {
      setAuthError("Código PIN incorrecto. Inténtalo de nuevo (el PIN de demostración es 1234).");
      return;
    }

    // Correct login - restore states
    localStorage.setItem("adult_mentor_current_user", matchedUser.username);
    setCurrentUser(matchedUser.username);

    // Dynamic Admin activation if account is 'admin'
    if (matchedUser.username.toLowerCase() === "admin") {
      setIsAdminMode(true);
      localStorage.setItem("adult_mentor_admin_mode", "true");
    }
    
    // Load state
    const nameKey = `adult_mentor_name_${matchedUser.username}`;
    const stepsKey = `adult_mentor_completed_steps_${matchedUser.username}`;
    const tabKey = `adult_mentor_active_tab_${matchedUser.username}`;
    const sizeKey = `adult_mentor_text_size_${matchedUser.username}`;
    const notesKey = `adult_mentor_notes_${matchedUser.username}`;
    const datesKey = `adult_mentor_completed_dates_${matchedUser.username}`;

    setStudentName(localStorage.getItem(nameKey) || matchedUser.name);
    
    const savedSteps = localStorage.getItem(stepsKey);
    setCompletedStepIds(savedSteps ? JSON.parse(savedSteps) : []);
    
    setActiveTab(localStorage.getItem(tabKey) || "camino");
    setTextSize((localStorage.getItem(sizeKey) as any) || "grande");
    
    const defaultNotes = `Mis anotaciones de hoy:
- Los algoritmos son simplemente órdenes en secuencia para la computadora.
- El condicional 'SI' funciona igual que mi toma de decisiones diarias (si llueve, salgo con paraguas).
- Un bucle infinito se previene modificando la variable de control dentro del cuerpo repetitivo.`;
    setStudentNotes(localStorage.getItem(notesKey) || defaultNotes);
    
    const savedDates = localStorage.getItem(datesKey);
    setCompletionDates(savedDates ? JSON.parse(savedDates) : {});

    setAuthError(null);
    setLoginUsername("");
    setLoginPin("");
  };

  const handleLogout = () => {
    localStorage.removeItem("adult_mentor_current_user");
    setCurrentUser(null);
    setIsAdminMode(false);
    localStorage.removeItem("adult_mentor_admin_mode");
    setActiveTab("camino");
  };

  const handleAcceder = (alumno: { username: string; name: string; pin: string }) => {
    handleLogin(undefined, alumno);
  };

  const handleAccederClick = (alumno: { username: string; name: string; pin: string }) => {
    setProfileForPinPrompt(alumno);
    setPromptPinInput("");
    setPromptPinError(null);
  };

  const handleVerifyProfilePin = (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!profileForPinPrompt) return;
    
    if (promptPinInput.trim() !== profileForPinPrompt.pin) {
      setPromptPinError("PIN de acceso incorrecto. Por favor, vuelve a intentarlo.");
      return;
    }

    // Success login
    handleLogin(undefined, profileForPinPrompt);
    setProfileForPinPrompt(null);
    setPromptPinInput("");
    setPromptPinError(null);
  };

  const toggleEstacion = (estacionId: string) => {
    if (estacionesCompletadas.includes(estacionId)) {
      if (estacionesCompletadas.length > 1 || estacionId !== "step_start") {
        const updated = estacionesCompletadas.filter(id => id !== estacionId);
        setEstacionesCompletadas(updated);
        if (currentUser) {
          localStorage.setItem(`adult_mentor_completed_steps_${currentUser}`, JSON.stringify(updated));
        } else {
          localStorage.setItem("adult_mentor_completed_steps", JSON.stringify(updated));
        }
      }
    } else {
      const updated = [...estacionesCompletadas, estacionId];
      setEstacionesCompletadas(updated);
      const todayStr = new Date().toISOString().split('T')[0];
      setCompletionDates(prev => {
        const next = { ...prev, [estacionId]: todayStr };
        if (currentUser) {
          localStorage.setItem(`adult_mentor_completed_dates_${currentUser}`, JSON.stringify(next));
        } else {
          localStorage.setItem("adult_mentor_completed_dates", JSON.stringify(next));
        }
        return next;
      });
      if (currentUser) {
        localStorage.setItem(`adult_mentor_completed_steps_${currentUser}`, JSON.stringify(updated));
      } else {
        localStorage.setItem("adult_mentor_completed_steps", JSON.stringify(updated));
      }
    }
  };

  const handleDeleteUser = (usernameToDelete: string) => {
    showConfirm(
      "Eliminar Estudiante",
      `¿Estás seguro de que deseas eliminar permanentemente la cuenta de "${usernameToDelete}"? Se borrarán sus datos, apuntes e insignias.`,
      () => {
        const remainingUsers = registeredUsers.filter(u => u.username !== usernameToDelete);
        setRegisteredUsers(remainingUsers);
        localStorage.setItem("adult_mentor_registered_users", JSON.stringify(remainingUsers));
        
        // Clean up localstorage associated keys
        localStorage.removeItem(`adult_mentor_name_${usernameToDelete}`);
        localStorage.removeItem(`adult_mentor_completed_steps_${usernameToDelete}`);
        localStorage.removeItem(`adult_mentor_completed_dates_${usernameToDelete}`);
        localStorage.removeItem(`adult_mentor_completed_lessons_${usernameToDelete}`);
        localStorage.removeItem(`adult_mentor_notes_${usernameToDelete}`);
        localStorage.removeItem(`adult_mentor_active_tab_${usernameToDelete}`);
        localStorage.removeItem(`adult_mentor_text_size_${usernameToDelete}`);
        
        if (currentUser === usernameToDelete) {
          handleLogout();
        }
      },
      true
    );
  };

  const handleAdminCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminNewName.trim() || !adminNewUsername.trim() || !adminNewPin.trim()) {
      alert("Por favor, rellene todos los campos para crear al alumno.");
      return;
    }
    
    const cleanUsername = adminNewUsername.trim().toLowerCase();
    if (registeredUsers.some(u => u.username.toLowerCase() === cleanUsername)) {
      alert("Este nombre de usuario ya existe en el sistema.");
      return;
    }

    const newUser = {
      username: adminNewUsername.trim(),
      name: adminNewName.trim(),
      pin: adminNewPin.trim()
    };

    const updated = [...registeredUsers, newUser];
    setRegisteredUsers(updated);
    localStorage.setItem("adult_mentor_registered_users", JSON.stringify(updated));

    // Default student states in localStorage
    localStorage.setItem(`adult_mentor_name_${newUser.username}`, newUser.name);
    localStorage.setItem(`adult_mentor_completed_steps_${newUser.username}`, JSON.stringify([]));
    localStorage.setItem(`adult_mentor_active_tab_${newUser.username}`, "camino");
    localStorage.setItem(`adult_mentor_text_size_${newUser.username}`, "grande");
    localStorage.setItem(`adult_mentor_notes_${newUser.username}`, `Mis anotaciones iniciales:
- Los algoritmos solucionan problemas de la vida cotidiana de forma secuencial.`);
    
    localStorage.setItem(`adult_mentor_completed_dates_${newUser.username}`, JSON.stringify({}));

    setAdminNewName("");
    setAdminNewUsername("");
    setAdminNewPin("");
    alert(`Estudiante "${newUser.name}" registrado con éxito.`);
  };

  const handleUpdateUserPinAndName = (username: string) => {
    if (!editingNameValue.trim() || !editingPinValue.trim()) {
      alert("Introduce un nombre y PIN de acceso válidos.");
      return;
    }
    const updated = registeredUsers.map(u => {
      if (u.username.toLowerCase() === username.toLowerCase()) {
        return { ...u, name: editingNameValue.trim(), pin: editingPinValue.trim() };
      }
      return u;
    });
    setRegisteredUsers(updated);
    localStorage.setItem("adult_mentor_registered_users", JSON.stringify(updated));
    localStorage.setItem(`adult_mentor_name_${username}`, editingNameValue.trim());
    if (currentUser?.toLowerCase() === username.toLowerCase()) {
      setStudentName(editingNameValue.trim());
    }
    setEditingUsernameForPin(null);
    alert("Usuario actualizado de inmediato con enlace reactivo.");
  };

  const handleSaveStation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stationFormId.trim() || !stationFormLabel.trim() || !stationFormDesc.trim()) {
      alert("Por favor rellene el identificador, la etiqueta y descripción mínimo.");
      return;
    }

    const newStep: PathStep = {
      id: stationFormId.trim(),
      label: stationFormLabel.trim(),
      type: stationFormType,
      description: stationFormDesc.trim(),
      whatYouWillLearn: stationFormLearn.trim() || "Comprensión algorítmica secuencial.",
      practiceToRealize: stationFormPractice.trim() || "Analizar el caso práctico e ingresar lógica.",
      evaluationCondition: stationFormEval.trim() || "Completar examen didáctico del módulo.",
      whatItUnlocks: stationFormUnlock.trim() || "Siguiente paso en el sendero.",
    };

    if (stationFormPhaseId.trim()) {
      newStep.phaseId = stationFormPhaseId.trim();
    }

    let updated: PathStep[];
    if (selectedStationIdForForm === "new") {
      if (pathSteps.some(s => s.id === newStep.id)) {
        alert("El identificador de estación ya existe. Use un slug único.");
        return;
      }
      updated = [...pathSteps, newStep];
    } else {
      updated = pathSteps.map(s => s.id === selectedStationIdForForm ? newStep : s);
    }

    setPathSteps(updated);
    // Reset form
    setSelectedStationIdForForm("new");
    setStationFormId("");
    setStationFormLabel("");
    setStationFormDesc("");
    setStationFormLearn("");
    setStationFormPractice("");
    setStationFormEval("");
    setStationFormUnlock("");
    setStationFormPhaseId("");
    alert("Estación registrada exitosamente. Se renderizará en el mapa inmediatamente.");
  };

  const handleDeleteStation = (id: string) => {
    if (pathSteps.length <= 1) {
      showAlert("Acción inválida", "No puedes borrar todas las estaciones de tu ruta.");
      return;
    }
    showConfirm(
      "Borrar Estación",
      `¿Estás seguro de que deseas borrar permanentemente la estación lúdica "${id}"?`,
      () => {
        setPathSteps(pathSteps.filter(s => s.id !== id));
        setCompletedStepIds(completedStepIds.filter(cid => cid !== id));
      },
      true
    );
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonFormId.trim() || !lessonFormTitle.trim() || !lessonFormContent.trim()) {
      alert("Complete al menos el ID, título y contenido educativo.");
      return;
    }

    const newLesson: Lesson = {
      id: lessonFormId.trim(),
      title: lessonFormTitle.trim(),
      subtitle: lessonFormSubtitle.trim() || "Análisis conceptual para adultos.",
      type: lessonFormType,
      content: lessonFormContent.trim(),
      codeSnippet: lessonFormSnippet.trim() || undefined,
      expectedOutput: lessonFormExpectedOutput.trim() || undefined,
      explanationOfGoal: lessonFormGoal.trim() || "Analizar detenidamente la sintaxis propuesta."
    };

    const targetPhaseId = selectedPhaseIdForLessonAdmin;
    const updatedCurriculum = curriculum.map(p => {
      if (p.id === targetPhaseId) {
        let updatedLessons: Lesson[];
        if (selectedLessonIdForForm === "new") {
          if (p.lessons.some(l => l.id === newLesson.id)) {
            alert("El ID de lección ya existe en esta fase.");
            return p;
          }
          updatedLessons = [...p.lessons, newLesson];
        } else {
          updatedLessons = p.lessons.map(l => l.id === selectedLessonIdForForm ? newLesson : l);
        }
        return { ...p, lessons: updatedLessons };
      }
      return p;
    });

    setCurriculum(updatedCurriculum);
    setSelectedLessonIdForForm("new");
    setLessonFormId("");
    setLessonFormTitle("");
    setLessonFormSubtitle("");
    setLessonFormContent("");
    setLessonFormSnippet("");
    setLessonFormExpectedOutput("");
    setLessonFormGoal("");
    alert("Lección incorporada / actualizada en esta fase. Puedes verificarla inmediatamente.");
  };

  const handleDeleteLesson = (phaseId: string, lessonId: string) => {
    showConfirm(
      "Borrar Lección",
      `¿Deseas eliminar permanentemente la lección "${lessonId}" de la fase "${phaseId}"?`,
      () => {
        const updatedCurriculum = curriculum.map(p => {
          if (p.id === phaseId) {
            if (p.lessons.length <= 1) {
              showAlert("Acción inválida", "No puedes dejar una fase con cero lecciones.");
              return p;
            }
            return { ...p, lessons: p.lessons.filter(l => l.id !== lessonId) };
          }
          return p;
        });
        setCurriculum(updatedCurriculum);
      },
      true
    );
  };

  const handleAdminCompleteAll = () => {
    if (!currentUser) {
      alert("Debes iniciar sesión con un estudiante para poder fast-forwardear su progreso.");
      return;
    }
    const allStepIds = pathSteps.map(s => s.id);
    setCompletedStepIds(allStepIds);

    const todayStr = new Date().toISOString().split('T')[0];
    const newDates: { [key: string]: string } = {};
    allStepIds.forEach(id => {
      newDates[id] = todayStr;
    });
    setCompletionDates(newDates);

    const allLessonIds: string[] = [];
    curriculum.forEach(p => {
      p.lessons.forEach(l => {
        allLessonIds.push(l.id);
      });
    });
    setCompletedLessonIds(allLessonIds);
    setQuizSubmitted(true);
    setQuizPassed(true);
    alert(`Progreso del alumno "${studentName}" actualizado correctamente al 100%. Todos los módulos han sido desbloqueados y vinculados a la barra de avance.`);
  };

  const handleAdminResetUser = () => {
    if (!currentUser) return;
    showConfirm(
      "Reiniciar Alumno",
      `¿Deseas reiniciar de cero todo el progreso de "${studentName}" manteniendo la cuenta creada?`,
      () => {
        setCompletedStepIds([]);
        setCompletedLessonIds([]);
        
        setCompletionDates({});
        setSelectedQuizAnswers({});
        setQuizSubmitted(false);
        setQuizPassed(false);
        setProjectSuccess(false);
        setProjectLogs([]);
        setProjectError(null);
        showAlert("Progreso Reiniciado", `El progreso del alumno "${studentName}" ha sido restaurado por completo.`);
      }
    );
  };

  const handleAdminResetDatabase = () => {
    showConfirm(
      "Restaurar de fábrica",
      "¿Seguro que deseas reestablecer la base de datos de alumnos? Se eliminarán todas las cuentas creadas externamente restableciendo los perfiles predeterminados.",
      () => {
        const defaultUsers = [
          { username: "admin", name: "Admin (Administrador)", pin: "1104" },
          { username: "Alberto", name: "Alberto", pin: "1234" },
          { username: "Beatriz", name: "Beatriz", pin: "1234" }
        ];
        
        // Wipe everything
        registeredUsers.forEach(u => {
          localStorage.removeItem(`adult_mentor_name_${u.username}`);
          localStorage.removeItem(`adult_mentor_completed_steps_${u.username}`);
          localStorage.removeItem(`adult_mentor_completed_dates_${u.username}`);
          localStorage.removeItem(`adult_mentor_completed_lessons_${u.username}`);
          localStorage.removeItem(`adult_mentor_notes_${u.username}`);
          localStorage.removeItem(`adult_mentor_active_tab_${u.username}`);
          localStorage.removeItem(`adult_mentor_text_size_${u.username}`);
        });

        setRegisteredUsers(defaultUsers);
        localStorage.setItem("adult_mentor_registered_users", JSON.stringify(defaultUsers));
        
        localStorage.removeItem("adult_mentor_current_user");
        setCurrentUser(null);
        setIsAdminMode(false);
        localStorage.removeItem("adult_mentor_admin_mode");
        setActiveTab("camino");
        showAlert("Base de datos restaurada", "Base de datos de alumnos restaurada de fábrica con éxito.");
      },
      true
    );
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans select-none" id="auth-portal-page">
        {/* Decorative Grid and Ambient Lights */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1e1b4b,transparent_60%)] opacity-40 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,#0f172a,transparent_50%)] opacity-60 pointer-events-none" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl w-full z-10 space-y-8 animate-fadeIn">
          
          {/* Logo / Title Accent */}
          <div className="text-center space-y-3">
            <div className="inline-flex bg-slate-900 border border-slate-800 text-amber-500 p-4 rounded-3xl items-center justify-center shadow-2xl shadow-amber-500/5 hover:scale-105 transition-all">
              <Brain className="w-12 h-12" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-black text-white font-display tracking-tight">
                Camino de Programación
              </h1>
              <p className="text-xs text-slate-400 font-mono tracking-wider max-w-md mx-auto">
                AULA VIRTUAL PERSONALIZADA PARA ADULTOS MENTORES
              </p>
            </div>
            <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
              Un entorno libre de tecnicismos complejos para aprender la lógica computacional paso a paso con fuentes legibles y un cuaderno de apuntes persistente.
            </p>
          </div>

          {/* Card Principal */}
          <div className="glass-card rounded-3xl border border-slate-900 overflow-hidden shadow-2xl bg-slate-950/40 backdrop-blur-xl">
            {/* Tabs Selector */}
            <div className="flex border-b border-slate-900 bg-slate-950/85">
              <button
                id="auth-tab-login"
                onClick={() => { setAuthTab("login"); setAuthError(null); }}
                className={`flex-1 py-4 text-center font-bold text-sm tracking-wide transition-all border-b-2 flex items-center justify-center gap-2 ${
                  authTab === "login" 
                    ? "border-amber-500 text-white bg-slate-900/30" 
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                <LogIn className="w-4 h-4 text-amber-500" />
                Ingresar a mi Aula
              </button>
              <button
                id="auth-tab-register"
                onClick={() => { setAuthTab("register"); setAuthError(null); }}
                className={`flex-1 py-4 text-center font-bold text-sm tracking-wide transition-all border-b-2 flex items-center justify-center gap-2 ${
                  authTab === "register" 
                    ? "border-amber-500 text-white bg-slate-900/30" 
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                <UserPlus className="w-4 h-4 text-amber-500" />
                Crear Cuenta Nueva (Comenzar Limpio)
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              {authError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl flex items-start gap-3 text-sm" id="auth-alert-message">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="font-light">{authError}</p>
                </div>
              )}

              {authTab === "login" ? (
                <div className="space-y-6">
                  {/* Perfiles de Demostración/Prueba para acceso rápido y limpio */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase">
                        Perfiles de Acceso Rápido:
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1" id="demo-profiles-container">
                      {registeredUsers.map((alumno) => (
                        <div
                          key={alumno.username}
                          id={`profile-demo-${alumno.username.toLowerCase()}`}
                          className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-slate-900 hover:border-amber-500/20 transition text-left group animate-fadeIn relative gap-2"
                        >
                          <button
                            type="button"
                            onClick={() => handleAccederClick(alumno)}
                            className="flex items-center gap-3 text-left flex-1 min-w-0 cursor-pointer"
                          >
                            <div className="w-9 h-9 bg-slate-950 text-amber-400 font-bold font-display rounded-xl border border-slate-800 flex items-center justify-center text-sm shrink-0">
                              {alumno.name.charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-white group-hover:text-amber-400 transition truncate">
                                {alumno.name}
                              </p>
                              <p className="text-[10px] text-slate-500 font-mono">
                                Usuario: @{alumno.username}
                              </p>
                            </div>
                          </button>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleAccederClick(alumno)}
                              className="text-[11px] font-mono text-amber-500 hover:bg-amber-500 hover:text-slate-950 bg-amber-500/10 px-2.5 py-1.5 rounded-lg border border-amber-500/15 group-hover:opacity-100 transition shrink-0"
                            >
                              Entrar →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-900"></div>
                    <span className="flex-shrink mx-4 text-slate-500 text-[10px] font-mono uppercase tracking-widest">O escribe tus credenciales</span>
                    <div className="flex-grow border-t border-slate-900"></div>
                  </div>

                  {/* Formulario tradicional */}
                  <form onSubmit={handleLogin} className="space-y-4" id="login-auth-form">
                    <div className="space-y-2">
                      <label htmlFor="login-username" className="text-sm font-black text-slate-300 font-display flex items-center gap-2">
                        Nombre de Usuario
                      </label>
                      <input
                        id="login-username"
                        type="text"
                        placeholder="ej. Alberto"
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
                        className="w-full bg-slate-950/65 border border-slate-900 rounded-xl px-4 py-3 text-white text-base font-medium placeholder-slate-600 focus:outline-none focus:border-amber-500/60"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label htmlFor="login-pin" className="text-sm font-black text-slate-300 font-display">
                          PIN de Seguridad
                        </label>
                        <span className="text-slate-550 text-[10px] font-mono">PIN del demo: 1234</span>
                      </div>
                      <input
                        id="login-pin"
                        type="password"
                        placeholder="Códigos numéricos (ej. 1234)"
                        value={loginPin}
                        onChange={(e) => setLoginPin(e.target.value)}
                        className="w-full bg-slate-950/65 border border-slate-900 rounded-xl px-4 py-3 text-white text-base font-mono placeholder-slate-600 tracking-widest focus:outline-none focus:border-amber-500/60"
                      />
                    </div>

                    <button
                      id="submit-login-btn"
                      type="submit"
                      className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm tracking-widest uppercase py-3.5 rounded-xl transition duration-300 shadow-xl shadow-amber-500/5 mt-2 flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      Ingresar al Aula Virtual
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Formulario de registro con explicación de que iniciará de cero */}
                  <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl space-y-1.5 animate-fadeIn">
                    <h4 className="text-xs font-black text-amber-400 font-display tracking-wider uppercase flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      Garantía de Aprendizaje Limpio
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-light">
                      Crear tu cuenta de estudiante inicializa tu progreso total a cero, asegurando una experiencia interactiva sin registros previos ni estorbos sintácticos.
                    </p>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-4" id="register-auth-form">
                    <div className="space-y-2">
                      <label htmlFor="register-name" className="text-sm font-black text-slate-300 font-display">
                        Tu Nombre (ej. María)
                      </label>
                      <input
                        id="register-name"
                        type="text"
                        placeholder="Para tus diplomas y misiones"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        className="w-full bg-slate-950/65 border border-slate-900 rounded-xl px-4 py-3 text-white text-base font-medium placeholder-slate-600 focus:outline-none focus:border-amber-500/60"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="register-username" className="text-sm font-black text-slate-300 font-display">
                        Nombre de Usuario Corto (ej. maria82)
                      </label>
                      <input
                        id="register-username"
                        type="text"
                        placeholder="Úsalo para volver a ingresar"
                        value={registerUsername}
                        onChange={(e) => setRegisterUsername(e.target.value)}
                        className="w-full bg-slate-950/65 border border-slate-900 rounded-xl px-4 py-3 text-white text-base font-medium placeholder-slate-600 focus:outline-none focus:border-amber-500/60"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="register-pin" className="text-sm font-black text-slate-300 font-display">
                        Tu PIN o Código Numérico
                      </label>
                      <input
                        id="register-pin"
                        type="password"
                        placeholder="ej. 1234"
                        value={registerPin}
                        onChange={(e) => setRegisterPin(e.target.value)}
                        className="w-full bg-slate-950/65 border border-slate-900 rounded-xl px-4 py-3 text-white text-base font-mono placeholder-slate-600 focus:outline-none focus:border-amber-500/60"
                      />
                    </div>

                    <button
                      id="submit-register-btn"
                      type="submit"
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm tracking-widest uppercase py-3.5 rounded-xl transition duration-300 shadow-xl shadow-emerald-500/5 mt-2 flex items-center justify-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      Crear Cuenta e Iniciar Desde Cero
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-slate-500">
              ¿Dificultad de Lectura? La plataforma soporta escalado de texto dinámico para evitar la fatiga visual de adultos.
            </p>
          </div>

        </div>

        {/* Modal para solicitar PIN del perfil rápido en el portal de login */}
        {profileForPinPrompt && (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn" id="prompt-pin-modal-login">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl relative">
              <form onSubmit={handleVerifyProfilePin} className="p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white leading-tight">PIN de Seguridad</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-light">
                      Ingresa el PIN de acceso para <strong>{profileForPinPrompt.name}</strong>
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="password"
                    required
                    autoFocus
                    placeholder="Introduce el PIN de 4 dígitos"
                    value={promptPinInput}
                    onChange={(e) => {
                      setPromptPinInput(e.target.value);
                      if (promptPinError) setPromptPinError(null);
                    }}
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl px-4 py-3 text-white text-center text-lg tracking-widest font-black placeholder-slate-700 placeholder-tracking-normal focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                  
                  {promptPinError ? (
                    <p className="text-[11px] text-rose-450 font-medium text-center leading-normal">
                      ⚠️ {promptPinError}
                    </p>
                  ) : (
                    <p className="text-[10px] text-slate-500 text-center font-mono">
                      El PIN estándar es <span className="text-slate-400 font-semibold">1234</span> (o administrador <span className="text-slate-400 font-semibold">1104</span>).
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-850">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileForPinPrompt(null);
                      setPromptPinInput("");
                      setPromptPinError(null);
                    }}
                    className="px-4 py-2.5 bg-slate-950/40 hover:bg-slate-950 text-slate-300 text-xs font-bold rounded-xl transition border border-slate-850"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition"
                  >
                    Ingresar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
      
      {/* Banner de felicitación: Insignias */}
      {unlockedBadgeName && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" id="celebration-badge-overlay">
          <div className="glass-card rounded-3xl p-8 max-w-lg w-full text-center border border-amber-500/30 animate-float shadow-2xl">
            <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/40">
              <Trophy className="w-12 h-12 text-amber-500 animate-pulse" />
            </div>
            <h3 className="text-3xl font-extrabold text-white mb-2 font-display">¡Fase Superada con Éxito!</h3>
            <p className="text-slate-300 mb-6 text-base">Has obtenido formalmente una nueva Insignia de Certificación en tu bitácora de mentoría:</p>
            
            <div className="inline-block bg-amber-950/40 border border-amber-500/30 rounded-2xl px-6 py-4 mb-6">
              <p className="text-xl font-bold text-amber-400 font-display">🏆 {unlockedBadgeName}</p>
              <p className="text-xs text-amber-500 font-serif italic mt-1 font-mono">Mentor de Programación Sólido</p>
            </div>
            
            <p className="text-sm text-slate-400 mb-6 leading-relaxed bg-slate-900/40 p-3.5 rounded-xl border border-slate-900">
              &ldquo;Tu constancia a tus 45 años confirma que el aprendizaje analítico no tiene límites de edad. Cada paso lógico asimilado nutre tu capacidad para dominar la inteligencia de las computadoras.&rdquo;
            </p>
            
            <button
              id="confirm-badge-btn"
              onClick={() => setUnlockedBadgeName(null)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/10 w-full font-display"
            >
              Registrar en mi Cuaderno y Continuar
            </button>
          </div>
        </div>
      )}

      {/* HEADER PRINCIPAL */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 shadow-xl" id="app-main-header">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          <div className="flex items-center gap-3.5">
            <div className="bg-slate-950 text-amber-500 p-2.5 rounded-2xl flex items-center justify-center shadow-inner border border-slate-800 animate-pulse-glow">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white font-display flex items-center gap-2">
                Camino de Programación
                <span className="bg-slate-800 text-amber-400 text-[10px] px-2.5 py-0.5 rounded-full border border-slate-700 font-bold">
                  Estudiante: {studentName}
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-mono tracking-wider">PEDAGOGÍA: PRIMERO LÓGICA PASO A PASO, LUEGO SINTAXIS REAL</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Controladores de lectura de letra */}
            <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800 flex items-center gap-1">
              <span className="text-[10px] font-bold tracking-widest px-2 text-slate-400 uppercase">Lectura:</span>
              <button
                id="text-size-normal-btn"
                onClick={() => setTextSize("normal")}
                className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${textSize === "normal" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"}`}
                title="Letra normal (estándar)"
              >
                A
              </button>
              <button
                id="text-size-big-btn"
                onClick={() => setTextSize("grande")}
                className={`px-3 py-1 text-sm rounded-lg font-bold transition-all ${textSize === "grande" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"}`}
                title="Letra grande (Recomendada descanso visual)"
              >
                A+
              </button>
              <button
                id="text-size-huge-btn"
                onClick={() => setTextSize("muyGrande")}
                className={`px-3 py-1 text-base rounded-lg font-black transition-all ${textSize === "muyGrande" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"}`}
                title="Letra gigante (Máxima visibilidad)"
              >
                A++
              </button>
            </div>

            <button
              id="toggle-admin-mode-btn"
              onClick={() => {
                if (currentUser?.toLowerCase() === "admin") {
                  alert("La cuenta de 'admin' tiene las herramientas de Creador/Administrador permanentemente habilitadas.");
                  setActiveTab("admin");
                  return;
                }
                const newMode = !isAdminMode;
                setIsAdminMode(newMode);
                if (newMode) {
                  setActiveTab("admin");
                } else if (activeTab === "admin") {
                  setActiveTab("camino");
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black border-2 transition flex items-center gap-1.5 active:scale-95 hover:scale-105 ${
                isAdminMode 
                  ? "bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 text-slate-950 border-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                  : "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-pulse"
              }`}
              title="Alternar privilegios de Creador / Administrador"
            >
              <Shield className="w-4 h-4 text-slate-950 animate-bounce" />
              {isAdminMode ? "M. Creador: Activo" : "Activar Modo Creador ⭐"}
            </button>

            <button
              id="reset-progress-btn"
              onClick={handleResetCourse}
              className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-800 text-slate-400 hover:bg-slate-900 transition flex items-center gap-1.5"
              title="Borrar progreso guardado actual"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reiniciar
            </button>

            <button
              id="logout-btn"
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl text-xs font-bold border border-rose-950/40 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition flex items-center gap-1.5"
              title="Cerrar sesión de mi aula"
            >
              <LogOut className="w-3.5 h-3.5" />
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Global Progress Track Bar */}
        <div className="bg-slate-950/65 border-t border-slate-800 py-3 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Progreso General del Camino:</span>
              <span className="text-sm font-black text-amber-500 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{porcentajeProgreso}%</span>
            </div>
            
            <div className="flex-1 max-w-md bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-850">
              <div 
                id="global-progress-bar-fill"
                className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full transition-all duration-700 ease-out shadow-lg"
                style={{ width: `${porcentajeProgreso}%` }}
              />
            </div>

            <div className="text-xs text-slate-400 font-mono">
              Próximo objetivo: <strong className="text-amber-400 font-bold">
                {completedStepIds.length === 1 ? "Comenzar el Viaje" : 
                 completedStepIds.length < totalPathSteps ? pathSteps[completedStepIds.length]?.label : "¡Felicidades, Graduado!"}
              </strong>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL: GRID */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-8" id="app-grid-container">
        
        {/* SIDEBAR DE ESTUDIANTE Y ACCESOS RÁPIDOS */}
        <aside className="lg:col-span-3 flex flex-col gap-6" id="aside-column">
          
          {/* Tarjeta de Perfil Adulto - Alberto */}
          <div className="glass-card rounded-3xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-800">
                <User className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest block">Estudiante</span>
                <input
                  id="student-name-input"
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="bg-transparent text-xl font-bold text-white border-b border-transparent hover:border-slate-800 focus:border-amber-505 outline-none transition-all py-0.5 w-36"
                  placeholder="Tu Nombre"
                  title="Haz clic para personalizar tu nombre de mentor"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 bg-slate-900/40 rounded-xl border border-slate-800/60">
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Estación Actual de Enfoque</div>
                <div className="text-xs font-semibold text-slate-200">
                  {curriculum.find(p => p.id === selectedPhaseId)?.title || "Estación de Estudio"}
                </div>
              </div>

              <div className="p-3.5 bg-slate-900/40 rounded-xl border border-slate-800/60">
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Insignias Logradas</div>
                <div className="flex flex-wrap gap-1.5">
                  {completedStepIds.includes("step_phase1_eval") && (
                    <span className="px-2 py-1 bg-amber-500/10 text-[9px] font-extrabold text-amber-400 rounded-md border border-amber-500/20 flex items-center gap-1 cursor-help" title="Concedida al aprobar el examen de lógica de la Fase 1">
                      🏆 Lógica de Oro
                    </span>
                  )}
                  {completedStepIds.includes("step_phase2_project") && (
                    <span className="px-2 py-1 bg-amber-500/10 text-[9px] font-extrabold text-amber-400 rounded-md border border-amber-500/20 flex items-center gap-1 cursor-help" title="Concedida al resolver satisfactoriamente el Reto de la Calculadora Básica Interactiva">
                      💻 Placa Python
                    </span>
                  )}
                  {completedStepIds.includes("step_finish") && (
                    <span className="px-2 py-1 bg-amber-500/10 text-[9px] font-extrabold text-amber-400 rounded-md border border-amber-500/20 flex items-center gap-1 cursor-help" title="Graduado general de competencias de programación">
                      🎓 Laurel Maestría
                    </span>
                  )}
                  {completedStepIds.length <= 1 && (
                    <span className="text-[10px] text-slate-500 italic">Ninguna insignia aún. ¡Paso a paso!</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Menú de pestañas vertical */}
          <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 p-1.5 bg-slate-900/30 rounded-2xl border border-slate-900" id="tabs-navigation-sidebar">
            <button
              id="tab-btn-road"
              onClick={() => setActiveTab("camino")}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-xs md:text-sm transition-all whitespace-nowrap lg:w-full font-display border border-transparent ${activeTab === "camino" ? "bg-amber-500 text-slate-950 shadow-md font-extrabold" : "text-slate-300 hover:bg-slate-900/80 hover:text-white"}`}
            >
              <BookOpen className="w-4 h-4 text-inherit" />
              Camino de Aprendizaje
            </button>

            <button
              id="tab-btn-lesson"
              onClick={() => {
                setActiveTab("modulo");
                // Preserve the currently selected phase and lesson index so user does not lose their navigation progress
                if (!selectedPhaseId) {
                  setSelectedPhaseId("phase_1");
                  setSelectedLessonIdx(0);
                }
              }}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-xs md:text-sm transition-all whitespace-nowrap lg:w-full font-display border border-transparent ${activeTab === "modulo" ? "bg-amber-500 text-slate-950 shadow-md font-extrabold" : "text-slate-300 hover:bg-slate-900/80 hover:text-white"}`}
            >
              <Code className="w-4 h-4 text-inherit" />
              Taller Activo & Lección
            </button>

            <button
              id="tab-btn-play"
              onClick={() => setActiveTab("taller")}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-xs md:text-sm transition-all whitespace-nowrap lg:w-full font-display border border-transparent ${activeTab === "taller" ? "bg-amber-500 text-slate-950 shadow-md font-extrabold" : "text-slate-300 hover:bg-slate-900/80 hover:text-white"}`}
            >
              <Terminal className="w-4 h-4 text-inherit" />
              Práctica de Exámenes
            </button>

            <button
              id="tab-btn-notes"
              onClick={() => setActiveTab("progreso")}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-xs md:text-sm transition-all whitespace-nowrap lg:w-full font-display border border-transparent ${activeTab === "progreso" ? "bg-amber-500 text-slate-950 shadow-md font-extrabold" : "text-slate-300 hover:bg-slate-900/80 hover:text-white"}`}
            >
              <Award className="w-4 h-4 text-inherit" />
              Cuaderno de Progreso
            </button>

            <button
              id="tab-btn-philo"
              onClick={() => setActiveTab("ayuda")}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-xs md:text-sm transition-all whitespace-nowrap lg:w-full font-display border border-transparent ${activeTab === "ayuda" ? "bg-amber-500 text-slate-950 shadow-md font-extrabold" : "text-slate-300 hover:bg-slate-900/80 hover:text-white"}`}
            >
              <HelpCircle className="w-4 h-4 text-inherit" />
              Filosofía y Pedagogía
            </button>

            {isAdminMode && (
              <button
                id="tab-btn-admin"
                onClick={() => setActiveTab("admin")}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-xs md:text-sm transition-all whitespace-nowrap lg:w-full font-display border border-transparent ${activeTab === "admin" ? "bg-red-500 text-white shadow-md font-extrabold" : "text-red-400 hover:bg-red-955 hover:text-red-300"}`}
              >
                <Shield className="w-4 h-4 text-inherit animate-pulse" />
                Administración
              </button>
            )}
          </nav>

          {/* Widget de apoyo permanente para el adulto */}
          <div className="glass-card border border-amber-500/10 rounded-2xl p-5 shadow-sm hidden lg:block" id="supportive-aside-widget">
            <h4 className="text-xs font-bold text-amber-400 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-550" />
              Sabiduría del Adulto
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans font-light">
              Analizar el orden correcto de las cosas es tu mayor talento. No memorices símbolos crudos; céntrate en la lógica e hilvación de secuencias naturales. Escribir código real luego será pan comido.
            </p>
          </div>
        </aside>

        {/* PANEL CON CONTENEDOR DE CONTENIDO (Col span 9) */}
        <main className="lg:col-span-9 space-y-6 flex flex-col" id="main-content-column">
          
          {/* Universal Phase Navigation Bar (Visible in standard student views) */}
          {activeTab !== "admin" && (
            <div className="glass-card rounded-3xl p-5 border border-slate-850 bg-slate-900/10 space-y-3.5 animate-fadeIn" id="universal-phase-navigator">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-amber-500" />
                  <span className="text-xs font-black text-slate-350 uppercase tracking-widest font-display">Navegación Interactiva de Fases</span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono">
                  Haz clic en cualquier fase para explorar sus capítulos y talleres interactivos
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {curriculum.map((phase) => {
                  const isSelected = selectedPhaseId === phase.id;
                  
                  // Phase status logic
                  const isP1 = phase.id === "phase_1";
                  const isP2 = phase.id === "phase_2";

                  const isComp = isP1 
                    ? completedStepIds.includes("step_phase1_eval") 
                    : isP2 
                      ? completedStepIds.includes("step_phase2_project") 
                      : completedStepIds.includes("step_phase3_project");

                  const isUnl = isP1 
                    ? true 
                    : isP2 
                      ? completedStepIds.includes("step_phase1_eval") || isAdminMode
                      : completedStepIds.includes("step_phase2_project") || isAdminMode;

                  // Counts
                  const lessonCount = phase.lessons.length;

                  return (
                    <button
                      key={phase.id}
                      id={`nav-phase-card-${phase.id}`}
                      onClick={() => {
                        setSelectedPhaseId(phase.id);
                        setSelectedLessonIdx(0);
                        // If they are on Camino or Ayuda, let's take them directly to the active lesson of that phase
                        if (activeTab === "camino" || activeTab === "ayuda") {
                          setActiveTab("modulo");
                        }
                      }}
                      className={`relative text-left p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-28 select-none group ${
                        isSelected
                          ? "bg-slate-900/80 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.1)] ring-1 ring-amber-500/20"
                          : "bg-slate-950/50 border-slate-900/85 hover:border-slate-800 hover:bg-slate-900/20"
                      }`}
                    >
                      {/* Top Row Title and badge */}
                      <div className="w-full space-y-1">
                        <div className="flex items-center justify-between w-full gap-1">
                          <span className={`text-[9px] font-black uppercase tracking-wider ${isSelected ? "text-amber-500" : "text-slate-400"}`}>
                            {isP1 ? "FASE 1" : isP2 ? "FASE 2" : "FASE 3"}
                          </span>
                          
                          {/* Mini badges */}
                          {isComp ? (
                            <span className="flex items-center gap-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/15">
                              <Check className="w-2.5 h-2.5" /> Listado
                            </span>
                          ) : isUnl ? (
                            <span className="flex items-center gap-0.5 text-[9px] font-bold text-amber-400 bg-amber-500/5 px-2 py-0.5 rounded-full border border-amber-500/15 animate-pulse">
                              <span className="w-1 h-1 rounded-full bg-amber-400" /> {isSelected ? "En Curso" : "Activa"}
                            </span>
                          ) : (
                            <span className="flex items-center gap-0.5 text-[9px] font-bold text-slate-500 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-900">
                              <Lock className="w-2.5 h-2.5" /> Bloqueada
                            </span>
                          )}
                        </div>
                        
                        <h4 className="text-xs font-black text-white group-hover:text-amber-400 transition-colors line-clamp-1 font-display">
                          {phase.title.split(": ")[1] || phase.title}
                        </h4>
                      </div>

                      {/* Bottom section */}
                      <div className="w-full pt-2 border-t border-slate-900/40 flex items-center justify-between text-[10px] text-slate-450 font-mono">
                        <span>🏷️ {lessonCount} Capítulos</span>
                        <span>⏱️ {phase.suggestedDuration || "2 semanas"}</span>
                      </div>
                      
                      {/* Selection indicators */}
                      {isSelected && (
                        <div className="absolute -bottom-px left-4 right-4 h-0.5 bg-amber-500 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* ================================== TAB 1: ROADMAP MAP PATH ================================== */}
          {activeTab === "camino" && (
            <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6 animate-slideUp" id="panel-road-map">
              <div className="border-b border-slate-800/80 pb-5">
                <h2 className={`font-semibold text-white ${getFontSizeClass("title")} flex items-center gap-2.5`}>
                  🗺️ Tu Camino de Aprendizaje Secuencial
                </h2>
                <p className={`${getFontSizeClass("body")} text-slate-450 mt-1.5 font-light`}>
                  Este mapa de estaciones marca tus paradas de aprendizaje recomendadas. No corras: cada casilla desbloquea de manera segura los talleres y cuestionarios correspondientes para asegurar comprensión permanente y sin presiones.
                </p>
              </div>

              {/* Main Timeline vertical Path */}
              <div className="relative pl-6 md:pl-10 space-y-8 before:absolute before:left-[21px] before:md:left-[29px] before:top-4 before:bottom-4 before:w-1 before:bg-slate-800" id="roadmap-timeline-tracks">
                {pathSteps.map((step, idx) => {
                  const status = getStepStatus(step);
                  const isCompleted = status.state === "completed";
                  const isActive = status.state === "active";
                  const isLocked = status.state === "locked";

                  return (
                    <div 
                      key={step.id} 
                      id={`roadmap-node-${step.id}`}
                      className={`relative transition-all duration-300 ${isLocked ? "opacity-45" : "opacity-100"}`}
                    >
                      {/* Left timeline circle dot indicator */}
                      <span className={`absolute -left-[30px] md:-left-[38px] top-2 w-4 h-4 md:w-5 md:h-5 rounded-full border-4 z-10 transition-colors ${
                        isCompleted ? "bg-emerald-500 border-emerald-950" :
                        isActive ? "bg-amber-500 border-amber-950 animate-pulse-glow" :
                        "bg-slate-800 border-slate-900"
                      }`} />

                      {/* Content Card Panel */}
                      <div className={`p-5 rounded-2xl border transition-all duration-300 ${
                        isCompleted ? "bg-emerald-950/10 border-emerald-500/25 shadow-sm" :
                        isActive ? "bg-slate-900/90 border-amber-500/40 shadow-xl shadow-amber-500/5 ring-1 ring-amber-500/20" :
                        "bg-slate-950/40 border-slate-900"
                      }`}>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <span className={`px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-md ${
                              isCompleted ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25" :
                              isActive ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                              "bg-slate-900 text-slate-500 border border-slate-800"
                            }`}>
                              Estación {idx + 1} • {step.type === "start" ? "Bienvenida" : step.type === "finish" ? "Maestría" : step.type.replace("phase_", "Fase ").toUpperCase()}
                            </span>
                            
                            <h3 className="text-base md:text-lg font-bold text-white font-display mt-1.5 flex items-center gap-2">
                              {step.label}
                              {isCompleted && <CheckCircle className="w-4.5 h-4.5 text-emerald-450 fill-emerald-950/20" />}
                              {isLocked && <Lock className="w-3.5 h-3.5 text-slate-600" />}
                            </h3>
                          </div>

                          {/* Action Button depending on status */}
                          <div>
                            {isCompleted && (
                              <button
                                id={`btn-revisit-${step.id}`}
                                onClick={() => handleStepClick(step.id)}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition border border-slate-700"
                              >
                                Repasar Estación
                              </button>
                            )}
                            
                            {isActive && (
                              <button
                                id={`btn-start-${step.id}`}
                                onClick={() => {
                                  if (step.id === "step_start") {
                                    // Complete welcome on first click
                                    if (!completedStepIds.includes("step_start")) {
                                      setCompletedStepIds(prev => [...prev, "step_start"]);
                                    }
                                    // Move to next step automatically
                                    handleStepClick("step_phase1_module");
                                  } else {
                                    handleStepClick(step.id);
                                  }
                                }}
                                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/10 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 font-display"
                              >
                                {step.id === "step_start" ? "Iniciar Aventura" : "Ir al Taller"}
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {isLocked && (
                              <div className="px-3.5 py-2 bg-slate-950/80 rounded-xl text-xs text-slate-500 font-bold border border-slate-900 flex items-center gap-1.5 cursor-not-allowed">
                                <Lock className="w-3.5 h-3.5" />
                                Bloqueado
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Interactive Educational metadata */}
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-900/85">
                          <div>
                            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">Propósito Técnico:</span>
                            <p className="text-xs text-slate-300 mt-1 font-light leading-relaxed">{step.description}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">Estudio Asociado:</span>
                            <p className="text-xs text-slate-300 mt-1 font-light leading-relaxed">{step.practiceToRealize}</p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-dashed border-slate-900 flex flex-wrap gap-4 items-center justify-between text-[11px] text-slate-450">
                          <span>
                            Condición de salida: <strong className="text-slate-205">{step.evaluationCondition}</strong>
                          </span>
                          <span>
                            Siguiente Paso: <strong className="text-amber-455 font-semibold">{step.whatItUnlocks}</strong>
                          </span>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================== TAB 2: ACTIVE MODULE LESSON ================================== */}
          {activeTab === "modulo" && (
            <div className="space-y-6 animate-slideUp" id="panel-active-lesson">
              
              {/* Selector de Fases y Lecciones */}
              <div className="glass-card rounded-3xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest">Lección Interactiva Activa</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <select
                      id="select-active-phase"
                      value={selectedPhaseId}
                      onChange={(e) => {
                        setSelectedPhaseId(e.target.value);
                        setSelectedLessonIdx(0);
                      }}
                      className="bg-slate-900 text-white font-bold text-sm md:text-base border border-slate-800 rounded-xl px-3 py-2 outline-none focus:border-amber-500/50"
                    >
                      {curriculum.map(phase => (
                        <option key={phase.id} value={phase.id}>
                          {phase.title}
                        </option>
                      ))}
                    </select>

                    <span className="text-slate-500">/</span>

                    <select
                      id="select-active-lesson"
                      value={selectedLessonIdx}
                      onChange={(e) => setSelectedLessonIdx(Number(e.target.value))}
                      className="bg-slate-900 text-white font-medium text-xs md:text-sm border border-slate-800 rounded-xl px-3 py-2 outline-none focus:border-amber-500/50"
                    >
                      {curriculum.find(p => p.id === selectedPhaseId)?.lessons.map((lesson, idx) => (
                        <option key={lesson.id} value={idx}>
                          Capítulo {idx + 1}: {lesson.title.split(":")[1] || lesson.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Insignia Prometida</span>
                  <span className="inline-block bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-bold font-display px-3 py-1 rounded-xl mt-1">
                    🏆 {curriculum.find(p => p.id === selectedPhaseId)?.badgeName}
                  </span>
                </div>
              </div>

              {/* Información General de la Fase */}
              {(() => {
                const phase = curriculum.find(p => p.id === selectedPhaseId);
                if (!phase) return null;
                
                return (
                  <div className="glass-card rounded-3xl p-6 border border-slate-800/80 bg-slate-900/10 space-y-5 animate-slideUp">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                      <div>
                        <h4 className="text-xs font-bold text-amber-500/80 uppercase tracking-wider">Currículum Oficial Completado por Fases</h4>
                        <h3 className="text-xl font-black text-white font-display mt-0.5">{phase.title}</h3>
                      </div>
                      {phase.suggestedDuration && (
                        <span className="self-start sm:self-center px-3 py-1.5 bg-amber-500/10 border border-amber-500/25 text-xs font-bold text-amber-400 rounded-xl flex items-center gap-1.5 font-mono">
                          ⏱️ Duración Sugerida: {phase.suggestedDuration}
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Objetivos y Explicación */}
                      <div className="space-y-3 bg-slate-950/40 p-5 rounded-2xl border border-slate-900/80">
                        <span className="text-[11px] font-black text-amber-500 uppercase tracking-widest block">🎯 Enfoque y Objetivos</span>
                        <p className="text-xs text-slate-350 font-normal leading-relaxed">
                          {phase.explanationOfPhase || phase.description}
                        </p>
                        {phase.objectives && phase.objectives.length > 0 && (
                          <div className="pt-3 border-t border-slate-900/80 mt-2.5">
                            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">Metas Clave:</span>
                            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside font-light">
                              {phase.objectives.map((obj, oIdx) => (
                                <li key={oIdx} className="leading-relaxed">{obj}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Temas y Prácticas */}
                      <div className="space-y-4 bg-slate-950/40 p-5 rounded-2xl border border-slate-900/80">
                        {phase.temas && (
                          <div className="space-y-2">
                            <span className="text-[11px] font-black text-amber-500 uppercase tracking-widest block">📖 Temas de esta Fase</span>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {phase.temas.map((tema, tIdx) => (
                                <span key={tIdx} className="px-2.5 py-1 bg-slate-950 text-slate-300 text-[11px] font-mono rounded-lg border border-slate-800">
                                  • {tema}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {phase.practices && (
                          <div className="space-y-2 border-t border-slate-900/80 pt-3">
                            <span className="text-[11px] font-black text-amber-500 uppercase tracking-widest block">🛠️ Prácticas de Aprendizaje</span>
                            <ul className="text-xs text-slate-400 space-y-1.5 list-decimal list-inside font-light">
                              {phase.practices.map((prac, pIdx) => (
                                <li key={pIdx} className="leading-relaxed">{prac}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Guía de Práctica y Proyecto */}
                      <div className="space-y-4 bg-slate-950/40 p-5 rounded-2xl border border-slate-900/80 md:col-span-2 lg:col-span-1 flex flex-col justify-between">
                        {phase.stepByStepGuide && (
                          <div className="space-y-2">
                            <span className="text-[11px] font-black text-amber-500 uppercase tracking-widest block">🚀 Guía de Práctica en 7 Pasos</span>
                            <div className="grid grid-cols-1 gap-1 text-[11px] text-slate-400 font-mono">
                              {phase.stepByStepGuide.map((stepStr, sIdx) => (
                                <div key={sIdx} className="flex items-center gap-2 bg-slate-900/50 p-1 rounded border border-slate-950">
                                  <span className="text-amber-500 font-bold">P{sIdx + 1}</span>
                                  <span className="truncate text-slate-300" title={stepStr}>{stepStr.split(": ")[1] || stepStr}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {phase.evaluationCriteria && (
                          <div className="space-y-1.5 pt-2 border-t border-slate-900/80">
                            <span className="text-[11px] font-black text-amber-500 uppercase tracking-widest block">📝 Criterios de Evaluación</span>
                            <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside font-light">
                              {phase.evaluationCriteria.map((crit, cIdx) => (
                                <li key={cIdx} className="leading-relaxed" title={crit}>{crit}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {phase.phaseProjectDescription && (
                          <div className="mt-2 p-3 bg-amber-500/5 rounded-xl border border-amber-500/15 text-xs leading-relaxed">
                            <span className="font-extrabold text-amber-400 block font-display mb-0.5">🏆 Proyecto de la Fase:</span>
                            <span className="text-slate-300 font-light">{phase.phaseProjectDescription}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Contenido didáctico */}
              {(() => {
                const phase = curriculum.find(p => p.id === selectedPhaseId);
                const lesson = phase?.lessons[selectedLessonIdx];
                if (!lesson) return null;

                return (
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
                    
                    {/* Texto explicativo (didáctica col 5) */}
                    <div className="xl:col-span-5 glass-card rounded-3xl p-6 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 text-[9px] font-extrabold uppercase tracking-wide rounded border border-amber-500/25">
                          Enfoque: {lesson.type === "concept" ? "Secuencia Conceptual" : lesson.type === "logic_exercise" ? "Reto de Flujo" : "Programación real"}
                        </span>
                        
                        <h3 className={`font-extrabold text-white font-display leading-tight ${getFontSizeClass("title")}`}>
                          {lesson.title}
                        </h3>
                        <h4 className={`text-slate-400 font-medium ${getFontSizeClass("subtitle")}`}>
                          {lesson.subtitle}
                        </h4>
                        
                        <div className={`text-slate-300 font-light space-y-3 border-t border-slate-900 pt-3 ${getFontSizeClass("body")}`}>
                          {lesson.content.split("\n\n").map((para, i) => (
                            <p key={i}>{para}</p>
                          ))}
                        </div>
                      </div>

                      {/* Caja de objetivo de la práctica */}
                      <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-900 space-y-1">
                        <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider block flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          Tu Objetivo Práctico:
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed font-light">{lesson.explanationOfGoal}</p>
                      </div>

                    </div>

                    {/* Editor Inteligente Interactivo (col 7) */}
                    <div className="xl:col-span-7 flex flex-col gap-4">
                      <div className="glass-card rounded-3xl p-5 flex flex-col gap-4 flex-1">
                        <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                          <span className="text-xs font-bold text-slate-350 flex items-center gap-1.5 font-mono">
                            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse" />
                            INTERPRETE_LOGICO_ONLINE.EXE
                          </span>

                          <button
                            id="run-interactive-lesson-code-btn"
                            onClick={handleRunLesson}
                            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow shadow-amber-500/10 font-display"
                          >
                            <Play className="w-3.5 h-3.5 fill-slate-950" />
                            Simular Ejecución
                          </button>
                        </div>

                        {/* Textarea code container */}
                        <div className="relative flex-1 min-h-[220px] bg-slate-950 rounded-xl border border-slate-900 overflow-hidden font-mono flex flex-col">
                          <div className="bg-slate-900/45 px-3 py-1.5 border-b border-slate-900 flex justify-between text-[10px] text-slate-400 font-mono">
                            <span>Sintaxis Lúdica en Español</span>
                            <span>Acepta variables y condicionales</span>
                          </div>
                          
                          <textarea
                            id="interactive-lesson-textarea"
                            value={lessonCode}
                            onChange={(e) => {
                              setLessonCode(e.target.value);
                              setLessonSuccess(false);
                            }}
                            className={`w-full flex-1 p-4 bg-transparent text-amber-100 placeholder-slate-700 outline-none resize-none ${getFontSizeClass("code")}`}
                            placeholder="// Escribe tus algoritmos aquí..."
                          />
                        </div>

                        {/* Feedback execution box */}
                        {lessonSuccess ? (
                          <div className="p-4 bg-emerald-950/30 border border-emerald-500/20 rounded-2xl flex items-start gap-3 text-emerald-300 animate-fadeIn" id="lesson-success-alertBox">
                            <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider">¡Éxito lúdico de simulación!</p>
                              <p className="text-xs mt-0.5 text-slate-300 font-light">Has obtenido los resultados exactos que el compilador esperaba para validar tu maduración teórica.</p>
                              
                              <button
                                id="achieve-station-btn"
                                onClick={handleCompleteActiveLesson}
                                className="mt-2.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-450 text-slate-950 text-xs font-black rounded-xl transition flex items-center gap-1.5 font-display"
                              >
                                Marcar Estación como Exitosa
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 bg-slate-900/35 border border-slate-800 rounded-2xl flex items-start gap-3 text-slate-400" id="lesson-pending-alertBox">
                            <AlertCircle className="w-5 h-5 text-amber-500/60 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-slate-300">Esperando simulación con éxito...</p>
                              <p className="text-xs mt-0.5 text-slate-400 font-light">Escribe el algoritmo solicitado a la izquierda, presiona &ldquo;Simular Ejecución&rdquo; y evalúa tu bitácora de resultados.</p>
                            </div>
                          </div>
                        )}

                        {/* Output console log visual representation */}
                        <div className="space-y-2">
                          <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest font-mono block">Monitor de Consola (Log)</span>
                          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-900 font-mono text-xs h-32 overflow-y-auto space-y-1">
                            {lessonLogs.map((log, lIdx) => (
                              <div key={lIdx} className="text-emerald-400 border-l border-emerald-500/20 pl-2">
                                <span className="text-[9px] text-slate-600 mr-2 font-mono">[{lIdx + 1}]</span>
                                {log}
                              </div>
                            ))}
                            {lessonLogs.length === 0 && (
                              <span className="text-slate-650 italic text-[11px] block">Consola en espera de salida...</span>
                            )}
                            {lessonError && (
                              <p className="text-rose-400 font-semibold bg-rose-950/20 px-2 py-1 rounded border border-rose-900/30 text-[11px] mt-1">
                                ⚠️ Error: {lessonError}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Tracker Variables Memory */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-900">
                          <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest font-mono block">Estado de Variables en Memoria Interna:</span>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(lessonVars).map(([key, val]) => (
                              <span key={key} className="px-2.5 py-1 bg-slate-950 border border-slate-900 text-[11px] font-mono rounded-lg flex items-center gap-1.5 text-slate-300">
                                <strong className="text-amber-500 font-bold">{key}</strong>: <span className="text-emerald-300">{String(val)}</span>
                              </span>
                            ))}
                            {Object.keys(lessonVars).length === 0 && (
                              <span className="text-xs text-slate-600 italic">No hay variables alojadas en memoria todavía.</span>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                );
              })()}

            </div>
          )}

          {/* ================================== TAB 3: EXAMINATIONS & TESTS ================================== */}
          {activeTab === "taller" && (
            <div className="space-y-8 animate-slideUp" id="panel-examinations">
              
              <div className="glass-card rounded-3xl p-6 md:p-8 space-y-4">
                <h2 className={`font-semibold text-white ${getFontSizeClass("title")} flex items-center gap-2`}>
                  📝 Pruebas de Desempeño Técnico
                </h2>
                <p className={`${getFontSizeClass("body")} text-slate-400 font-light`}>
                  En este apartado puedes rendir las evaluaciones teóricas o resolver los proyectos de certificación una vez que los desbloqueas completando las estaciones previas.
                </p>
              </div>

              {/* EVALUATION QUIZ FASE 1 DISPLAY */}
              {selectedPhaseId === "phase_1" && (
                <div 
                  id="evaluation-quiz-panel"
                  className={`glass-card rounded-3xl p-6 md:p-8 space-y-6 transition-all border ${
                    completedStepIds.includes("step_phase1_module") 
                      ? "border-amber-500/20 bg-slate-900/25" 
                      : "border-slate-900 opacity-60 bg-slate-950/20"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
                    <div>
                      <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 text-[9px] font-black uppercase rounded border border-amber-500/20">
                        Evaluación Teórica • Fase 1
                      </span>
                      <h3 className="text-lg md:text-xl font-bold font-display text-white mt-1.5">
                        Cuestionario de Lógica & Secuencias
                      </h3>
                    </div>

                    <span className="text-xs font-mono text-slate-450 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                      Requisito: Madurar la Fase 1
                    </span>
                  </div>

                  {!completedStepIds.includes("step_phase1_module") && !isAdminMode ? (
                    <div className="p-8 text-center space-y-3 bg-slate-950/50 rounded-2xl border border-slate-900">
                      <Lock className="w-10 h-10 text-slate-700 mx-auto" />
                      <h4 className="text-sm font-bold text-slate-400 uppercase">Evaluación Bloqueada temporalmente</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto font-light">
                        Debes asimilar las lecciones de la Fase 1 en la visualización &ldquo;Taller Activo & Lección&rdquo; para autorizarte este examen oficial.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Render questions inside general path step for phase 1 */}
                      {(() => {
                        const evalStep = pathSteps.find(s => s.id === "step_phase1_eval");
                        if (!evalStep || !evalStep.quizQuestions) return null;

                        return (
                          <div className="space-y-6">
                            {evalStep.quizQuestions.map((q, qIdx) => {
                              const selectedIdx = selectedQuizAnswers[q.id];
                              return (
                                <div key={q.id} className="p-5 bg-slate-900/30 rounded-2xl border border-slate-800/80 space-y-3">
                                  <h4 className="text-sm md:text-base font-bold text-slate-200">
                                    {qIdx + 1}. {q.question}
                                  </h4>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                    {q.options.map((option, oIdx) => {
                                      const isSelected = selectedIdx === oIdx;
                                      return (
                                        <button
                                          key={oIdx}
                                          id={`quiz-option-btn-${q.id}-${oIdx}`}
                                          disabled={quizSubmitted && quizPassed}
                                          onClick={() => handleQuizAnswerSelect(q.id, oIdx)}
                                          className={`p-3 rounded-xl text-left text-xs transition-all flex items-start gap-2 border ${
                                            isSelected 
                                              ? "bg-amber-500/10 border-amber-500 text-amber-400 font-bold" 
                                              : "bg-slate-950 border-slate-900 text-slate-300 hover:border-slate-800"
                                          }`}
                                        >
                                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0 ${
                                            isSelected ? "border-amber-500 bg-amber-500/20" : "border-slate-800"
                                          }`}>
                                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                                          </span>
                                          {option}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}

                            {/* Submit Actions */}
                            <div className="pt-4 border-t border-slate-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              <p className="text-xs text-slate-500 italic max-w-md font-light">
                                Presiona Verificar Respuestas. Para aprobar formalmente debes tener el 100% correctas. Puedes reintentar las veces que requieras.
                              </p>
                              
                              <div className="flex gap-3">
                                <button
                                  id="submit-quiz-answers-btn"
                                  onClick={() => handleSubmitQuiz(evalStep.quizQuestions || [], "phase_1")}
                                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow shadow-amber-500/10 font-display"
                                >
                                  Verificar Respuestas
                                </button>
                              </div>
                            </div>

                            {/* Feedback evaluation */}
                            {quizSubmitted && (
                              <div className={`p-4 rounded-2xl border flex items-start gap-3 animate-fadeIn ${
                                quizPassed 
                                  ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                                  : "bg-rose-950/20 border-rose-500/30 text-rose-300"
                              }`} id="quiz-result-message-box">
                                {quizPassed ? (
                                  <>
                                    <Check className="w-5 h-5 text-emerald-450 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <p className="text-xs font-bold uppercase tracking-wider">¡Aprobado con Distinción Científica!</p>
                                      <p className="text-xs mt-0.5 text-slate-300 font-light">¡Fabuloso! Tu puntuación fue perfecta. Has asimilado la lógica secuencial y condicional. Has desbloqueado formalmente tu insignia de Lógica de Oro en el Cuaderno.</p>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="w-5 h-5 text-rose-450 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <p className="text-xs font-bold uppercase tracking-wider">Algunas respuestas no son lógicas todavía</p>
                                      <p className="text-xs mt-0.5 text-slate-300 font-light">Por favor, repasa las preguntas señaladas o la teoría en el taller. La perseverancia intelectual es la base de todo mentor.</p>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}

                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* PROJECT TEST WORKSPACE FOR FASE 2 & FASE 3 DISPLAY */}
              {(selectedPhaseId === "phase_2" || selectedPhaseId === "phase_3") && (
                <div 
                  id="project-test-panel"
                  className={`glass-card rounded-3xl p-6 md:p-8 space-y-6 transition-all border ${
                    (selectedPhaseId === "phase_2" ? completedStepIds.includes("step_phase2_module") : completedStepIds.includes("step_phase3_module"))
                      ? "border-amber-500/20 bg-slate-900/25" 
                      : "border-slate-900 opacity-60 bg-slate-950/20"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
                    <div>
                      <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 text-[9px] font-black uppercase rounded border border-amber-500/20">
                        Reto de Certificación Práctico • {selectedPhaseId === "phase_2" ? "Fase 2" : "Fase 3"}
                      </span>
                      <h3 className="text-lg md:text-xl font-bold font-display text-white mt-1.5">
                        {selectedPhaseId === "phase_2" ? "Desafío: Calculadora Básica Interactiva" : "Desafío: Sistema Personal de Organización"}
                      </h3>
                    </div>

                    <span className="text-xs font-mono text-slate-450 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                      Requisito: Madurar la {selectedPhaseId === "phase_2" ? "Fase 2" : "Fase 3"}
                    </span>
                  </div>

                  {!(selectedPhaseId === "phase_2" ? completedStepIds.includes("step_phase2_module") : completedStepIds.includes("step_phase3_module")) && !isAdminMode ? (
                    <div className="p-8 text-center space-y-3 bg-slate-950/50 rounded-2xl border border-slate-900">
                      <Lock className="w-10 h-10 text-slate-700 mx-auto" />
                      <h4 className="text-sm font-bold text-slate-400 uppercase">Reto Bloqueado temporalmente</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto font-light">
                        Debes completar primero todas las lecciones del taller interactivo de la {selectedPhaseId === "phase_2" ? "Fase 2 (Primer Lenguaje)" : "Fase 3 (Resolver Problemas)"} para darte de alta en este desafío de certificación práctica.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
                      
                      {/* Instructions of challenge */}
                      <div className="xl:col-span-5 space-y-4 flex flex-col justify-between">
                        <div className="p-5 bg-slate-950/65 rounded-2xl border border-slate-900 space-y-3">
                          <span className="text-xs font-bold text-amber-500 uppercase tracking-wider block flex items-center gap-1">
                            <FileText className="w-4 h-4 text-amber-550" />
                            Instrucciones del Certificador:
                          </span>
                          
                          <p className="text-xs leading-relaxed text-slate-300 font-light pt-1 border-t border-slate-900">
                            {pathSteps.find(s => s.phaseId === selectedPhaseId && s.type === "phase_project")?.projectTemplate?.instructions || "Completa el desafío propuesto utilizando el editor integrado."}
                          </p>
                          <p className="text-xs leading-relaxed text-slate-450 italic font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-800/50">
                            {selectedPhaseId === "phase_2" 
                              ? "Variables requeridas: operacion, num1, num2, resultado, error_detectado."
                              : "Variables requeridas: consulta_tipo, conteo_items, estado_completado, total_estimado, limite_excedido, total_contactos, error_consulta."}
                          </p>
                        </div>

                        {projectSuccess ? (
                          <div className="p-4 bg-emerald-950/20 border border-emerald-500/25 text-emerald-400 rounded-2xl flex items-start gap-2.5 animate-fadeIn" id="project-congratulations-box">
                            <CheckCircle className="w-5 h-5 text-emerald-450 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider">¡Código Correcto y Homologado!</p>
                              <p className="text-xs mt-0.5 text-slate-300 leading-relaxed font-light">
                                {selectedPhaseId === "phase_2"
                                  ? `¡Excelente desarrollo de la Calculadora, ${studentName || "Alberto"}! Lograste procesar y validar las operaciones aritméticas en Python de forma impecable.`
                                  : `¡Excelente desarrollo lógico, ${studentName || "Alberto"}! Lograste resolver el desafío del Sistema Personal de Organización con éxito absoluto.`}
                              </p>
                              
                              <button
                                id="claim-project-badge-btn"
                                onClick={() => {
                                  const currentProjectStep = pathSteps.find(s => s.phaseId === selectedPhaseId && s.type === "phase_project");
                                  if (currentProjectStep) {
                                    const phase = curriculum.find(p => p.id === selectedPhaseId);
                                    handleCompleteProject(currentProjectStep.id, phase?.badgeName || "Placa Profesional Python");
                                  }
                                }}
                                className="mt-3 px-4 py-2 bg-emerald-500 hover:bg-emerald-450 text-slate-950 text-xs font-black rounded-xl transition flex items-center gap-1.5 font-display"
                              >
                                Registrar Logro de Proyecto
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 bg-slate-950/80 border border-slate-900 rounded-2xl flex items-start gap-2.5 text-slate-400">
                            <AlertCircle className="w-5 h-5 text-amber-550 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-slate-350">Esperando complacencia de requisitos...</p>
                              <p className="text-xs mt-0.5 text-slate-405 leading-relaxed font-light">Edita el programa a la derecha asegurándote de usar los valores y variables requeridas para habilitar la firma de tu logro.</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Integrated mini code Editor challenge */}
                      <div className="xl:col-span-7 space-y-3">
                        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 gap-3 flex flex-col">
                          <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                            <span>{selectedPhaseId === "phase_2" ? "CALCULADORA_INTERACTIVA.PY" : "SISTEMA_ORGANIZADOR.PY"}</span>
                            
                            <button
                              id="run-project-evalution-btn"
                              onClick={() => {
                                const step = pathSteps.find(s => s.phaseId === selectedPhaseId && s.type === "phase_project");
                                if (step?.projectTemplate) {
                                  handleRunProject(step.projectTemplate.solutionKeywords);
                                }
                              }}
                              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 font-display"
                            >
                              <Play className="w-3 h-3 fill-slate-950" />
                              Validar Lógica
                            </button>
                          </div>

                          <textarea
                            id="project-editor-textarea"
                            value={projectCode}
                            onChange={(e) => {
                              setProjectCode(e.target.value);
                              setProjectSuccess(false);
                            }}
                            className={`w-full h-48 p-3 bg-slate-900 border border-slate-800 rounded-xl font-mono text-amber-100 outline-none resize-none ${getFontSizeClass("code")}`}
                            placeholder="// Completa tu validador..."
                          />

                          {/* Logs outcome */}
                          <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 font-mono text-xs max-h-24 overflow-y-auto space-y-1">
                            <span className="text-[9px] text-slate-500 uppercase block tracking-wider font-mono">Consola del Reto:</span>
                            {projectLogs.map((log, lIdx) => (
                              <div key={lIdx} className="text-emerald-450">
                                » {log}
                              </div>
                            ))}
                            {projectLogs.length === 0 && (
                              <span className="text-[10px] text-slate-650 italic">No hay outputs en cola...</span>
                            )}
                            {projectError && (
                              <p className="text-rose-455 text-[11px] font-bold">⚠️ Error: {projectError}</p>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* ================================== TAB 4: NOTEBOOK & PROGRESS ================================== */}
          {activeTab === "progreso" && (
            <div className="space-y-6 animate-slideUp" id="panel-notebook">
              
              <div className="glass-card rounded-3xl p-6 md:p-8 space-y-5">
                <div className="border-b border-slate-800/80 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className={`font-semibold text-white ${getFontSizeClass("title")} flex items-center gap-2`}>
                      📓 Cuaderno de Progreso y Anotaciones
                    </h2>
                    <p className={`${getFontSizeClass("body")} text-slate-400 font-light`}>
                      Tu cuaderno de notas físicas virtual. Aquí se consolidan tus logros didácticos y puedes archivar notas escritas para no olvidar ningún concepto técnico clave.
                    </p>
                  </div>

                  <span className="inline-block px-3.5 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl font-mono">
                    Estudiante ID: {studentName.slice(0,3).toUpperCase()}_45_MENTOR
                  </span>
                </div>

                {/* Grid stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Estaciones Superadas</span>
                    <p className="text-3xl font-extrabold text-amber-500 font-display mt-1">{completedStepIds.length} <span className="text-xs text-slate-600">/ {totalPathSteps}</span></p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Insignias y Diplomas</span>
                    <p className="text-3xl font-extrabold text-amber-500 font-display mt-1">
                      { (completedStepIds.includes("step_phase1_eval") ? 1 : 0) + (completedStepIds.includes("step_phase2_project") ? 1 : 0) + (completedStepIds.includes("step_finish") ? 1 : 0) }
                    </p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Tipo de Pedagogía</span>
                    <p className="text-sm font-semibold text-slate-300 mt-2 flex items-center gap-1">
                      <BookOpenCheck className="w-4 h-4 text-emerald-450" />
                      Sin Frustraciones 45+
                    </p>
                  </div>
                </div>
              </div>

              {/* CURRICULUM COMPLETION LINE CHART */}
              <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6" id="notebook-completion-chart-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-4">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase rounded border border-amber-500/20 flex items-center gap-1.5 w-max">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Analítica de Aprendizaje
                    </span>
                    <h3 className="text-lg font-bold text-white font-display flex items-center gap-2 mt-1">
                      <LineIcon className="w-5 h-5 text-amber-550" />
                      Métrica de Asimilación Temporal
                    </h3>
                    <p className="text-xs text-slate-400 font-light">
                      Visualiza el porcentaje cumulativo completado del plan de estudios durante los últimos 7 días lectivos en base a tus hitos acreditados.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-2xl border border-slate-900 text-xs font-mono text-slate-400 self-start sm:self-center">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    <span>Últimos 7 Días</span>
                  </div>
                </div>

                <div className="h-64 sm:h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getCompletionRateOverTime()}
                      margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                      <XAxis 
                        dataKey="fecha" 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={10} 
                        domain={[0, 100]} 
                        tickFormatter={(v) => `${v}%`}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#020617', 
                          borderColor: '#1e293b',
                          borderRadius: '12px',
                          color: '#f8fafc',
                          fontSize: '12px',
                          fontFamily: 'system-ui'
                        }}
                        formatter={(value: any) => [`${value}%`]}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} 
                        verticalAlign="bottom" 
                        align="center"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Avance Real (%)" 
                        stroke="#f59e0b" 
                        strokeWidth={3} 
                        activeDot={{ r: 6 }} 
                        dot={{ r: 4, fill: '#f59e0b', strokeWidth: 1 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Meta Recomendada (%)" 
                        stroke="#10b981" 
                        strokeWidth={2} 
                        strokeDasharray="4 4"
                        dot={false}
                        opacity={0.6}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Insignias display trophies panels inside notebook */}
              <div className="glass-card rounded-3xl p-6 md:p-8 space-y-4">
                <h3 className="text-lg font-bold text-white font-display">Insignias y Galardones Institucionales</h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed">Las insignias atestiguan tus logros técnicos. Saboréalas: representan horas de maduración intelectual analítica.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  
                  {/* Badge 1 */}
                  <div className={`p-5 rounded-2xl border flex flex-col items-center text-center space-y-3 ${
                    completedStepIds.includes("step_phase1_eval") 
                      ? "bg-slate-900/40 border-amber-500/25 cursor-pointer hover:border-amber-500/40 transition" 
                      : "bg-slate-950/20 border-slate-900 opacity-40 select-none"
                  }`}>
                    <Trophy className={`w-12 h-12 ${completedStepIds.includes("step_phase1_eval") ? "text-amber-500 animate-pulse-glow" : "text-slate-700"}`} />
                    <div>
                      <h4 className="text-sm font-bold text-white">Insignia Lógica de Oro</h4>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Concedida al resolver y aprobar el cuestionario de condicionales de la Fase 1.</p>
                    </div>
                  </div>

                  {/* Badge 2 */}
                  <div className={`p-5 rounded-2xl border flex flex-col items-center text-center space-y-3 ${
                    completedStepIds.includes("step_phase2_project") 
                      ? "bg-slate-900/40 border-amber-500/25 cursor-pointer hover:border-amber-500/40 transition" 
                      : "bg-slate-950/20 border-slate-900 opacity-40 select-none"
                  }`}>
                    <Trophy className={`w-12 h-12 ${completedStepIds.includes("step_phase2_project") ? "text-amber-500 animate-pulse-glow" : "text-slate-700"}`} />
                    <div>
                      <h4 className="text-sm font-bold text-white">Placa Profesional Python</h4>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Concedida tras resolver exitosamente el proyecto de la calculadora básica interactiva en Python.</p>
                    </div>
                  </div>

                  {/* Badge 3 */}
                  <div className={`p-5 rounded-2xl border flex flex-col items-center text-center space-y-3 ${
                    completedStepIds.includes("step_phase3_project") 
                      ? "bg-slate-900/40 border-amber-500/25 cursor-pointer hover:border-amber-500/40 transition" 
                      : "bg-slate-950/20 border-slate-900 opacity-40 select-none"
                  }`}>
                    <Trophy className={`w-12 h-12 ${completedStepIds.includes("step_phase3_project") ? "text-amber-500 animate-pulse-glow" : "text-slate-700"}`} />
                    <div>
                      <h4 className="text-sm font-bold text-white">Laurel de Algoritmia Avanzada</h4>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Concedida tras resolver exitosamente el proyecto del sistema personal de organización de la Fase 3.</p>
                    </div>
                  </div>

                  {/* Badge 4 */}
                  <div className={`p-5 rounded-2xl border flex flex-col items-center text-center space-y-3 ${
                    completedStepIds.includes("step_finish") 
                      ? "bg-slate-900/40 border-amber-500/25 cursor-pointer hover:border-amber-500/40 transition" 
                      : "bg-slate-950/20 border-slate-900 opacity-40 select-none"
                  }`}>
                    <Trophy className={`w-12 h-12 ${completedStepIds.includes("step_finish") ? "text-amber-500 animate-pulse-glow" : "text-slate-700"}`} />
                    <div>
                      <h4 className="text-sm font-bold text-white">Laurel de Graduación</h4>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Felicidades, has completado todas las paradas teóricas del camino para adultos.</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Personal binder notes writer */}
              <div className="glass-card rounded-3xl p-6 md:p-8 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                  <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                    ✍️ Mis Anotaciones Personales de Estudio
                  </h3>

                  <button
                    id="save-my-notes-btn"
                    onClick={handleSaveNotes}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow font-display"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {notesSaveStatus ? "¡Guardado!" : "Guardar Notas"}
                  </button>
                </div>

                <div className="space-y-1">
                  <p className="text-[11px] text-slate-450 italic">Su cuaderno físico virtual se guarda de manera segura de forma local en su navegador.</p>
                  
                  <textarea
                    id="my-study-notes-textarea"
                    value={studentNotes}
                    onChange={(e) => setStudentNotes(e.target.value)}
                    className="w-full h-48 p-4 bg-slate-950 border border-slate-900 rounded-2xl text-slate-200 outline-none resize-none text-xs md:text-sm font-sans focus:border-amber-500/40 leading-relaxed"
                    placeholder="Escribe tus reflexiones, apuntes de clase y resúmenes personales..."
                  />
                </div>
              </div>

            </div>
          )}

          {/* ================================== TAB 5: PHILOSOPHY & PEDAGOGY ================================== */}
          {activeTab === "ayuda" && (
            <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6 animate-slideUp animate-fadeIn" id="panel-philosophy">
              <div className="border-b border-slate-800 pb-4">
                <h2 className={`font-semibold text-white ${getFontSizeClass("title")} flex items-center gap-2.5`}>
                  🧠 Filosofía Pedagógica para Adultos Mentores
                </h2>
                <p className={`${getFontSizeClass("body")} text-slate-400 font-light mt-1.5`}>
                  Por qué aprender ciencias lógicas en esta etapa de tu vida no solo es posible, sino que cuentas con una inmensa ventaja comparativa de maduración intelectual.
                </p>
              </div>

              <div className="space-y-6 text-sm text-slate-300 leading-relaxed font-light">
                <div className="p-5 bg-slate-900/40 rounded-2xl border-l-4 border-amber-500/80 space-y-2">
                  <h4 className="font-bold text-white text-base font-display">1. Tu experiencia es tu mejor pseudocódigo</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Un joven a menudo memoriza sintaxis estricta de manera refleja, pero patina en la organización secuencial de una solución. Tú, con más de 45 años de análisis racional resolviendo problemas de vida, negocios, burocracia y finanzas, ya eres un pensador lógico innato. Programar es simplemente verbalizar esas secuencias en pasos muy simples.
                  </p>
                </div>

                <div className="p-5 bg-slate-900/40 rounded-2xl border-l-4 border-amber-500/80 space-y-2">
                  <h4 className="font-bold text-white text-base font-display">2. Primero Lógica, Luego Sintaxis Real</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    La mayoría de cursos introducen paréntesis, corchetes, comandos raros y reglas ortográficas súper estrictas el primer día, matando el entusiasmo del estudiante adulto. En esta plataforma, primero entiendes el **flujo del pensamiento** y resuelves problemas cotidianos. La transición hacia lenguajes formales se vuelve simple, lógica y lúdica.
                  </p>
                </div>

                <div className="p-5 bg-slate-900/40 rounded-2xl border-l-4 border-amber-500/80 space-y-2">
                  <h4 className="font-bold text-white text-base font-display">3. Sin Prisa, Con Continuidad</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    El cerebro maduro asimila la información asociándola con experiencias preexistentes (aprendizaje significativo). No busques aprender de golpe. Dedica 15 o 20 minutos por estación, haz las anotaciones en tu **Cuaderno de Progreso** y permite al cerebro entablar nuevas redes de sinapsis lógicas en reposo. ¡Aprender es rejuvenecer!
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-slate-500">
                <span className="font-mono italic">&ldquo;Un paso cada día te llevará a la maestría definitiva.&rdquo;</span>
                <a 
                  href="https://python.org" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-amber-500 hover:text-amber-400 font-bold flex items-center gap-1.5 transition"
                >
                  Documentación Oficial de Python 
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* ================================== TAB: ADMINISTRATOR / CREATOR HUB ================================== */}
          {activeTab === "admin" && isAdminMode && (
            <div className="glass-card rounded-3xl p-6 md:p-8 space-y-8 animate-slideUp animate-fadeIn" id="panel-admin-hub">
              
              {/* Header Title */}
              <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-white font-display flex items-center gap-2.5">
                    <Shield className="w-6 h-6 text-amber-500 animate-pulse" />
                    Panel de Administración del Creador
                  </h2>
                  <p className="text-xs text-slate-400 font-light mt-1.5 leading-relaxed">
                    Privilegios elevados de control y simulación pedagógica. Monitorea estudiantes, resetea módulos de avance y pre-completa fases para pruebas rápidas.
                  </p>
                </div>
                
                <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs uppercase px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  Almacenamiento Local Activo
                </div>
              </div>

              {/* Quick Actions Alert */}
              <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-slate-200">Enfoque Técnico y Enlace Reactivo</p>
                  <p className="text-slate-400 font-light leading-relaxed">
                    Cualquier cambio de progreso o eliminación de alumnos en este panel se verá reflejado inmediatamente en la **Barra de Avance General** (ubicada en la cabecera superior), en los medidores de estadísticas, en el cuaderno de bitácora y en los gráficos temporales.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* Left Side: Accounts Management */}
                <div className="space-y-6">
                  
                  {/* Register student custom form */}
                  <div className="bg-slate-900/35 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-amber-500" />
                      Registrar Nuevo Alumno
                    </h3>
                    
                    <form onSubmit={handleAdminCreateUser} className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase block">Nombre de Alumno</label>
                          <input
                            type="text"
                            value={adminNewName}
                            onChange={(e) => setAdminNewName(e.target.value)}
                            placeholder="Ej. Alberto"
                            className="bg-slate-950 text-xs text-white border border-slate-800 focus:border-amber-500 outline-none rounded-xl px-3 py-2.5 w-full"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase block">Usuario (Para Login)</label>
                          <input
                            type="text"
                            value={adminNewUsername}
                            onChange={(e) => setAdminNewUsername(e.target.value)}
                            placeholder="Ej. alberto99"
                            className="bg-slate-950 text-xs text-white border border-slate-800 focus:border-amber-500 outline-none rounded-xl px-3 py-2.5 w-full"
                          />
                        </div>
                      </div>
                      
                      <div className="flex gap-3 items-end">
                        <div className="space-y-1 flex-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase block">PIN de Acceso (4 dígitos)</label>
                          <input
                            type="text"
                            maxLength={4}
                            value={adminNewPin}
                            onChange={(e) => setAdminNewPin(e.target.value)}
                            placeholder="1234"
                            className="bg-slate-950 text-xs text-white border border-slate-800 focus:border-amber-500 outline-none rounded-xl px-3 py-2.5 w-full font-mono"
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow"
                        >
                          <Check className="w-4 h-4" />
                          Crear Alumno
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Registered Students table */}
                  <div className="bg-slate-900/35 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-amber-400" />
                      Cuentas Activas Registradas en el Sistema
                    </h3>

                    <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1">
                      {registeredUsers.map((user) => {
                        const isSelf = currentUser?.toLowerCase() === user.username.toLowerCase();
                        const isEditing = editingUsernameForPin === user.username;

                        if (isEditing) {
                          return (
                            <div key={user.username} className="p-3.5 rounded-xl border border-amber-500 bg-slate-900/60 flex flex-col gap-3">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[9px] text-amber-400 block font-bold uppercase">Nombre Visible</label>
                                  <input
                                    type="text"
                                    value={editingNameValue}
                                    onChange={(e) => setEditingNameValue(e.target.value)}
                                    className="bg-black text-[11px] text-white px-2 py-1 border border-slate-700 rounded w-full"
                                  />
                                </div>
                                <div>
                                  <label className="text-[9px] text-amber-400 block font-bold uppercase">PIN de Acceso</label>
                                  <input
                                    type="text"
                                    maxLength={4}
                                    value={editingPinValue}
                                    onChange={(e) => setEditingPinValue(e.target.value)}
                                    className="bg-black text-[11px] text-white px-2 py-1 border border-slate-700 rounded w-full font-mono"
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => setEditingUsernameForPin(null)}
                                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] border border-slate-755"
                                >
                                  Cancelar
                                </button>
                                <button
                                  onClick={() => handleUpdateUserPinAndName(user.username)}
                                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-[10px]"
                                >
                                  Guardar
                                </button>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div 
                            key={user.username}
                            className={`p-3 rounded-xl border flex items-center justify-between transition ${
                              isSelf ? "bg-amber-500/5 border-amber-500/20" : "bg-slate-950/60 border-slate-800/60 hover:border-slate-800"
                            }`}
                          >
                            <div className="space-y-0.5">
                              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                                {user.name}
                                {isSelf && (
                                  <span className="bg-amber-500/10 text-amber-500 text-[8px] font-bold px-2 py-0.5 rounded border border-amber-500/20">
                                    Sesión Abierta
                                  </span>
                                )}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono">
                                Usuario: <span className="text-slate-300">{user.username}</span> • PIN: <span className="text-amber-400">{user.pin}</span>
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setEditingUsernameForPin(user.username);
                                  setEditingPinValue(user.pin);
                                  setEditingNameValue(user.name);
                                }}
                                className="p-1 text-slate-400 hover:text-amber-400 hover:bg-slate-900 rounded transition"
                                title="Editar nombre o PIN"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              {!isSelf && (
                                <button
                                  onClick={() => handleAcceder(user)}
                                  className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-bold rounded-lg border border-slate-800 transition"
                                  title="Iniciar sesión en esta cuenta"
                                >
                                  Acceder
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  if (isSelf) {
                                    showConfirm(
                                      "Eliminar tu propia cuenta",
                                      "Estás batiendo tu propia cuenta activa con sesión abierta. Esto te sacará del sistema y cerrará la sesión de manera segura. ¿Deseas proceder con la eliminación?",
                                      () => {
                                        const remainingUsers = registeredUsers.filter(u => u.username !== user.username);
                                        setRegisteredUsers(remainingUsers);
                                        localStorage.setItem("adult_mentor_registered_users", JSON.stringify(remainingUsers));
                                        
                                        localStorage.removeItem(`adult_mentor_name_${user.username}`);
                                        localStorage.removeItem(`adult_mentor_completed_steps_${user.username}`);
                                        localStorage.removeItem(`adult_mentor_completed_dates_${user.username}`);
                                        localStorage.removeItem(`adult_mentor_completed_lessons_${user.username}`);
                                        localStorage.removeItem(`adult_mentor_notes_${user.username}`);
                                        localStorage.removeItem(`adult_mentor_active_tab_${user.username}`);
                                        localStorage.removeItem(`adult_mentor_text_size_${user.username}`);
                                        
                                        handleLogout();
                                      },
                                      true
                                    );
                                  } else {
                                    handleDeleteUser(user.username);
                                  }
                                }}
                                className="p-1.5 bg-rose-500/10 border border-rose-500/25 text-rose-400 hover:bg-rose-600 hover:text-white rounded-lg transition"
                                title={isSelf ? "Eliminar tu propia cuenta activa (te deslogueará)" : "Eliminar cuenta de alumno"}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Right Side: Modules & Progress force brute features */}
                <div className="space-y-6">
                  
                  {/* Forced simulations & Fast unlocks */}
                  <div className="bg-slate-900/35 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Aceleradores de Simulación y Flujo
                    </h3>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Utiliza estas potentes plantillas de fuerza bruta para testear flujos, examinar insignias, certificar estudiantes y corroborar la solidez de la experiencia de usuario.
                    </p>

                    <div className="space-y-2.5 pt-1">
                      
                      <button
                        onClick={handleAdminCompleteAll}
                        className="w-full text-left p-3.5 bg-gradient-to-r from-amber-950/30 to-amber-900/20 hover:from-amber-950/40 hover:to-amber-900/30 active:scale-99 transition rounded-xl border border-amber-500/20 flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-amber-400 block font-display">Acelerar al 100% de Progreso (Completar Curso)</span>
                          <span className="text-[10px] text-amber-400 font-light block">Simula que el alumno actual completó todas las fases y lecciones con éxito.</span>
                        </div>
                        <CheckCircle className="w-5 h-5 text-amber-400 shrink-0" />
                      </button>

                      <button
                        onClick={handleAdminResetUser}
                        className="w-full text-left p-3.5 bg-slate-950 hover:bg-slate-900 active:scale-99 transition rounded-xl border border-slate-800 flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-200 block font-display">Restablecer Alumno de Cero</span>
                          <span className="text-[10px] text-slate-400 font-light block">Elimina todo el progreso del alumno actual para simular el inicio limpio del curso.</span>
                        </div>
                        <RotateCcw className="w-4 h-4 text-slate-400 shrink-0" />
                      </button>

                      <button
                        onClick={handleAdminResetDatabase}
                        className="w-full text-left p-3.5 bg-red-950/10 hover:bg-red-950/15 border border-red-900/20 text-red-300 transition rounded-xl flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold block font-display text-red-300">Restablecer Servidor / Clientes por Defecto</span>
                          <span className="text-[10px] text-red-400 block font-light">Elimina cuentas personalizadas y restablece la base de datos a Alberto y Beatriz como predeterminados.</span>
                        </div>
                        <Database className="w-4 h-4 text-red-400 shrink-0" />
                      </button>
                    </div>
                  </div>

                  {/* Micro-Controller step toggler */}
                  <div className="bg-slate-900/35 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-amber-400" />
                      Micro-Controlador de Estaciones Lógicas
                    </h3>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Habilita o deshabilita individualmente cada estación del camino de aprendizaje del alumno. Observa cómo la barra de avance general superior recalcula el porcentaje exacto en tiempo real.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {pathSteps.map((estacion, idx) => {
                        return (
                          <label 
                            key={estacion.id} 
                            className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer selection:bg-transparent transition ${
                              estacionesCompletadas.includes(estacion.id)
                                ? "bg-slate-900/80 border-amber-500/20 text-amber-400" 
                                : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={estacionesCompletadas.includes(estacion.id)}
                              onChange={() => toggleEstacion(estacion.id)}
                              className="accent-amber-500 rounded cursor-pointer"
                            />
                            <div className="leading-tight">
                              <span className="text-[9px] block text-slate-550 uppercase font-mono">Estación {idx + 1}</span>
                              <span className="font-bold truncate max-w-32 block">{estacion.label}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>

              {/* Advanced CMS content creator */}
              <div className="border-t border-slate-900 pt-8 mt-6 space-y-6" id="cms-advanced-container">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
                      <Settings className="w-5 h-5 text-amber-500 animate-spin-slow" />
                      Modo Creador / Admin: Gestor de Recursos (CMS)
                    </h2>
                    <p className="text-xs text-slate-400 font-light mt-0.5" id="cms-subtitle-explanation">
                      Por orden del Modo Creador / Administrador, todos los cambios realizados en las estaciones y lecciones son **persistentes en LocalStorage** y se conectan en tiempo real con las vistas de alumnos.
                    </p>
                  </div>

                  {/* Sub-tab selectors */}
                  <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 gap-1 self-start md:self-center" id="cms-subtabs">
                    <button
                      type="button"
                      onClick={() => setAdminSubTab("stations")}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                        adminSubTab === "stations" 
                          ? "bg-amber-500 text-slate-950 shadow" 
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Estaciones de Ruta
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminSubTab("lessons")}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                        adminSubTab === "lessons" 
                          ? "bg-amber-500 text-slate-950 shadow" 
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Lecciones & Capítulos
                    </button>
                  </div>
                </div>

                {adminSubTab === "stations" ? (
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start" id="cms-stations-layout">
                    {/* Dynamic list of Stations */}
                    <div className="xl:col-span-5 bg-slate-900/10 border border-slate-900 rounded-2xl p-5 space-y-4">
                      <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center justify-between">
                        <span>Estaciones Lógicas ({pathSteps.length})</span>
                        <span className="text-[9.5px] font-mono text-slate-500 uppercase">CMS Activo</span>
                      </h3>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        Haz clic en &ldquo;Crear Estación Nueva&rdquo; para agregar paradas lúdicas, o selecciona cualquier estación preestablecida abajo para editar su texto, tipo y fase en el mapa interactivo.
                      </p>

                      <div className="space-y-2 max-h-96 overflow-y-auto pr-1" id="cms-stations-cards-scroller">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStationIdForForm("new");
                            setStationFormId("");
                            setStationFormLabel("");
                            setStationFormType("phase_module");
                            setStationFormDesc("");
                            setStationFormLearn("");
                            setStationFormPractice("");
                            setStationFormEval("");
                            setStationFormUnlock("");
                            setStationFormPhaseId("");
                          }}
                          className={`w-full p-2.5 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition ${
                            selectedStationIdForForm === "new"
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                              : "bg-slate-950/40 border-slate-900 hover:bg-slate-900/25 text-slate-300"
                          }`}
                        >
                          <span>✨ Crear Estación Nueva...</span>
                          <Plus className="w-3.5 h-3.5 text-amber-500" />
                        </button>

                        {pathSteps.map((step, idx) => {
                          const isSelected = selectedStationIdForForm === step.id;
                          return (
                            <div
                              key={step.id}
                              className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition ${
                                isSelected
                                  ? "bg-amber-500/5 border-amber-500/35 text-amber-400"
                                  : "bg-slate-950/60 border-slate-900 hover:bg-slate-900/30 text-slate-300"
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedStationIdForForm(step.id);
                                  setStationFormId(step.id);
                                  setStationFormLabel(step.label);
                                  setStationFormType(step.type);
                                  setStationFormDesc(step.description);
                                  setStationFormLearn(step.whatYouWillLearn || "");
                                  setStationFormPractice(step.practiceToRealize || "");
                                  setStationFormEval(step.evaluationCondition || "");
                                  setStationFormUnlock(step.whatItUnlocks || "");
                                  setStationFormPhaseId(step.phaseId || "");
                                }}
                                className="flex-1 text-left text-xs space-y-0.5 truncate"
                              >
                                <span className="font-mono text-[9px] text-slate-500 uppercase block">Estación {idx + 1} • {step.type}</span>
                                <span className="font-bold block truncate">{step.label}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteStation(step.id)}
                                className="p-1 rounded hover:bg-slate-900/80 text-rose-500 hover:text-rose-450 transition shrink-0"
                                title="Eliminar estación permanentemente"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* station editor form */}
                    <form onSubmit={handleSaveStation} className="xl:col-span-7 bg-slate-900/35 border border-slate-800/80 rounded-2xl p-5 space-y-4" id="cms-station-card-form">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Sliders className="w-4 h-4 text-amber-500" />
                        {selectedStationIdForForm === "new" ? "Establecer Nueva Estación en la Ruta" : `Formulario de Estación: ${selectedStationIdForForm}`}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase block">Identificador Único (Slug ID)</label>
                          <input
                            type="text"
                            value={stationFormId}
                            onChange={(e) => setStationFormId(e.target.value)}
                            disabled={selectedStationIdForForm !== "new"}
                            placeholder="p.ej., step_conditionals"
                            className="bg-slate-950 text-xs text-white border border-slate-850 focus:border-amber-500 outline-none rounded-xl px-3 py-2.5 w-full disabled:opacity-50"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase block">Nombre de la Estación (Etiqueta)</label>
                          <input
                            type="text"
                            value={stationFormLabel}
                            onChange={(e) => setStationFormLabel(e.target.value)}
                            placeholder="Estación 4: Condicionales y Decisiones"
                            className="bg-slate-950 text-xs text-white border border-slate-850 focus:border-amber-500 outline-none rounded-xl px-3 py-2.5 w-full"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase block">Categoría / Tipo de Estación</label>
                          <select
                            value={stationFormType}
                            onChange={(e) => setStationFormType(e.target.value as StepType)}
                            className="bg-slate-950 text-xs text-white border border-slate-850 focus:border-amber-500 outline-none rounded-xl px-3 py-2.5 w-full"
                          >
                            <option value="phase_module">Módulo Conceptual / Instrucción</option>
                            <option value="phase_eval">Examen / Quiz Evaluativo</option>
                            <option value="phase_project">Caso Práctico Interactivo</option>
                            <option value="start">Inicio</option>
                            <option value="finish">Graduación / Final</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase block">Fase Curricular Vinculada (Opcional)</label>
                          <select
                            value={stationFormPhaseId}
                            onChange={(e) => setStationFormPhaseId(e.target.value)}
                            className="bg-slate-950 text-xs text-white border border-slate-850 focus:border-amber-500 outline-none rounded-xl px-3 py-2.5 w-full"
                          >
                            <option value="">Ninguna</option>
                            {curriculum.map(p => (
                              <option key={p.id} value={p.id}>{p.title}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase block">Descripción del Objetivo Informativo</label>
                        <textarea
                          value={stationFormDesc}
                          onChange={(e) => setStationFormDesc(e.target.value)}
                          placeholder="Aquí se describe la esencia de este hito de manera comprensible..."
                          className="bg-slate-950 text-xs text-white border border-slate-850 focus:border-amber-500 outline-none rounded-xl px-3 py-2 w-full h-16 resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase block">Qué Aprenderá la Persona</label>
                          <input
                            type="text"
                            value={stationFormLearn}
                            onChange={(e) => setStationFormLearn(e.target.value)}
                            placeholder="Los conceptos clave de memoria..."
                            className="bg-slate-950 text-xs text-white border border-slate-850 focus:border-amber-500 outline-none rounded-xl px-3 py-2 w-full"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase block">Práctica Realizada</label>
                          <input
                            type="text"
                            value={stationFormPractice}
                            onChange={(e) => setStationFormPractice(e.target.value)}
                            placeholder="Ej. Escribir tu código y correr el interpreter..."
                            className="bg-slate-950 text-xs text-white border border-slate-850 focus:border-amber-500 outline-none rounded-xl px-3 py-2 w-full"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase block">Condición de Aprobación</label>
                          <input
                            type="text"
                            value={stationFormEval}
                            onChange={(e) => setStationFormEval(e.target.value)}
                            placeholder="Ej. Responder correctamente el cuestionario..."
                            className="bg-slate-950 text-xs text-white border border-slate-850 focus:border-amber-500 outline-none rounded-xl px-3 py-2 w-full"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase block">Beneficio / Desbloqueo</label>
                          <input
                            type="text"
                            value={stationFormUnlock}
                            onChange={(e) => setStationFormUnlock(e.target.value)}
                            placeholder="Ej. Acceso directo al proyecto lúdico..."
                            className="bg-slate-950 text-xs text-white border border-slate-850 focus:border-amber-500 outline-none rounded-xl px-3 py-2 w-full"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 justify-end pt-2">
                        {selectedStationIdForForm !== "new" && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedStationIdForForm("new");
                              setStationFormId("");
                              setStationFormLabel("");
                              setStationFormType("phase_module");
                              setStationFormDesc("");
                              setStationFormLearn("");
                              setStationFormPractice("");
                              setStationFormEval("");
                              setStationFormUnlock("");
                              setStationFormPhaseId("");
                            }}
                            className="px-3.5 py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-300 font-bold text-xs rounded-xl"
                          >
                            Cancelar Edición
                          </button>
                        )}
                        <button
                          type="submit"
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow"
                        >
                          <Check className="w-4 h-4" />
                          {selectedStationIdForForm === "new" ? "Establecer Nueva Estación" : "Guardar Modificaciones"}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start" id="cms-lessons-layout">
                    {/* Selector of Phase & list of chapters under it */}
                    <div className="xl:col-span-5 bg-slate-900/10 border border-slate-900 rounded-2xl p-5 space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase block">Fase de Estudios Objetivo</label>
                        <select
                          value={selectedPhaseIdForLessonAdmin}
                          onChange={(e) => {
                            setSelectedPhaseIdForLessonAdmin(e.target.value);
                            setSelectedLessonIdForForm("new");
                            setLessonFormId("");
                            setLessonFormTitle("");
                            setLessonFormSubtitle("");
                            setLessonFormContent("");
                            setLessonFormSnippet("");
                            setLessonFormExpectedOutput("");
                            setLessonFormGoal("");
                          }}
                          className="bg-slate-950 text-xs text-white border border-slate-800 focus:border-amber-500 outline-none rounded-xl px-3 py-2.5 w-full"
                        >
                          {curriculum.map(p => (
                            <option key={p.id} value={p.id}>{p.title}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] text-slate-500 uppercase font-bold font-mono tracking-wider block">Lecciones / Talleres creados en esta fase:</span>
                        
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedLessonIdForForm("new");
                            setLessonFormId("");
                            setLessonFormTitle("");
                            setLessonFormSubtitle("");
                            setLessonFormType("concept");
                            setLessonFormContent("");
                            setLessonFormSnippet("");
                            setLessonFormExpectedOutput("");
                            setLessonFormGoal("");
                          }}
                          className={`w-full p-2.5 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition ${
                            selectedLessonIdForForm === "new"
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                              : "bg-slate-950/40 border-slate-900 hover:bg-slate-900/25 text-slate-305"
                          }`}
                        >
                          <span>✨ Crear Lección Nueva...</span>
                          <Plus className="w-3.5 h-3.5 text-amber-500" />
                        </button>

                        <div className="space-y-2 max-h-80 overflow-y-auto pr-1" id="cms-lessons-cards-scroller">
                          {curriculum.find(p => p.id === selectedPhaseIdForLessonAdmin)?.lessons.map((lesson, idx) => {
                            const isSelected = selectedLessonIdForForm === lesson.id;
                            return (
                              <div
                                key={lesson.id}
                                className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition ${
                                  isSelected
                                    ? "bg-amber-500/5 border-amber-500/35 text-amber-400"
                                    : "bg-slate-950/60 border-slate-900 hover:bg-slate-900/30 text-slate-300"
                                  }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedLessonIdForForm(lesson.id);
                                    setLessonFormId(lesson.id);
                                    setLessonFormTitle(lesson.title);
                                    setLessonFormSubtitle(lesson.subtitle);
                                    setLessonFormType(lesson.type);
                                    setLessonFormContent(lesson.content);
                                    setLessonFormSnippet(lesson.codeSnippet || "");
                                    setLessonFormExpectedOutput(lesson.expectedOutput || "");
                                    setLessonFormGoal(lesson.explanationOfGoal || "");
                                  }}
                                  className="flex-1 text-left text-xs space-y-0.5 truncate"
                                >
                                  <span className="font-mono text-[9px] text-slate-500 uppercase block">Capítulo {idx + 1} • {lesson.type}</span>
                                  <span className="font-bold block truncate">{lesson.title}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteLesson(selectedPhaseIdForLessonAdmin, lesson.id)}
                                  className="p-1 rounded hover:bg-slate-900 text-rose-500 hover:text-rose-450 transition"
                                  title="Eliminar lección"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* lesson editor form */}
                    <form onSubmit={handleSaveLesson} className="xl:col-span-7 bg-slate-900/35 border border-slate-800/80 rounded-2xl p-5 space-y-4" id="cms-lesson-card-form">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Sliders className="w-4 h-4 text-amber-500" />
                        {selectedLessonIdForForm === "new" ? "Establecer Nueva Lección Didáctica" : `Editar Lección: ${selectedLessonIdForForm}`}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase block">ID de la Lección (Slug ID)</label>
                          <input
                            type="text"
                            value={lessonFormId}
                            onChange={(e) => setLessonFormId(e.target.value)}
                            disabled={selectedLessonIdForForm !== "new"}
                            placeholder="p.ej., l1_seq_intro"
                            className="bg-slate-950 text-xs text-white border border-slate-850 focus:border-amber-500 outline-none rounded-xl px-3 py-2.5 w-full disabled:opacity-50"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase block">Título de la Lección</label>
                          <input
                            type="text"
                            value={lessonFormTitle}
                            onChange={(e) => setLessonFormTitle(e.target.value)}
                            placeholder="Ingresar datos en memoria del PC"
                            className="bg-slate-950 text-xs text-white border border-slate-850 focus:border-amber-500 outline-none rounded-xl px-3 py-2.5 w-full"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase block">Subtítulo de Soporte</label>
                          <input
                            type="text"
                            value={lessonFormSubtitle}
                            onChange={(e) => setLessonFormSubtitle(e.target.value)}
                            placeholder="Clase interactiva para mentores"
                            className="bg-slate-950 text-xs text-white border border-slate-850 focus:border-amber-500 outline-none rounded-xl px-3 py-2.5 w-full"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase block">Metodología Didáctica</label>
                          <select
                            value={lessonFormType}
                            onChange={(e) => setLessonFormType(e.target.value as any)}
                            className="bg-slate-950 text-xs text-white border border-slate-850 focus:border-amber-500 outline-none rounded-xl px-3 py-2.5 w-full"
                          >
                            <option value="concept">Estudio Teórico / Reflexivo</option>
                            <option value="logic_exercise">Taller Interactivo con Consola Simulada</option>
                            <option value="python_primer">Guía Introductoria a Python</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase block">Contenido Educativo en formato Markdown (Soporta negritas, listas...)</label>
                        <textarea
                          value={lessonFormContent}
                          onChange={(e) => setLessonFormContent(e.target.value)}
                          placeholder="# Tu explicación conceptual didáctica..."
                          className="bg-slate-950 text-xs text-white border border-slate-850 focus:border-amber-500 outline-none rounded-xl px-3 py-2 w-full h-32 resize-none font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase block">Código Pseudocódigo por Defecto / Plantilla para el Alumno (Opcional)</label>
                        <textarea
                          value={lessonFormSnippet}
                          onChange={(e) => setLessonFormSnippet(e.target.value)}
                          placeholder="temperatura = 22&#10;mostrar temperatura"
                          className="bg-slate-950 text-xs text-white border border-slate-700/80 focus:border-amber-500 outline-none rounded-xl px-3 py-2 w-full h-20 resize-none font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase block">Salida Esperada (Expected output a validar)</label>
                          <input
                            type="text"
                            value={lessonFormExpectedOutput}
                            onChange={(e) => setLessonFormExpectedOutput(e.target.value)}
                            placeholder="p.ej., El clima está perfecto"
                            className="bg-slate-950 text-xs text-white border border-slate-850 focus:border-amber-500 outline-none rounded-xl px-3 py-2 w-full font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase block">Explicación del Objetivo Final</label>
                          <input
                            type="text"
                            value={lessonFormGoal}
                            onChange={(e) => setLessonFormGoal(e.target.value)}
                            placeholder="Escribe el código para mostrar el valor del clima en pantalla..."
                            className="bg-slate-950 text-xs text-white border border-slate-850 focus:border-amber-500 outline-none rounded-xl px-3 py-2 w-full"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 justify-end pt-2">
                        {selectedLessonIdForForm !== "new" && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedLessonIdForForm("new");
                              setLessonFormId("");
                              setLessonFormTitle("");
                              setLessonFormSubtitle("");
                              setLessonFormContent("");
                              setLessonFormSnippet("");
                              setLessonFormExpectedOutput("");
                              setLessonFormGoal("");
                            }}
                            className="px-3.5 py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-300 font-bold text-xs rounded-xl"
                          >
                            Cancelar Edición
                          </button>
                        )}
                        <button
                          type="submit"
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow"
                        >
                          <Check className="w-4 h-4" />
                          {selectedLessonIdForForm === "new" ? "Incorporar Nueva Lección" : "Guardar Modificaciones"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* ================================== TAB 3 GENERAL WORKSPACE OPTIONAL: FREE PLAYGROUND ================================== */}
          {activeTab === "taller" && (
            <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6 animate-slideUp" id="free-playground-panel">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
                  🤖 Taller Libre (Banco de Lógica)
                </h2>
                <p className="text-xs text-slate-400 font-light mt-1">
                  Utiliza este simulador para programar tus propios algoritmos interactivos sin límites de plantillas. Pon a prueba tus propias lógicas.
                </p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                
                {/* Templates selectors col 5 */}
                <div className="xl:col-span-4 space-y-3">
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block font-mono">Algoritmos Preconfigurados</span>
                  
                  <button
                    onClick={() => setPlaygroundCode(`// Control de Riego para el Patio
temperatura = 28
humedad = 15
riego_activo = falso

SI temperatura > 25 Y humedad < 20 ENTONCES
  riego_activo = verdadero
  Log "Activando surtidores: temperatura abrasadora detectada"
SINO
  riego_activo = falso
  Log "Surtidores apagados"
FIN_SI`)}
                    className="w-full text-left p-3.5 bg-slate-900/40 hover:bg-slate-900 rounded-xl border border-slate-800 flex flex-col transition"
                  >
                    <span className="text-xs font-bold text-amber-500 font-display">1. Patio Inteligente (Condicionales)</span>
                    <span className="text-[10px] text-slate-450 mt-1 font-light">Evaluar sensores de humedad y riego.</span>
                  </button>

                  <button
                    onClick={() => setPlaygroundCode(`// Contador de Pasos Diarios para Adultos
pasos = 0
meta = 1000

Log "Iniciando conteo diario..."
MIENTRAS pasos < meta REPETIR
  pasos = pasos + 250
  Log "Caminata activa: sumamos 250 pasos"
FIN_MIENTRAS

Log "¡Felicidades, meta superada!"`)}
                    className="w-full text-left p-3.5 bg-slate-900/40 hover:bg-slate-900 rounded-xl border border-slate-800 flex flex-col transition"
                  >
                    <span className="text-xs font-bold text-amber-500 font-display">2. Podómetro Diario (Bucles)</span>
                    <span className="text-[10px] text-slate-450 mt-1 font-light">Repetir conteo de salud secuencialmente.</span>
                  </button>

                  <button
                    onClick={() => setPlaygroundCode(`// Control de Alarma Presupuestaria de Hogar
ingreso = 2400
gastos = 1800
balance = ingreso - gastos

Log "Su balance actual es:"
Log balance

SI balance < 500 ENTONCES
  Log "Alerta: Capacidad de ahorro crítica"
SINO
  Log "Finanzas domésticas saludables"
FIN_SI`)}
                    className="w-full text-left p-3.5 bg-slate-900/40 hover:bg-slate-900 rounded-xl border border-slate-800 flex flex-col transition"
                  >
                    <span className="text-xs font-bold text-amber-500 font-display">3. Alarma Financiera (Operaciones)</span>
                    <span className="text-[10px] text-slate-450 mt-1 font-light">Cálculo presupuestario de gastos mensuales.</span>
                  </button>

                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-900 space-y-1 text-slate-400">
                    <span className="text-[10px] text-amber-500 font-bold block uppercase tracking-wider flex items-center gap-1">
                      💡 Consejo de Sintaxis:
                    </span>
                    <ul className="text-[10px] leading-relaxed space-y-1 list-disc list-inside font-light">
                      <li>Usa verbos limpios en español independientes.</li>
                      <li>Las asignaciones son con signo `=`.</li>
                      <li>Imprime con `Log "mensaje"` o `Log variable`.</li>
                    </ul>
                  </div>
                </div>

                {/* Editor code core col 8 */}
                <div className="xl:col-span-8 flex flex-col gap-4">
                  
                  <div className="bg-slate-950 rounded-2xl border border-slate-900 p-4 flex flex-col gap-4">
                    <div className="flex justify-between items-center text-xs font-mono text-slate-450">
                      <span>ESPACIO_LIBRE_CODIFICACION.LOG</span>
                      
                      <button
                        id="run-free-playground-code-btn"
                        onClick={handleRunPlayground}
                        className="bg-amber-550 hover:bg-amber-550/90 hover:scale-102 hover:text-white transition bg-amber-500 text-slate-950 px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow font-display"
                      >
                        <Play className="w-3.5 h-3.5 fill-slate-950" />
                        Ejecutar Algoritmo
                      </button>
                    </div>

                    <textarea
                      id="free-playground-textarea"
                      value={playgroundCode}
                      onChange={(e) => setPlaygroundCode(e.target.value)}
                      className={`w-full h-64 p-4 bg-slate-905 border border-slate-900 bg-slate-900 rounded-xl font-mono text-amber-100 outline-none resize-none ${getFontSizeClass("code")}`}
                      placeholder="// Escribe libremente aquí tu programa o lógica..."
                    />

                    {/* Console logger display */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-500 font-bold font-mono uppercase tracking-wider block">Monitor de Consola Libre:</span>
                      <div className="bg-slate-950 border border-slate-900 rounded-xl p-3.5 font-mono text-xs h-36 overflow-y-auto space-y-1">
                        {terminalOutput.map((log, index) => (
                          <div key={index} className="text-emerald-450 py-0.5 border-b border-slate-900/40">
                            » {log}
                          </div>
                        ))}
                        {runningError && (
                          <span className="text-rose-400 font-black block mt-2 bg-rose-950/20 px-2.5 py-1 rounded border border-rose-900/30">
                            ⚠️ Error en ejecución: {runningError}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Simulation variables tracking */}
                    <div className="pt-2 border-t border-slate-900 space-y-2">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold font-mono block">Variables fijas instanciadas:</span>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(simulationVariables).map(([key, val]) => (
                          <span key={key} className="px-2.5 py-1 bg-slate-950 border border-slate-900 text-[11px] font-mono rounded-lg flex items-center gap-1 text-slate-300">
                            <strong>{key}</strong>: <span className="text-emerald-400 font-bold">{String(val)}</span>
                          </span>
                        ))}
                        {Object.keys(simulationVariables).length === 0 && (
                          <span className="text-xs text-slate-600 italic">No se han registrado variables en la memoria temporal libre. Elige y ejecuta una plantilla para observar los casilleros.</span>
                        )}
                      </div>
                    </div>

                  </div>

                </div>

              </div>

            </div>
          )}

        </main>

      </div>

      {/* FOOTER GENERAL */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 px-4 text-center mt-12 bg-slate-900/20" id="app-general-footer">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex gap-4 justify-center">
            <span className="uppercase font-bold tracking-widest text-[9px]">Módulos lúdicos activos</span>
            <span className="uppercase font-bold tracking-widest text-[9px]">Consola sandboxed</span>
            <span className="uppercase font-bold tracking-widest text-[9px]">Insignias certificadas</span>
          </div>
          <p className="italic font-light">
            &ldquo;El verdadero aprendizaje consiste en moldear ideas para solucionar problemas con sencillez.&rdquo; • Camino de Programación 2026.
          </p>
        </div>
      </footer>

      {/* Custom Confirmation Dialog Modal */}
      {customConfirm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" id="custom-confirm-modal">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${customConfirm.isDanger ? 'bg-rose-500/10 text-rose-450 border border-rose-550/25' : 'bg-amber-500/10 text-amber-400 border border-amber-500/25'}`}>
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white leading-tight">{customConfirm.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{customConfirm.message}</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-950/50 px-6 py-4 border-t border-slate-850 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setCustomConfirm(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-850 hover:text-white text-slate-300 text-xs font-bold rounded-xl border border-slate-800 transition"
                id="confirm-modal-cancel"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  customConfirm.onConfirm();
                  setCustomConfirm(null);
                }}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition ${customConfirm.isDanger ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-amber-500 hover:bg-amber-400 text-slate-950'}`}
                id="confirm-modal-accept"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alert Dialog Modal */}
      {customAlert && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" id="custom-alert-modal">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl">
            <div className="p-6 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-500/10 text-amber-400 border border-amber-500/25 rounded-xl shrink-0 flex items-center justify-center animate-pulse">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white leading-tight">{customAlert.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{customAlert.message}</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-950/50 px-6 py-4 border-t border-slate-850 flex justify-end">
              <button
                type="button"
                onClick={() => setCustomAlert(null)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-xl transition"
                id="alert-modal-close"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para solicitar PIN del perfil rápido */}
      {profileForPinPrompt && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn" id="prompt-pin-modal">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl relative">
            <form onSubmit={handleVerifyProfilePin} className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white leading-tight">PIN de Seguridad</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-light">
                    Ingresa el PIN de acceso para <strong>{profileForPinPrompt.name}</strong>
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="Introduce el PIN de 4 dígitos"
                  value={promptPinInput}
                  onChange={(e) => {
                    setPromptPinInput(e.target.value);
                    if (promptPinError) setPromptPinError(null);
                  }}
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl px-4 py-3 text-white text-center text-lg tracking-widest font-black placeholder-slate-700 placeholder-tracking-normal focus:outline-none focus:border-amber-500/50 transition-colors"
                />
                
                {promptPinError ? (
                  <p className="text-[11px] text-rose-450 font-medium text-center leading-normal">
                    ⚠️ {promptPinError}
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-500 text-center font-mono">
                    El PIN estándar es <span className="text-slate-400 font-semibold">1234</span> (o administrador <span className="text-slate-400 font-semibold">1104</span>).
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => {
                    setProfileForPinPrompt(null);
                    setPromptPinInput("");
                    setPromptPinError(null);
                  }}
                  className="px-4 py-2.5 bg-slate-950/40 hover:bg-slate-950 text-slate-300 text-xs font-bold rounded-xl transition border border-slate-850"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition"
                >
                  Ingresar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
