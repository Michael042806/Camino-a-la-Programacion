/**
 * A safe, sandboxed client-side interpreter for the adult-pedagogical logic pseudocode.
 * It simulates basic assignments, evaluations, variable increments, conditionals,
 * loops (while), and logging commands. It includes protection against infinite loops.
 */

export interface InterpreterResult {
  logs: string[];
  variables: { [key: string]: string | number | boolean };
  success: boolean;
  error?: string;
}

export function runPseudocode(code: string): InterpreterResult {
  const logs: string[] = [];
  const variables: { [key: string]: string | number | boolean } = {};
  
  // Clean instructions
  const rawLines = code.split("\n");
  const lines = rawLines.map(line => line.trim()).filter(line => line.length > 0);
  
  let i = 0;
  let loopSafeguard = 0;
  const MAX_GLOBAL_OPERATIONS = 1000;
  let operationsCount = 0;

  try {
    while (i < lines.length) {
      operationsCount++;
      if (operationsCount > MAX_GLOBAL_OPERATIONS) {
        throw new Error("Límite de ejecución sobrepasado. Protégete de bucles infinitos.");
      }

      const line = lines[i];

      // Comment handler
      if (line.startsWith("//") || line.startsWith("#")) {
        i++;
        continue;
      }

      // Handle LOG / PRINT statements
      if (line.toLowerCase().startsWith("log ") || line.toLowerCase().startsWith("print")) {
        let contentToPrint = "";
        
        if (line.toLowerCase().startsWith("log ")) {
          contentToPrint = line.substring(4).trim();
        } else {
          // handles format print("message") or print(variable)
          const match = line.match(/print\s*\(([^)]+)\)/i);
          if (match) {
            contentToPrint = match[1].trim();
          } else {
            contentToPrint = line.substring(5).trim();
          }
        }

        // Check if literal string with double quotes
        if (contentToPrint.startsWith('"') && contentToPrint.endsWith('"')) {
          logs.push(contentToPrint.slice(1, -1));
        } else if (contentToPrint.startsWith("'") && contentToPrint.endsWith("'")) {
          logs.push(contentToPrint.slice(1, -1));
        } else {
          // It's a variable status or combination
          if (Object.prototype.hasOwnProperty.call(variables, contentToPrint)) {
            const val = variables[contentToPrint];
            logs.push(String(val));
          } else {
            // Check if arithmetic or evaluation expression
            try {
              const evaluatedVal = evaluateExpression(contentToPrint, variables);
              logs.push(String(evaluatedVal));
            } catch {
              logs.push(`[Variable indefinida: ${contentToPrint}]`);
            }
          }
        }
        i++;
        continue;
      }

      // Handle WHILE Loops (MIENTRAS condition REPETIR)
      if (line.toUpperCase().startsWith("MIENTRAS ")) {
        const loopStartIdx = i;
        const header = line;
        const conditionStr = header.substring(9, header.toUpperCase().indexOf("REPETIR")).trim();

        // Let's locate matching FIN_MIENTRAS
        let depth = 1;
        let scanIdx = i + 1;
        let loopEndIdx = -1;

        while (scanIdx < lines.length) {
          if (lines[scanIdx].toUpperCase().startsWith("MIENTRAS ")) depth++;
          if (lines[scanIdx].toUpperCase() === "FIN_MIENTRAS") {
            depth--;
            if (depth === 0) {
              loopEndIdx = scanIdx;
              break;
            }
          }
          scanIdx++;
        }

        if (loopEndIdx === -1) {
          throw new Error("Sintaxis incompleta: Falta el término 'FIN_MIENTRAS' para concluir el bucle.");
        }

        // Loop contents lines
        const loopBody = lines.slice(loopStartIdx + 1, loopEndIdx);

        // Run loop iteratively
        loopSafeguard = 0;
        const MAX_LOOP_ITERATIONS = 100;

        while (evaluateCondition(conditionStr, variables)) {
          loopSafeguard++;
          if (loopSafeguard > MAX_LOOP_ITERATIONS) {
            throw new Error("Bucle Infinito Detectado: La condición de tu bucle MIENTRAS nunca se convirtió en falsa. Por seguridad tu ordenador interrumpió la simulación.");
          }

          // Run inner body lines
          const bodyResult = runSubsetOfLines(loopBody, variables, logs);
          // Sync variables back
          Object.assign(variables, bodyResult.variables);
        }

        // Advance index past FIN_MIENTRAS
        i = loopEndIdx + 1;
        continue;
      }

      // Handle IF Decisions (SI condition ENTONCES)
      if (line.toUpperCase().startsWith("SI ")) {
        const ifStartIdx = i;
        const header = line;
        const conditionStr = header.substring(3, header.toUpperCase().indexOf("ENTONCES")).trim();

        // Locate SINO and FIN_SI
        let depth = 1;
        let scanIdx = i + 1;
        let elseIdx = -1;
        let endIfIdx = -1;

        while (scanIdx < lines.length) {
          if (lines[scanIdx].toUpperCase().startsWith("SI ")) depth++;
          
          if (lines[scanIdx].toUpperCase() === "SINO" && depth === 1) {
            elseIdx = scanIdx;
          }
          if (lines[scanIdx].toUpperCase() === "FIN_SI") {
            depth--;
            if (depth === 0) {
              endIfIdx = scanIdx;
              break;
            }
          }
          scanIdx++;
        }

        if (endIfIdx === -1) {
          throw new Error("Sintaxis incompleta: Falta la palabra clave 'FIN_SI' para concluir el condicional.");
        }

        const conditionMet = evaluateCondition(conditionStr, variables);
        let branchLines: string[] = [];

        if (conditionMet) {
          // From SI + 1 to SINO (if exists) or FIN_SI
          const endOfBranchIdx = elseIdx !== -1 ? elseIdx : endIfIdx;
          branchLines = lines.slice(ifStartIdx + 1, endOfBranchIdx);
        } else if (elseIdx !== -1) {
          // From SINO + 1 to FIN_SI
          branchLines = lines.slice(elseIdx + 1, endIfIdx);
        }

        if (branchLines.length > 0) {
          const branchResult = runSubsetOfLines(branchLines, variables, logs);
          Object.assign(variables, branchResult.variables);
        }

        i = endIfIdx + 1;
        continue;
      }

      // Handle variable assignment general: expr = value
      if (line.includes("=")) {
        const parts = line.split("=");
        const varName = parts[0].trim();
        const expression = parts.slice(1).join("=").trim();

        // Validate varName
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(varName)) {
          throw new Error(`Nombre de variable inválido: ${varName}`);
        }

        const resolvedVal = evaluateExpression(expression, variables);
        variables[varName] = resolvedVal;
        
        i++;
        continue;
      }

      // Unknown instructions
      if (line !== "SINO" && line !== "FIN_SI" && line !== "FIN_MIENTRAS") {
        logs.push(`[Sintaxis omitida]: "${line}"`);
      }
      i++;
    }

    // Round Float types to clean up JS inaccuracies easily for older student display
    for (const key of Object.keys(variables)) {
      if (typeof variables[key] === "number") {
        const val = variables[key] as number;
        if (!Number.isInteger(val)) {
          variables[key] = Math.round(val * 100) / 100;
        }
      }
    }

    return {
      logs,
      variables,
      success: true
    };

  } catch (err: any) {
    return {
      logs,
      variables,
      success: false,
      error: err.message || "Error al ejecutar la simulación de lógica."
    };
  }
}

function runSubsetOfLines(
  lines: string[], 
  currentVars: { [key: string]: string | number | boolean },
  currentLogs: string[]
): { variables: { [key: string]: string | number | boolean } } {
  // Simple internal interpreter context, runs linearly inside conditionals & loops
  const variables = { ...currentVars };
  const logsSubset = [...currentLogs];
  
  const reconstructedCode = lines.join("\n");
  const result = runPseudocodeWithInitialState(reconstructedCode, variables, logsSubset);
  
  // Sync the master log lines
  currentLogs.length = 0;
  currentLogs.push(...result.logs);

  return {
    variables: result.variables
  };
}

function runPseudocodeWithInitialState(
  code: string, 
  initialVars: { [key: string]: string | number | boolean },
  initialLogs: string[]
): InterpreterResult {
  const logs = [...initialLogs];
  const variables = { ...initialVars };
  
  const rawLines = code.split("\n");
  const lines = rawLines.map(line => line.trim()).filter(line => line.length > 0);
  
  let i = 0;
  let operations = 0;

  while (i < lines.length) {
    operations++;
    if (operations > 500) {
      throw new Error("Límite seguro de operaciones en subproceso excedido.");
    }

    const line = lines[i];

    if (line.startsWith("//") || line.startsWith("#")) {
      i++;
      continue;
    }

    if (line.toLowerCase().startsWith("log ") || line.toLowerCase().startsWith("print")) {
      let contentToPrint = "";
      if (line.toLowerCase().startsWith("log ")) {
        contentToPrint = line.substring(4).trim();
      } else {
        const match = line.match(/print\s*\(([^)]+)\)/i);
        if (match) {
          contentToPrint = match[1].trim();
        } else {
          contentToPrint = line.substring(5).trim();
        }
      }

      if (contentToPrint.startsWith('"') && contentToPrint.endsWith('"')) {
        logs.push(contentToPrint.slice(1, -1));
      } else if (contentToPrint.startsWith("'") && contentToPrint.endsWith("'")) {
        logs.push(contentToPrint.slice(1, -1));
      } else {
        if (Object.prototype.hasOwnProperty.call(variables, contentToPrint)) {
          logs.push(String(variables[contentToPrint]));
        } else {
          try {
            const evaluated = evaluateExpression(contentToPrint, variables);
            logs.push(String(evaluated));
          } catch {
            logs.push(`[Variable indefinida: ${contentToPrint}]`);
          }
        }
      }
      i++;
      continue;
    }

    if (line.includes("=")) {
      const parts = line.split("=");
      const varName = parts[0].trim();
      const expression = parts.slice(1).join("=").trim();

      if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(varName)) {
        variables[varName] = evaluateExpression(expression, variables);
      }
      i++;
      continue;
    }

    i++;
  }

  return { logs, variables, success: true };
}

function evaluateExpression(
  expr: string, 
  vars: { [key: string]: string | number | boolean }
): string | number | boolean {
  const content = expr.trim();

  // Boolean Literals
  if (content === "verdadero" || content === "True" || content === "true") return true;
  if (content === "falso" || content === "False" || content === "false") return false;

  // String Literals
  if (content.startsWith('"') && content.endsWith('"')) return content.slice(1, -1);
  if (content.startsWith("'") && content.endsWith("'")) return content.slice(1, -1);

  // Pure Number
  if (!isNaN(Number(content))) return Number(content);

  // Variable arithmetic evaluations (e.g. pasos + 1 or steps * 1.5)
  // Let's identify operators
  const operators = ["+", "-", "*", "/"];
  for (const op of operators) {
    if (content.includes(op)) {
      const parts = content.split(op);
      if (parts.length === 2) {
        const leftVal = evaluateExpression(parts[0], vars);
        const rightVal = evaluateExpression(parts[1], vars);
        
        if (typeof leftVal === "number" && typeof rightVal === "number") {
          switch (op) {
            case "+": return leftVal + rightVal;
            case "-": return leftVal - rightVal;
            case "*": return leftVal * rightVal;
            case "/": return rightVal !== 0 ? leftVal / rightVal : 0;
          }
        }
      }
    }
  }

  // Pure variable lookup
  if (Object.prototype.hasOwnProperty.call(vars, content)) {
    return vars[content];
  }

  throw new Error(`Expresión inadmisible o variable indefinida: "${content}"`);
}

function evaluateCondition(
  conditionStr: string, 
  vars: { [key: string]: string | number | boolean }
): boolean {
  const cond = conditionStr.trim();

  // Handle boolean operators "Y" / "and" / "O" / "or"
  if (cond.toUpperCase().includes(" Y ")) {
    const parts = cond.split(/ Y /i);
    return evaluateCondition(parts[0], vars) && evaluateCondition(parts[1], vars);
  }
  if (cond.toUpperCase().includes(" O ")) {
    const parts = cond.split(/ O /i);
    return evaluateCondition(parts[0], vars) || evaluateCondition(parts[1], vars);
  }

  const operators = [">=", "<=", "==", "!=", ">", "<"];
  for (const op of operators) {
    if (cond.includes(op)) {
      const parts = cond.split(op);
      const leftVal = evaluateExpression(parts[0], vars);
      const rightVal = evaluateExpression(parts[1], vars);

      switch (op) {
        case ">=": return Number(leftVal) >= Number(rightVal);
        case "<=": return Number(leftVal) <= Number(rightVal);
        case "==": return leftVal === rightVal;
        case "!=": return leftVal !== rightVal;
        case ">": return Number(leftVal) > Number(rightVal);
        case "<": return Number(leftVal) < Number(rightVal);
      }
    }
  }

  // Single variable evaluation (like SI alerta ENTONCES)
  if (Object.prototype.hasOwnProperty.call(vars, cond)) {
    return !!vars[cond];
  }

  return false;
}
