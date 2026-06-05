"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Calculator,
  CheckCircle2,
  LockKeyhole,
  RotateCcw,
  UnlockKeyhole,
} from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";

const primeOptions = [3, 5, 7, 11, 13, 17, 19, 23];

type Complex = {
  im: number;
  re: number;
};

type GateName = "X" | "H" | "Z" | "R_theta";
type CoefficientPart = "real" | "imaginary";
type BellInput = "00" | "01" | "10" | "11";

const zero = { re: 0, im: 0 };
const one = { re: 1, im: 0 };
const minusOne = { re: -1, im: 0 };
const invSqrtTwo = 1 / Math.sqrt(2);

const gateDescriptions: Record<
  GateName,
  {
    description: string;
    label: string;
  }
> = {
  X: {
    label: "X - bit flip",
    description: "Flips |0> to |1> and |1> to |0>.",
  },
  H: {
    label: "H - superposition",
    description: "Mixes |0> and |1>; it turns basis states into equal superpositions.",
  },
  Z: {
    label: "Z - phase flip",
    description: "Leaves |0> alone and adds a minus sign to |1>.",
  },
  R_theta: {
    label: "R_theta - phase rotation",
    description: "Leaves |0> alone and rotates the phase of |1> by theta.",
  },
};

const sectionFrameClasses = {
  conceptGreen:
    "mt-8 rounded-xl border border-emerald-400/20 bg-emerald-500/10 overflow-hidden",
  conceptPurple:
    "mt-8 rounded-xl border border-violet-400/20 bg-violet-500/10 overflow-hidden",
  exercise:
    "mt-8 rounded-xl border border-amber-400/25 bg-amber-500/10 overflow-hidden",
  tryIt:
    "mt-8 rounded-xl border border-cyan-400/25 bg-cyan-500/10 overflow-hidden",
};

const badgeClasses = {
  conceptGreen:
    "rounded-md bg-emerald-500/15 px-2 py-0.5 font-orbitron text-[10px] font-semibold uppercase tracking-wide text-emerald-300 ring-1 ring-emerald-500/35",
  conceptPurple:
    "rounded-md bg-violet-500/15 px-2 py-0.5 font-orbitron text-[10px] font-semibold uppercase tracking-wide text-violet-300 ring-1 ring-violet-500/35",
  exercise:
    "rounded-md bg-amber-500/15 px-2 py-0.5 font-orbitron text-[10px] font-semibold uppercase tracking-wide text-amber-300 ring-1 ring-amber-500/35",
  tryIt:
    "rounded-md bg-cyan-500/15 px-2 py-0.5 font-orbitron text-[10px] font-semibold uppercase tracking-wide text-cyan-300 ring-1 ring-cyan-500/35",
};

const decimalRegisterStates = Array.from({ length: 16 }, (_, value) => `|${value}>`);
const binaryRegisterStates = Array.from(
  { length: 16 },
  (_, value) => `|${value.toString(2).padStart(4, "0")}>`
);
const modExpValues = Array.from({ length: 16 }, (_, x) => modPow(2, x, 15));
const modExpTableLines = Array.from(
  { length: 16 },
  (_, x) =>
    `x = ${x.toString().padStart(2, " ")} (${x
      .toString(2)
      .padStart(4, "0")}): 2^${x} mod 15 = ${modExpValues[x]} (${modExpValues[x]
      .toString(2)
      .padStart(4, "0")})`
);
const totalPowerStateLines = Array.from(
  { length: 16 },
  (_, x) => `|${x}> |2^${x} mod 15>`
);
const totalValueStateLines = Array.from(
  { length: 16 },
  (_, x) => `|${x}> |${modExpValues[x]}>`
);

function gcd(first: number, second: number) {
  let a = Math.abs(first);
  let b = Math.abs(second);

  while (b !== 0) {
    const next = a % b;
    a = b;
    b = next;
  }

  return a;
}

function normalizeModulo(value: number, modulus: number) {
  return ((value % modulus) + modulus) % modulus;
}

function modPow(base: number, exponent: number, modulus: number) {
  let result = 1;
  let currentBase = normalizeModulo(base, modulus);
  let currentExponent = Math.max(0, Math.floor(exponent));

  while (currentExponent > 0) {
    if (currentExponent % 2 === 1) {
      result = (result * currentBase) % modulus;
    }

    currentBase = (currentBase * currentBase) % modulus;
    currentExponent = Math.floor(currentExponent / 2);
  }

  return result;
}

function modInverse(value: number, modulus: number) {
  let oldR = value;
  let r = modulus;
  let oldS = 1;
  let s = 0;

  while (r !== 0) {
    const quotient = Math.floor(oldR / r);
    [oldR, r] = [r, oldR - quotient * r];
    [oldS, s] = [s, oldS - quotient * s];
  }

  if (oldR !== 1) {
    return null;
  }

  return normalizeModulo(oldS, modulus);
}

function addComplex(first: Complex, second: Complex): Complex {
  return {
    re: first.re + second.re,
    im: first.im + second.im,
  };
}

function multiplyComplex(first: Complex, second: Complex): Complex {
  return {
    re: first.re * second.re - first.im * second.im,
    im: first.re * second.im + first.im * second.re,
  };
}

function conjugateComplex(value: Complex): Complex {
  return {
    re: value.re,
    im: -value.im,
  };
}

function scaleComplex(value: Complex, scale: number): Complex {
  return {
    re: value.re * scale,
    im: value.im * scale,
  };
}

function coefficientFromPart(value: number, part: CoefficientPart): Complex {
  return part === "real" ? { re: value, im: 0 } : { re: 0, im: value };
}

function formatNumber(value: number) {
  if (Math.abs(value) < 0.000001) {
    return "0";
  }

  const rounded = Math.round(value * 1000) / 1000;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(3);
}

function formatComplex(value: Complex) {
  const re = Math.abs(value.re) < 0.000001 ? 0 : value.re;
  const im = Math.abs(value.im) < 0.000001 ? 0 : value.im;

  if (re === 0 && im === 0) {
    return "0";
  }

  if (im === 0) {
    return formatNumber(re);
  }

  if (re === 0) {
    if (im === 1) return "i";
    if (im === -1) return "-i";
    return `${formatNumber(im)}i`;
  }

  const sign = im > 0 ? "+" : "-";
  const imMagnitude = Math.abs(im);
  const imText = imMagnitude === 1 ? "i" : `${formatNumber(imMagnitude)}i`;
  return `${formatNumber(re)} ${sign} ${imText}`;
}

function formatState(alpha: Complex, beta: Complex) {
  return `${formatComplex(alpha)}|0> + ${formatComplex(beta)}|1>`;
}

function getGateMatrix(gate: GateName, thetaDegrees: number): Complex[][] {
  if (gate === "X") {
    return [
      [zero, one],
      [one, zero],
    ];
  }

  if (gate === "H") {
    return [
      [scaleComplex(one, invSqrtTwo), scaleComplex(one, invSqrtTwo)],
      [scaleComplex(one, invSqrtTwo), scaleComplex(minusOne, invSqrtTwo)],
    ];
  }

  if (gate === "Z") {
    return [
      [one, zero],
      [zero, minusOne],
    ];
  }

  const theta = (thetaDegrees * Math.PI) / 180;
  const phase = { re: Math.cos(theta), im: Math.sin(theta) };

  return [
    [one, zero],
    [zero, phase],
  ];
}

function applyGate(matrix: Complex[][], alpha: Complex, beta: Complex) {
  return [
    addComplex(multiplyComplex(matrix[0][0], alpha), multiplyComplex(matrix[0][1], beta)),
    addComplex(multiplyComplex(matrix[1][0], alpha), multiplyComplex(matrix[1][1], beta)),
  ];
}

function blochCoordinates(alpha: Complex, beta: Complex) {
  const alphaConjugateBeta = multiplyComplex(conjugateComplex(alpha), beta);

  return {
    x: 2 * alphaConjugateBeta.re,
    y: 2 * alphaConjugateBeta.im,
    z: alpha.re ** 2 + alpha.im ** 2 - beta.re ** 2 - beta.im ** 2,
  };
}

function getBellDemo(input: BellInput) {
  const demos: Record<
    BellInput,
    {
      afterCnot: string;
      afterH: string;
      name: string;
    }
  > = {
    "00": {
      afterH: "(|00> + |10>) / sqrt(2)",
      afterCnot: "(|00> + |11>) / sqrt(2)",
      name: "Bell state Phi+",
    },
    "01": {
      afterH: "(|01> + |11>) / sqrt(2)",
      afterCnot: "(|01> + |10>) / sqrt(2)",
      name: "Bell state Psi+",
    },
    "10": {
      afterH: "(|00> - |10>) / sqrt(2)",
      afterCnot: "(|00> - |11>) / sqrt(2)",
      name: "Bell state Phi-",
    },
    "11": {
      afterH: "(|01> - |11>) / sqrt(2)",
      afterCnot: "(|01> - |10>) / sqrt(2)",
      name: "Bell state Psi-",
    },
  };

  return demos[input];
}

function normalizeFormulaAnswer(answer: string) {
  return answer
    .toLowerCase()
    .replace(/−/g, "-")
    .replace(/\s+/g, "")
    .replace(/\*/g, "");
}

function normalizeNumberGroup(answer: string) {
  return answer
    .match(/\d+/g)
    ?.map(Number)
    .sort((a, b) => a - b)
    .join(",") ?? "";
}

function normalizePhaseAnswer(answer: string) {
  return answer
    .toLowerCase()
    .replace(/π/g, "pi")
    .replace(/[{}\s*]/g, "")
    .replace(/−/g, "-");
}

function clampUnit(value: number) {
  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}

function pairedUnitValue(value: number) {
  return Math.sqrt(Math.max(0, 1 - value ** 2));
}

function EquationBlock({
  lines,
  tone = "cyan",
}: {
  lines: string[];
  tone?: "cyan" | "amber";
}) {
  const textColor = tone === "cyan" ? "text-cyan-100" : "text-amber-100";

  return (
    <pre
      className={`mt-4 overflow-x-auto rounded-lg border border-white/10 bg-[#080a13] p-4 text-sm leading-relaxed ${textColor}`}
    >
      <code>{lines.join("\n")}</code>
    </pre>
  );
}

function ColumnVector({
  entries,
  label,
}: {
  entries: string[];
  label?: string;
}) {
  return (
    <div className="inline-flex items-center gap-2">
      {label && (
        <span className="font-orbitron text-[11px] uppercase tracking-wide text-gray-400">
          {label}
        </span>
      )}
      <div className="relative inline-grid gap-2 px-4 py-2 text-center font-mono text-sm text-cyan-100">
        <span className="absolute inset-y-0 left-0 w-2 rounded-l border-y border-l border-cyan-400/40" />
        <span className="absolute inset-y-0 right-0 w-2 rounded-r border-y border-r border-cyan-400/40" />
        {entries.map((entry, index) => (
          <span key={`${entry}-${index}`}>{entry}</span>
        ))}
      </div>
    </div>
  );
}

function MatrixVectorView({
  input,
  matrix,
  output,
}: {
  input: string[];
  matrix: string[][];
  output: string[];
}) {
  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-white/10 bg-[#080a13] p-4">
      <div className="inline-flex min-w-max items-center gap-3">
        <div className="relative grid grid-cols-2 gap-x-4 gap-y-2 px-4 py-2 text-center font-mono text-sm text-cyan-100">
          <span className="absolute inset-y-0 left-0 w-2 rounded-l border-y border-l border-cyan-400/40" />
          <span className="absolute inset-y-0 right-0 w-2 rounded-r border-y border-r border-cyan-400/40" />
          {matrix.flatMap((row, rowIndex) =>
            row.map((entry, columnIndex) => (
              <span key={`${rowIndex}-${columnIndex}`}>{entry}</span>
            ))
          )}
        </div>
        <span className="text-gray-500">x</span>
        <ColumnVector entries={input} />
        <span className="text-gray-500">=</span>
        <ColumnVector entries={output} />
      </div>
      <div className="mt-3 text-xs text-gray-500">
        The column vector is the transposed state vector: top is |0&gt;, bottom
        is |1&gt;.
      </div>
    </div>
  );
}

function BlochSphere({
  after,
  before,
}: {
  after: ReturnType<typeof blochCoordinates>;
  before: ReturnType<typeof blochCoordinates>;
}) {
  const project = (point: ReturnType<typeof blochCoordinates>) => ({
    cx: 100 + 68 * point.x + 12 * point.y,
    cy: 100 - 68 * point.z - 8 * point.y,
  });
  const beforePoint = project(before);
  const afterPoint = project(after);

  return (
    <div className="rounded-lg border border-white/10 bg-[#080a13] p-4">
      <div className="font-orbitron text-[11px] font-semibold uppercase tracking-wide text-gray-300">
        State before and after
      </div>
      <svg
        aria-label="Bloch sphere state sketch"
        className="mt-3 h-auto w-full max-w-xs"
        viewBox="0 0 200 200"
        role="img"
      >
        <circle cx="100" cy="100" r="72" fill="#0f172a" stroke="#38bdf8" strokeOpacity="0.35" />
        <ellipse
          cx="100"
          cy="100"
          fill="none"
          rx="72"
          ry="22"
          stroke="#38bdf8"
          strokeDasharray="4 5"
          strokeOpacity="0.45"
        />
        <line x1="100" x2="100" y1="24" y2="176" stroke="#94a3b8" strokeOpacity="0.45" />
        <line x1="28" x2="172" y1="100" y2="100" stroke="#94a3b8" strokeOpacity="0.25" />
        <text fill="#94a3b8" fontSize="11" x="108" y="35">
          |0&gt;
        </text>
        <text fill="#94a3b8" fontSize="11" x="108" y="174">
          |1&gt;
        </text>
        <circle cx={beforePoint.cx} cy={beforePoint.cy} fill="#22d3ee" r="5" />
        <circle cx={afterPoint.cx} cy={afterPoint.cy} fill="#fbbf24" r="5" />
        <line
          stroke="#22d3ee"
          strokeOpacity="0.55"
          x1="100"
          x2={beforePoint.cx}
          y1="100"
          y2={beforePoint.cy}
        />
        <line
          stroke="#fbbf24"
          strokeOpacity="0.55"
          x1="100"
          x2={afterPoint.cx}
          y1="100"
          y2={afterPoint.cy}
        />
      </svg>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-400">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
          before
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          after
        </span>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min = 0,
  max,
}: {
  label: string;
  value: number | string;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm text-gray-400">
      <span className="font-orbitron text-[11px] font-semibold uppercase tracking-wide text-gray-300">
        {label}
      </span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full rounded-md border border-white/10 bg-[#080a13] px-3 py-2 text-gray-100 outline-none transition-colors focus:border-cyan-400/70"
      />
    </label>
  );
}

function TextAnswerField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm text-gray-400">
      <span className="font-orbitron text-[11px] font-semibold uppercase tracking-wide text-gray-300">
        {label}
      </span>
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-white/10 bg-[#080a13] px-3 py-2 text-gray-100 outline-none transition-colors focus:border-cyan-400/70"
      />
    </label>
  );
}

function FormulaAnswerField({
  label,
  value,
  onChange,
  placeholder = "enter coefficient",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm text-gray-400">
      <span className="font-orbitron text-[11px] font-semibold uppercase tracking-wide text-gray-300">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-white/10 bg-[#080a13] px-3 py-2 text-gray-100 outline-none transition-colors placeholder:text-gray-600 focus:border-cyan-400/70"
      />
    </label>
  );
}

function CoefficientMagnitudeControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm text-gray-400">
      <span className="flex items-center justify-between gap-3">
        <span className="font-orbitron text-[11px] font-semibold uppercase tracking-wide text-gray-300">
          {label}
        </span>
        <span className="rounded-md border border-white/10 bg-[#080a13] px-2 py-0.5 text-xs text-cyan-100">
          {formatNumber(value)}
        </span>
      </span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full accent-cyan-400"
      />
    </label>
  );
}

function CoefficientMagnitudeDisplay({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex flex-col gap-2 text-sm text-gray-400">
      <span className="font-orbitron text-[11px] font-semibold uppercase tracking-wide text-gray-300">
        {label}
      </span>
      <div className="rounded-md border border-white/10 bg-[#080a13] px-3 py-2 text-cyan-100">
        {formatNumber(value)}
      </div>
    </div>
  );
}

export default function ShorsAlgorithmClient() {
  const [p, setP] = useState(5);
  const [q, setQ] = useState(11);
  const [e, setE] = useState(3);
  const [message, setMessage] = useState(7);
  const [ciphertext, setCiphertext] = useState(13);
  const [sandboxResult, setSandboxResult] = useState(
    "Encrypt m or decrypt c to see toy RSA move."
  );
  const [attackerBaseAnswer, setAttackerBaseAnswer] = useState("");
  const [attackerExponentAnswer, setAttackerExponentAnswer] = useState("");
  const [attackerModulusAnswer, setAttackerModulusAnswer] = useState("");
  const [attackerMessageAnswer, setAttackerMessageAnswer] = useState("");
  const [attackerStatus, setAttackerStatus] = useState("");
  const [attackerPoint, setAttackerPoint] = useState(false);
  const [periodAnswer, setPeriodAnswer] = useState("");
  const [powerAnswer, setPowerAnswer] = useState("");
  const [factorOneAnswer, setFactorOneAnswer] = useState("");
  const [factorTwoAnswer, setFactorTwoAnswer] = useState("");
  const [periodStatus, setPeriodStatus] = useState("");
  const [periodPoint, setPeriodPoint] = useState(false);
  const [alphaValue, setAlphaValue] = useState(invSqrtTwo);
  const [alphaPart, setAlphaPart] = useState<CoefficientPart>("real");
  const [betaValue, setBetaValue] = useState(invSqrtTwo);
  const [betaPart, setBetaPart] = useState<CoefficientPart>("real");
  const [selectedGate, setSelectedGate] = useState<GateName>("H");
  const [thetaDegrees, setThetaDegrees] = useState(90);
  const [gateZeroAnswer, setGateZeroAnswer] = useState("");
  const [gateOneAnswer, setGateOneAnswer] = useState("");
  const [gateStatus, setGateStatus] = useState("");
  const [gatePoint, setGatePoint] = useState(false);
  const [selectedBellInput, setSelectedBellInput] = useState<BellInput>("00");
  const [groupOneAnswer, setGroupOneAnswer] = useState("");
  const [groupTwoAnswer, setGroupTwoAnswer] = useState("");
  const [groupFourAnswer, setGroupFourAnswer] = useState("");
  const [groupEightAnswer, setGroupEightAnswer] = useState("");
  const [groupStatus, setGroupStatus] = useState("");
  const [groupPoint, setGroupPoint] = useState(false);
  const [goodPhaseAnswer, setGoodPhaseAnswer] = useState("");
  const [badPhaseAnswer, setBadPhaseAnswer] = useState("");
  const [phaseStatus, setPhaseStatus] = useState("");
  const [phasePoint, setPhasePoint] = useState(false);

  const n = p * q;
  const phi = (p - 1) * (q - 1);
  const eGcd = gcd(e, phi);
  const rsaInputsValid = p !== q && e > 1 && e < phi && eGcd === 1;
  const d = rsaInputsValid ? modInverse(e, phi) : null;
  const score =
    Number(attackerPoint) +
    Number(periodPoint) +
    Number(gatePoint) +
    Number(groupPoint) +
    Number(phasePoint);
  const gateAlpha = coefficientFromPart(alphaValue, alphaPart);
  const gateBeta = coefficientFromPart(betaValue, betaPart);
  const gateMatrix = getGateMatrix(selectedGate, thetaDegrees);
  const [nextAlpha, nextBeta] = applyGate(gateMatrix, gateAlpha, gateBeta);
  const gateMatrixLines =
    selectedGate === "H"
      ? [
          "H = (1 / sqrt(2)) [[1,  1],",
          "                    [1, -1]]",
          "",
          `H ~= [[${formatComplex(gateMatrix[0][0])},  ${formatComplex(gateMatrix[0][1])}],`,
          `      [${formatComplex(gateMatrix[1][0])}, ${formatComplex(gateMatrix[1][1])}]]`,
        ]
      : [
          `${selectedGate} = [[${formatComplex(gateMatrix[0][0])}, ${formatComplex(gateMatrix[0][1])}],`,
          `     [${formatComplex(gateMatrix[1][0])}, ${formatComplex(gateMatrix[1][1])}]]`,
        ];
  const gateComputeLines = [
    `input  = [${formatComplex(gateAlpha)}, ${formatComplex(gateBeta)}]^T`,
    `output = [(${formatComplex(gateMatrix[0][0])})(${formatComplex(gateAlpha)}) + (${formatComplex(gateMatrix[0][1])})(${formatComplex(gateBeta)}),`,
    `          (${formatComplex(gateMatrix[1][0])})(${formatComplex(gateAlpha)}) + (${formatComplex(gateMatrix[1][1])})(${formatComplex(gateBeta)})]^T`,
    `       = [${formatComplex(nextAlpha)}, ${formatComplex(nextBeta)}]^T`,
    `state  = ${formatState(nextAlpha, nextBeta)}`,
  ];
  const visualGateMatrix =
    selectedGate === "H"
      ? [
          ["1/sqrt(2)", "1/sqrt(2)"],
          ["1/sqrt(2)", "-1/sqrt(2)"],
        ]
      : gateMatrix.map((row) => row.map(formatComplex));
  const beforeBloch = blochCoordinates(gateAlpha, gateBeta);
  const afterBloch = blochCoordinates(nextAlpha, nextBeta);
  const bellDemo = getBellDemo(selectedBellInput);

  const validEValues = useMemo(() => {
    const values = [];

    for (let candidate = 2; candidate < phi; candidate += 1) {
      if (gcd(candidate, phi) === 1) {
        values.push(candidate);
      }

      if (values.length === 10) {
        break;
      }
    }

    return values;
  }, [phi]);

  const encryptMessage = () => {
    if (!d) {
      setSandboxResult("Pick distinct primes and an e with gcd(e, phi(N)) = 1.");
      return;
    }

    const cleanMessage = normalizeModulo(message, n);
    const nextCiphertext = modPow(cleanMessage, e, n);
    setMessage(cleanMessage);
    setCiphertext(nextCiphertext);
    setSandboxResult(`Encrypted m = ${cleanMessage} into c = ${nextCiphertext}.`);
  };

  const decryptCiphertext = () => {
    if (!d) {
      setSandboxResult("Pick distinct primes and an e with gcd(e, phi(N)) = 1.");
      return;
    }

    const cleanCiphertext = normalizeModulo(ciphertext, n);
    const decryptedMessage = modPow(cleanCiphertext, d, n);
    setCiphertext(cleanCiphertext);
    setMessage(decryptedMessage);
    setSandboxResult(`Decrypted c = ${cleanCiphertext} back into m = ${decryptedMessage}.`);
  };

  const resetSandbox = () => {
    setP(5);
    setQ(11);
    setE(3);
    setMessage(7);
    setCiphertext(13);
    setSandboxResult("Encrypt m or decrypt c to see toy RSA move.");
  };

  const checkAttackerAnswer = () => {
    if (
      Number(attackerBaseAnswer) === 15 &&
      Number(attackerExponentAnswer) === 23 &&
      Number(attackerModulusAnswer) === 187 &&
      Number(attackerMessageAnswer) === 42
    ) {
      setAttackerPoint(true);
      setAttackerStatus("Correct. 15^23 mod 187 decrypts to 42.");
      return;
    }

    setAttackerStatus(
      "Not yet. The point remains stolen from the try it box above for now."
    );
  };

  const checkPeriodExercise = () => {
    const factorOne = Number(factorOneAnswer);
    const factorTwo = Number(factorTwoAnswer);
    const factorsCorrect =
      (factorOne === 5 && factorTwo === 11) || (factorOne === 11 && factorTwo === 5);

    if (
      Number(periodAnswer) === 20 &&
      Number(powerAnswer) === 1024 &&
      factorsCorrect
    ) {
      setPeriodPoint(true);
      setPeriodStatus("Correct. r = 20, 2^10 = 1024, and the factors are 5 and 11.");
      return;
    }

    setPeriodStatus("Not yet. Check the period first, then use gcd(2^(r/2) +/- 1, 55).");
  };

  const checkGateExercise = () => {
    const zeroCoefficient = normalizeFormulaAnswer(gateZeroAnswer);
    const oneCoefficient = normalizeFormulaAnswer(gateOneAnswer);
    const zeroAccepted = new Set([
      "(1+i)/2",
      "1/2+i/2",
      "0.5+0.5i",
      "1/2+1/2i",
    ]);
    const oneAccepted = new Set([
      "(1-i)/2",
      "1/2-i/2",
      "0.5-0.5i",
      "1/2-1/2i",
    ]);

    if (zeroAccepted.has(zeroCoefficient) && oneAccepted.has(oneCoefficient)) {
      setGatePoint(true);
      setGateStatus("Correct. H|+i> = ((1+i)/2)|0> + ((1-i)/2)|1>.");
      return;
    }

    setGateStatus("Not yet. Multiply each H row by the |+i> column vector.");
  };

  const checkGroupingExercise = () => {
    const answers = [
      normalizeNumberGroup(groupOneAnswer),
      normalizeNumberGroup(groupTwoAnswer),
      normalizeNumberGroup(groupFourAnswer),
      normalizeNumberGroup(groupEightAnswer),
    ];
    const expected = ["0,4,8,12", "1,5,9,13", "2,6,10,14", "3,7,11,15"];

    if (answers.every((answer, index) => answer === expected[index])) {
      setGroupPoint(true);
      setGroupStatus("Correct. Each second-register value leaves a comb spaced by 4.");
      return;
    }

    setGroupStatus("Not yet. Group the x values that share the same second-register output.");
  };

  const checkPhaseExercise = () => {
    const good = normalizePhaseAnswer(goodPhaseAnswer);
    const bad = normalizePhaseAnswer(badPhaseAnswer);
    const goodAccepted = [
      "1,e^(2ipi),e^(4ipi),e^(6ipi)",
      "1,e^2ipi,e^4ipi,e^6ipi",
      "1,1,1,1",
    ];
    const badAccepted = [
      "1,e^(5ipi/2),e^(5ipi),e^(15ipi/2)",
      "1,e^5ipi/2,e^5ipi,e^15ipi/2",
      "1,i,-1,-i",
    ];

    if (goodAccepted.includes(good) && badAccepted.includes(bad)) {
      setPhasePoint(true);
      setPhaseStatus("Correct. y = 4 compounds in phase; y = 5 cancels out.");
      return;
    }

    setPhaseStatus(
      "Not yet. For y = 4 the four phases should all point together; for y = 5 they should rotate around the circle."
    );
  };

  const updateAlphaValue = (value: number) => {
    const nextAlphaValue = clampUnit(value);
    setAlphaValue(nextAlphaValue);
    setBetaValue(pairedUnitValue(nextAlphaValue));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0c16] text-gray-300">
      <Header />
      <main className="flex-1 w-full pt-20 md:pt-24 pb-16 px-6 md:px-12">
        <article className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-orbitron text-xs font-semibold uppercase tracking-wide text-cyan-300/80">
                Quantum Computing Workshop
              </p>
              <h1 className="font-orbitron text-4xl sm:text-5xl mt-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Shor&apos;s Algorithm
              </h1>
            </div>
            <div className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">
              <span className="font-orbitron text-[11px] uppercase tracking-wide text-cyan-300">
                Points
              </span>
              <div className="mt-1 text-2xl font-semibold">{score} / 5</div>
            </div>
          </div>

          <section className="mt-8 rounded-xl border border-cyan-400/25 bg-cyan-500/10 px-4 py-4 text-gray-200">
            <p className="text-sm sm:text-base leading-relaxed text-gray-300">
              While Shor&apos;s algorithm can break discrete log and RSA, as an
              example we will focus on RSA, even though in the long run it will
              require more quantum resources. But a quantum computer does not
              directly break RSA. So what does it break? Let&apos;s find out!
            </p>
          </section>

          <section className={sectionFrameClasses.conceptGreen}>
            <div className="border-b border-white/5 px-4 py-3.5">
              <span className={badgeClasses.conceptGreen}>
                concept
              </span>
              <h2 className="mt-3 font-orbitron text-xl sm:text-2xl text-gray-100">
                Toy RSA with N = 55
              </h2>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm sm:text-[15px] leading-relaxed text-gray-400">
                RSA starts by multiplying two primes. For a toy example, choose
                p = 5 and q = 11, so N = p * q = 55. The totient function counts
                the numbers below N that are coprime to N. For two primes,
                phi(N) = (p - 1)(q - 1), so phi(55) = 40.
              </p>
              <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-gray-400">
                GCD means greatest common divisor: the biggest whole number that
                divides two numbers. If gcd(e, phi(N)) = 1, then e works as the
                public exponent. Then d is the inverse of e modulo phi(N), which
                means e * d leaves remainder 1 when divided by phi(N).
              </p>
              <EquationBlock
                lines={[
                  "p = 5, q = 11",
                  "N = p * q = 55",
                  "phi(N) = (p - 1)(q - 1) = 4 * 10 = 40",
                  "choose e = 3 because gcd(3, 40) = 1",
                  "find d so e * d = 1 mod 40",
                  "d = 27 because 3 * 27 = 81 = 1 mod 40",
                  "public key:  (N, e) = (55, 3)",
                  "private key: (N, d) = (55, 27)",
                ]}
              />
            </div>
          </section>

          <section className={sectionFrameClasses.tryIt}>
            <div className="border-b border-white/5 px-4 py-3.5">
              <span className={badgeClasses.tryIt}>
                try it
              </span>
              <h2 className="mt-3 font-orbitron text-xl sm:text-2xl text-gray-100">
                Build and Play with Toy RSA
              </h2>
            </div>
            <div className="px-4 py-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <label className="flex flex-col gap-2 text-sm text-gray-400">
                  <span className="font-orbitron text-[11px] font-semibold uppercase tracking-wide text-gray-300">
                    Prime p
                  </span>
                  <select
                    value={p}
                    onChange={(event) => setP(Number(event.target.value))}
                    className="w-full rounded-md border border-white/10 bg-[#080a13] px-3 py-2 text-gray-100 outline-none transition-colors focus:border-cyan-400/70"
                  >
                    {primeOptions.map((prime) => (
                      <option key={prime} value={prime}>
                        {prime}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm text-gray-400">
                  <span className="font-orbitron text-[11px] font-semibold uppercase tracking-wide text-gray-300">
                    Prime q
                  </span>
                  <select
                    value={q}
                    onChange={(event) => setQ(Number(event.target.value))}
                    className="w-full rounded-md border border-white/10 bg-[#080a13] px-3 py-2 text-gray-100 outline-none transition-colors focus:border-cyan-400/70"
                  >
                    {primeOptions.map((prime) => (
                      <option key={prime} value={prime}>
                        {prime}
                      </option>
                    ))}
                  </select>
                </label>
                <NumberField label="Public e" value={e} onChange={setE} min={2} />
                <div className="rounded-lg border border-white/10 bg-[#080a13] px-3 py-2">
                  <div className="font-orbitron text-[11px] font-semibold uppercase tracking-wide text-gray-300">
                    Private d
                  </div>
                  <div className="mt-2 text-lg font-semibold text-cyan-100">
                    {d ?? "invalid"}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 text-sm text-gray-400 sm:grid-cols-2 lg:grid-cols-4">
                <div>N = {n}</div>
                <div>phi(N) = {phi}</div>
                <div>gcd(e, phi) = {eGcd}</div>
                <div>
                  valid e samples: {validEValues.length ? validEValues.join(", ") : "none"}
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <NumberField label="Message m" value={message} onChange={setMessage} />
                <NumberField
                  label="Ciphertext c"
                  value={ciphertext}
                  onChange={setCiphertext}
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={encryptMessage}
                  className="inline-flex items-center gap-2 rounded-md border border-cyan-400/40 bg-cyan-500/10 px-3 py-2 font-orbitron text-xs font-semibold uppercase tracking-wide text-cyan-300 transition-colors hover:border-cyan-300/70 hover:bg-cyan-400/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/70"
                >
                  <LockKeyhole className="h-4 w-4" aria-hidden />
                  encrypt m
                </button>
                <button
                  type="button"
                  onClick={decryptCiphertext}
                  className="inline-flex items-center gap-2 rounded-md border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 font-orbitron text-xs font-semibold uppercase tracking-wide text-emerald-300 transition-colors hover:border-emerald-300/70 hover:bg-emerald-400/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70"
                >
                  <UnlockKeyhole className="h-4 w-4" aria-hidden />
                  decrypt c
                </button>
                <button
                  type="button"
                  onClick={resetSandbox}
                  className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 font-orbitron text-xs font-semibold uppercase tracking-wide text-gray-300 transition-colors hover:border-white/30 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/70"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden />
                  reset
                </button>
              </div>

              <p className="mt-4 rounded-lg border border-white/10 bg-[#080a13] px-3 py-3 text-sm text-gray-300">
                {sandboxResult}
              </p>
            </div>
          </section>

          <section className={sectionFrameClasses.exercise}>
            <div className="border-b border-white/5 px-4 py-3.5">
              <span className={badgeClasses.exercise}>
                exercise
              </span>
              <h2 className="mt-3 font-orbitron text-xl sm:text-2xl text-gray-100">
                Quantum Attacker Box
              </h2>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm sm:text-[15px] leading-relaxed text-gray-400">
                You are a quantum attacker, and you managed to find the primes
                for N. The public key is (N, e) = (187, 7), the ciphertext is c
                = 15, and your quantum routine found p = 11 and q = 17. Decrypt
                c by filling in the modular exponentiation.
              </p>
              <div className="mt-5 grid gap-3 rounded-lg border border-white/10 bg-[#080a13] p-4 text-sm text-gray-300 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] sm:items-center">
                <TextAnswerField
                  label="base"
                  value={attackerBaseAnswer}
                  onChange={setAttackerBaseAnswer}
                />
                <span className="hidden text-center text-gray-500 sm:block">to the power of</span>
                <TextAnswerField
                  label="exponent"
                  value={attackerExponentAnswer}
                  onChange={setAttackerExponentAnswer}
                />
                <span className="hidden text-center text-gray-500 sm:block">mod</span>
                <TextAnswerField
                  label="modulus"
                  value={attackerModulusAnswer}
                  onChange={setAttackerModulusAnswer}
                />
                <span className="hidden text-center text-gray-500 sm:block">decrypts to</span>
                <TextAnswerField
                  label="message"
                  value={attackerMessageAnswer}
                  onChange={setAttackerMessageAnswer}
                />
              </div>
              <p className="mt-3 text-sm text-gray-400">
                Fill it as: c to the power of d mod N decrypts to m.
              </p>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={checkAttackerAnswer}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-amber-400/40 bg-amber-500/10 px-3 py-2 font-orbitron text-xs font-semibold uppercase tracking-wide text-amber-300 transition-colors hover:border-amber-300/70 hover:bg-amber-400/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70"
                >
                  <CheckCircle2 className="h-4 w-4" aria-hidden />
                  check answer
                </button>
              </div>
              {attackerStatus && (
                <p className="mt-4 rounded-lg border border-white/10 bg-[#080a13] px-3 py-3 text-sm text-gray-300">
                  {attackerStatus}
                </p>
              )}
            </div>
          </section>

          <section className={sectionFrameClasses.conceptPurple}>
            <div className="border-b border-white/5 px-4 py-3.5">
              <span className={badgeClasses.conceptPurple}>
                concept
              </span>
              <h2 className="mt-3 font-orbitron text-xl sm:text-2xl text-gray-100">
                Modular Exponentiation and Period
              </h2>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm sm:text-[15px] leading-relaxed text-gray-400">
                Modular exponentiation means raising a base to powers, then
                keeping only the remainder after division by N. For N = 15 and
                base a = 2, the values repeat.
              </p>
              <EquationBlock
                lines={[
                  "f(x) = 2^x mod 15",
                  "x:    0, 1, 2, 3, 4, 5, 6, 7, ...",
                  "f(x): 1, 2, 4, 8, 1, 2, 4, 8, ...",
                  "period r = 4",
                ]}
              />
            </div>
          </section>

          <section className={sectionFrameClasses.conceptGreen}>
            <div className="border-b border-white/5 px-4 py-3.5">
              <span className={badgeClasses.conceptGreen}>
                concept
              </span>
              <h2 className="mt-3 font-orbitron text-xl sm:text-2xl text-gray-100">
                From Period to Factors
              </h2>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm sm:text-[15px] leading-relaxed text-gray-400">
                Once the period r is even, compute a^(r/2). Then compare that
                number one step below and one step above against N using gcd.
                In the N = 15 example, the period is r = 4, so a^(r/2) = 2^2 =
                4. The gcd calls reveal the factors.
              </p>
              <EquationBlock
                lines={[
                  "a^(r/2) = 2^(4/2) = 2^2 = 4",
                  "gcd(4 - 1, 15) = gcd(3, 15) = 3",
                  "gcd(4 + 1, 15) = gcd(5, 15) = 5",
                  "factors found: 3 and 5",
                ]}
              />
            </div>
          </section>

          <section className={sectionFrameClasses.exercise}>
            <div className="border-b border-white/5 px-4 py-3.5">
              <span className={badgeClasses.exercise}>
                exercise
              </span>
              <h2 className="mt-3 font-orbitron text-xl sm:text-2xl text-gray-100">
                Factor 55 from a Period
              </h2>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm sm:text-[15px] leading-relaxed text-gray-400">
                Now do the same move for N = 55 and base a = 2. Fill in the
                period, the value of a^(r/2), and the two factors.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <TextAnswerField label="Period r" value={periodAnswer} onChange={setPeriodAnswer} />
                <TextAnswerField
                  label="a^(r/2)"
                  value={powerAnswer}
                  onChange={setPowerAnswer}
                />
                <TextAnswerField
                  label="Factor one"
                  value={factorOneAnswer}
                  onChange={setFactorOneAnswer}
                />
                <TextAnswerField
                  label="Factor two"
                  value={factorTwoAnswer}
                  onChange={setFactorTwoAnswer}
                />
              </div>
              <button
                type="button"
                onClick={checkPeriodExercise}
                className="mt-5 inline-flex items-center gap-2 rounded-md border border-amber-400/40 bg-amber-500/10 px-3 py-2 font-orbitron text-xs font-semibold uppercase tracking-wide text-amber-300 transition-colors hover:border-amber-300/70 hover:bg-amber-400/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70"
              >
                <Calculator className="h-4 w-4" aria-hidden />
                check factors
              </button>
              {periodStatus && (
                <p className="mt-4 rounded-lg border border-white/10 bg-[#080a13] px-3 py-3 text-sm text-gray-300">
                  {periodStatus}
                </p>
              )}
            </div>
          </section>

          <section className={sectionFrameClasses.conceptPurple}>
            <div className="border-b border-white/5 px-4 py-3.5">
              <span className={badgeClasses.conceptPurple}>
                concept
              </span>
              <h2 className="mt-3 font-orbitron text-xl sm:text-2xl text-gray-100">
                Qubit States Times Gate Matrices
              </h2>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm sm:text-[15px] leading-relaxed text-gray-400">
                A one-qubit state is a two-entry vector. The top entry is the
                coefficient of |0&gt;, and the bottom entry is the coefficient
                of |1&gt;. A gate is a 2 by 2 matrix. Applying the gate means
                multiplying the matrix by the state vector.
              </p>
              <EquationBlock
                lines={[
                  "|psi> = alpha|0> + beta|1> = [alpha, beta]^T",
                  "",
                  "[a b] [alpha] = [a alpha + b beta]",
                  "[c d] [ beta]   [c alpha + d beta]",
                  "",
                  "X|0> = |1>",
                  "Z(alpha|0> + beta|1>) = alpha|0> - beta|1>",
                  "H|0> = (|0> + |1>) / sqrt(2)",
                  "R_theta(alpha|0> + beta|1>) = alpha|0> + e^(i theta) beta|1>",
                ]}
              />
            </div>
          </section>

          <section className={sectionFrameClasses.tryIt}>
            <div className="border-b border-white/5 px-4 py-3.5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className={badgeClasses.tryIt}>
                    try it
                  </span>
                  <h2 className="mt-3 font-orbitron text-xl sm:text-2xl text-gray-100">
                    Gate Multiplication Sandbox
                  </h2>
                </div>
                <div className="rounded-lg border border-cyan-400/25 bg-cyan-500/10 px-3 py-2 text-right text-sm text-cyan-100">
                  <div className="font-orbitron text-[10px] font-semibold uppercase tracking-wide text-cyan-300">
                    Normalized state
                  </div>
                  <div className="mt-1">|alpha|^2 + |beta|^2 = 1</div>
                </div>
              </div>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm sm:text-[15px] leading-relaxed text-gray-400">
                Pick alpha and beta for alpha|0&gt; + beta|1&gt;, choose whether
                each coefficient is real or imaginary, then apply a gate. This
                lab shows the multiplication step directly.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <CoefficientMagnitudeControl
                  label="Alpha magnitude"
                  value={alphaValue}
                  onChange={updateAlphaValue}
                />
                <label className="flex flex-col gap-2 text-sm text-gray-400">
                  <span className="font-orbitron text-[11px] font-semibold uppercase tracking-wide text-gray-300">
                    Alpha type
                  </span>
                  <select
                    value={alphaPart}
                    onChange={(event) => setAlphaPart(event.target.value as CoefficientPart)}
                    className="w-full rounded-md border border-white/10 bg-[#080a13] px-3 py-2 text-gray-100 outline-none transition-colors focus:border-cyan-400/70"
                  >
                    <option value="real">real, no i</option>
                    <option value="imaginary">imaginary, with i</option>
                  </select>
                </label>
                <CoefficientMagnitudeDisplay
                  label="Beta magnitude"
                  value={betaValue}
                />
                <label className="flex flex-col gap-2 text-sm text-gray-400">
                  <span className="font-orbitron text-[11px] font-semibold uppercase tracking-wide text-gray-300">
                    Beta type
                  </span>
                  <select
                    value={betaPart}
                    onChange={(event) => setBetaPart(event.target.value as CoefficientPart)}
                    className="w-full rounded-md border border-white/10 bg-[#080a13] px-3 py-2 text-gray-100 outline-none transition-colors focus:border-cyan-400/70"
                  >
                    <option value="real">real, no i</option>
                    <option value="imaginary">imaginary, with i</option>
                  </select>
                </label>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-gray-400">
                  <span className="font-orbitron text-[11px] font-semibold uppercase tracking-wide text-gray-300">
                    Gate
                  </span>
                  <select
                    value={selectedGate}
                    onChange={(event) => setSelectedGate(event.target.value as GateName)}
                    className="w-full rounded-md border border-white/10 bg-[#080a13] px-3 py-2 text-gray-100 outline-none transition-colors focus:border-cyan-400/70"
                  >
                    <option value="X">{gateDescriptions.X.label}</option>
                    <option value="H">{gateDescriptions.H.label}</option>
                    <option value="Z">{gateDescriptions.Z.label}</option>
                    <option value="R_theta">{gateDescriptions.R_theta.label}</option>
                  </select>
                </label>
                <NumberField
                  label="Theta degrees"
                  value={thetaDegrees}
                  onChange={setThetaDegrees}
                  min={0}
                />
              </div>

              <p className="mt-4 rounded-lg border border-white/10 bg-[#080a13] px-3 py-3 text-sm text-gray-300">
                <span className="font-orbitron text-[11px] font-semibold uppercase tracking-wide text-cyan-300">
                  {selectedGate}
                </span>
                <span className="ml-2">{gateDescriptions[selectedGate].description}</span>
              </p>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-[#080a13] px-4 py-4">
                  <div className="font-orbitron text-[11px] font-semibold uppercase tracking-wide text-gray-300">
                    Matrix
                  </div>
                  <EquationBlock lines={gateMatrixLines} />
                </div>
                <BlochSphere before={beforeBloch} after={afterBloch} />
              </div>
              <div className="mt-4 rounded-lg border border-white/10 bg-[#080a13] px-4 py-4">
                <div className="font-orbitron text-[11px] font-semibold uppercase tracking-wide text-gray-300">
                  Computation
                </div>
                <MatrixVectorView
                  input={[formatComplex(gateAlpha), formatComplex(gateBeta)]}
                  matrix={visualGateMatrix}
                  output={[formatComplex(nextAlpha), formatComplex(nextBeta)]}
                />
                <EquationBlock lines={gateComputeLines} tone="amber" />
              </div>
            </div>
          </section>

          <section className={sectionFrameClasses.conceptGreen}>
            <div className="border-b border-white/5 px-4 py-3.5">
              <span className={badgeClasses.conceptGreen}>concept</span>
              <h2 className="mt-3 font-orbitron text-xl sm:text-2xl text-gray-100">
                Phase Is Where Qubits Start Feeling Like Waves
              </h2>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm sm:text-[15px] leading-relaxed text-gray-400">
                The R_theta gate changes the phase between |0&gt; and |1&gt;.
                It leaves the |0&gt; part alone, but rotates the |1&gt; part by
                an angle theta. That relative phase is one of the special things
                about qubits: amplitudes are not just amounts, they also carry
                wave-like direction.
              </p>
              <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-gray-400">
                A useful analogy is sound. When the peaks of a bass line and a
                drum hit line up, the sound can feel stronger. When waves are
                out of phase, they can partially cancel and feel weaker. Quantum
                algorithms use this same kind of constructive and destructive
                behavior, but with probability amplitudes.
              </p>
              <EquationBlock
                lines={[
                  "R_theta(alpha|0> + beta|1>)",
                  "  = alpha|0> + e^(i theta) beta|1>",
                  "",
                  "theta changes the relative phase between the two parts.",
                  "Later, good phases line up; bad phases cancel.",
                ]}
              />
            </div>
          </section>

          <section className={sectionFrameClasses.exercise}>
            <div className="border-b border-white/5 px-4 py-3.5">
              <span className={badgeClasses.exercise}>
                exercise
              </span>
              <h2 className="mt-3 font-orbitron text-xl sm:text-2xl text-gray-100">
                Apply H to |+i&gt;
              </h2>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm sm:text-[15px] leading-relaxed text-gray-400">
                Before the gate, |+i&gt; means:
              </p>
              <EquationBlock
                lines={[
                  "|+i> = (1 / sqrt(2))|0> + (i / sqrt(2))|1>",
                  "",
                  "H = (1 / sqrt(2)) [[1, 1], [1, -1]]",
                  "",
                  "Find H|+i>.",
                ]}
              />
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <FormulaAnswerField
                  label="Coefficient of |0>"
                  value={gateZeroAnswer}
                  onChange={setGateZeroAnswer}
                />
                <FormulaAnswerField
                  label="Coefficient of |1>"
                  value={gateOneAnswer}
                  onChange={setGateOneAnswer}
                />
              </div>
              <button
                type="button"
                onClick={checkGateExercise}
                className="mt-5 inline-flex items-center gap-2 rounded-md border border-amber-400/40 bg-amber-500/10 px-3 py-2 font-orbitron text-xs font-semibold uppercase tracking-wide text-amber-300 transition-colors hover:border-amber-300/70 hover:bg-amber-400/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70"
              >
                <Calculator className="h-4 w-4" aria-hidden />
                check state
              </button>
              {gateStatus && (
                <p className="mt-4 rounded-lg border border-white/10 bg-[#080a13] px-3 py-3 text-sm text-gray-300">
                  {gateStatus}
                </p>
              )}
            </div>
          </section>

          <section className={sectionFrameClasses.conceptGreen}>
            <div className="border-b border-white/5 px-4 py-3.5">
              <span className={badgeClasses.conceptGreen}>
                concept
              </span>
              <h2 className="mt-3 font-orbitron text-xl sm:text-2xl text-gray-100">
                H, CNOT, Bell States, and Entanglement
              </h2>
            </div>
            <div className="px-4 py-4">
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-lg border border-white/10 bg-[#080a13] px-4 py-4">
                  <h3 className="font-orbitron text-sm text-cyan-200">H gate</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">
                    H makes a qubit branch into an equal superposition. On the
                    first qubit, it turns |0x&gt; into a blend of |0x&gt; and
                    |1x&gt;.
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#080a13] px-4 py-4">
                  <h3 className="font-orbitron text-sm text-cyan-200">CNOT gate</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">
                    CNOT has a control qubit and a target qubit. If the control
                    is 1, it flips the target. If the control is 0, it does
                    nothing.
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#080a13] px-4 py-4">
                  <h3 className="font-orbitron text-sm text-cyan-200">
                    Entanglement
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">
                    A Bell state is entangled: the two-qubit state cannot be
                    split into one independent state for qubit A and one for
                    qubit B.
                  </p>
                </div>
              </div>
              <EquationBlock
                lines={[
                  "Start with |00>",
                  "Apply H to the first qubit:",
                  "(|00> + |10>) / sqrt(2)",
                  "Apply CNOT with first qubit as control:",
                  "(|00> + |11>) / sqrt(2)",
                  "This is a Bell state.",
                ]}
              />
            </div>
          </section>

          <section className={sectionFrameClasses.tryIt}>
            <div className="border-b border-white/5 px-4 py-3.5">
              <span className={badgeClasses.tryIt}>
                try it
              </span>
              <h2 className="mt-3 font-orbitron text-xl sm:text-2xl text-gray-100">
                Fixed Circuit: H then CNOT
              </h2>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm sm:text-[15px] leading-relaxed text-gray-400">
                Choose the starting two-qubit basis state. The circuit always
                applies H to the first qubit, then CNOT with the first qubit as
                control and the second qubit as target.
              </p>

              <div className="mt-5 grid gap-4 lg:grid-cols-[220px_1fr]">
                <label className="flex flex-col gap-2 text-sm text-gray-400">
                  <span className="font-orbitron text-[11px] font-semibold uppercase tracking-wide text-gray-300">
                    Initial state
                  </span>
                  <select
                    value={selectedBellInput}
                    onChange={(event) => setSelectedBellInput(event.target.value as BellInput)}
                    className="w-full rounded-md border border-white/10 bg-[#080a13] px-3 py-2 text-gray-100 outline-none transition-colors focus:border-cyan-400/70"
                  >
                    <option value="00">|00&gt;</option>
                    <option value="01">|01&gt;</option>
                    <option value="10">|10&gt;</option>
                    <option value="11">|11&gt;</option>
                  </select>
                </label>

                <div className="rounded-lg border border-white/10 bg-[#080a13] px-4 py-4">
                  <div className="grid gap-3 text-sm text-gray-300 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
                    <div className="rounded-md border border-white/10 px-3 py-2">
                      |{selectedBellInput}&gt;
                    </div>
                    <div className="font-orbitron text-xs text-cyan-300">H on q0</div>
                    <div className="rounded-md border border-white/10 px-3 py-2">
                      {bellDemo.afterH}
                    </div>
                    <div className="font-orbitron text-xs text-cyan-300">CNOT</div>
                    <div className="rounded-md border border-white/10 px-3 py-2 text-amber-100">
                      {bellDemo.afterCnot}
                    </div>
                  </div>
                  <div className="mt-4 rounded-md border border-cyan-400/20 bg-cyan-500/10 px-3 py-3 text-sm text-cyan-100">
                    Output: {bellDemo.name}
                  </div>
                </div>
              </div>

              <EquationBlock
                lines={[
                  "q0: -- H -- control --",
                  "              |",
                  "q1: -------- target  --",
                  "",
                  `Input |${selectedBellInput}> -> ${bellDemo.afterCnot}`,
                ]}
                tone="amber"
              />
            </div>
          </section>

          <section className={sectionFrameClasses.conceptPurple}>
            <div className="border-b border-white/5 px-4 py-3.5">
              <span className={badgeClasses.conceptPurple}>concept</span>
              <h2 className="mt-3 font-orbitron text-xl sm:text-2xl text-gray-100">
                Four Qubits Can Represent 0 Through 15
              </h2>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm sm:text-[15px] leading-relaxed text-gray-400">
                One classical bit has 2 possibilities. Four classical bits have
                2^4 = 16 possible strings, from 0000 to 1111. A four-qubit
                register uses the same labels, and applying H to each qubit
                creates an equal superposition over all 16 labels at once.
              </p>
              <EquationBlock
                lines={[
                  "H on each qubit:",
                  "|0000> -> (1/4)(|0000> + |0001> + ... + |1111>)",
                  "",
                  "Decimal labels:",
                  decimalRegisterStates.join(" + "),
                  "",
                  "Binary labels:",
                  binaryRegisterStates.join(" + "),
                ]}
              />
            </div>
          </section>

          <section className={sectionFrameClasses.conceptGreen}>
            <div className="border-b border-white/5 px-4 py-3.5">
              <span className={badgeClasses.conceptGreen}>concept</span>
              <h2 className="mt-3 font-orbitron text-xl sm:text-2xl text-gray-100">
                First Register, Second Register, and Modular Exponentiation
              </h2>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm sm:text-[15px] leading-relaxed text-gray-400">
                In the Shor toy example, the first register stores x. The second
                register stores the function value 2^x mod 15. Once the function
                is computed, the registers are entangled: knowing the second
                register narrows down which x values could be in the first
                register.
              </p>
              <EquationBlock
                lines={[
                  "first register:  x",
                  "second register: f(x) = 2^x mod 15",
                  "",
                  ...modExpTableLines,
                ]}
              />
            </div>
          </section>

          <section className={sectionFrameClasses.conceptPurple}>
            <div className="border-b border-white/5 px-4 py-3.5">
              <span className={badgeClasses.conceptPurple}>concept</span>
              <h2 className="mt-3 font-orbitron text-xl sm:text-2xl text-gray-100">
                Total State Before Measuring
              </h2>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm sm:text-[15px] leading-relaxed text-gray-400">
                The total state pairs each first-register value with the
                matching second-register function value. First write it as the
                function, then replace the function with the actual values.
              </p>
              <EquationBlock
                lines={[
                  "(1/4)(",
                  ...totalPowerStateLines.map((line) => `  ${line}`),
                  ")",
                  "",
                  "which equals",
                  "",
                  "(1/4)(",
                  ...totalValueStateLines.map((line) => `  ${line}`),
                  ")",
                ]}
              />
            </div>
          </section>

          <section className={sectionFrameClasses.exercise}>
            <div className="border-b border-white/5 px-4 py-3.5">
              <span className={badgeClasses.exercise}>exercise</span>
              <h2 className="mt-3 font-orbitron text-xl sm:text-2xl text-gray-100">
                Group by Second Register String
              </h2>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm sm:text-[15px] leading-relaxed text-gray-400">
                Group the first-register x values by the second-register output
                string. Use decimal x values, separated however you like.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <FormulaAnswerField
                  label="second |0001>"
                  value={groupOneAnswer}
                  onChange={setGroupOneAnswer}
                  placeholder="type x values"
                />
                <FormulaAnswerField
                  label="second |0010>"
                  value={groupTwoAnswer}
                  onChange={setGroupTwoAnswer}
                  placeholder="type x values"
                />
                <FormulaAnswerField
                  label="second |0100>"
                  value={groupFourAnswer}
                  onChange={setGroupFourAnswer}
                  placeholder="type x values"
                />
                <FormulaAnswerField
                  label="second |1000>"
                  value={groupEightAnswer}
                  onChange={setGroupEightAnswer}
                  placeholder="type x values"
                />
              </div>
              <button
                type="button"
                onClick={checkGroupingExercise}
                className="mt-5 inline-flex items-center gap-2 rounded-md border border-amber-400/40 bg-amber-500/10 px-3 py-2 font-orbitron text-xs font-semibold uppercase tracking-wide text-amber-300 transition-colors hover:border-amber-300/70 hover:bg-amber-400/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70"
              >
                <Calculator className="h-4 w-4" aria-hidden />
                check groups
              </button>
              {groupStatus && (
                <p className="mt-4 rounded-lg border border-white/10 bg-[#080a13] px-3 py-3 text-sm text-gray-300">
                  {groupStatus}
                </p>
              )}
            </div>
          </section>

          <section className={sectionFrameClasses.conceptGreen}>
            <div className="border-b border-white/5 px-4 py-3.5">
              <span className={badgeClasses.conceptGreen}>concept</span>
              <h2 className="mt-3 font-orbitron text-xl sm:text-2xl text-gray-100">
                Measuring the Second Register Reveals the Comb
              </h2>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm sm:text-[15px] leading-relaxed text-gray-400">
                If you measure the second register, you only see one of four
                values: 0001, 0010, 0100, or 1000. Once that happens, the first
                register collapses to the matching x values. Those surviving x
                values are spaced by 4, which is the period.
              </p>
              <EquationBlock
                lines={[
                  "measure second register = |0001>",
                  "first register left alive: |0> + |4> + |8> + |12>",
                  "",
                  "measure second register = |0010>",
                  "first register left alive: |1> + |5> + |9> + |13>",
                  "",
                  "measure second register = |0100>",
                  "first register left alive: |2> + |6> + |10> + |14>",
                  "",
                  "measure second register = |1000>",
                  "first register left alive: |3> + |7> + |11> + |15>",
                  "",
                  "Each row is a comb with spacing 4.",
                ]}
              />
            </div>
          </section>

          <section className={sectionFrameClasses.conceptPurple}>
            <div className="border-b border-white/5 px-4 py-3.5">
              <span className={badgeClasses.conceptPurple}>concept</span>
              <h2 className="mt-3 font-orbitron text-xl sm:text-2xl text-gray-100">
                Four Numbers Times the DFT Matrix
              </h2>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm sm:text-[15px] leading-relaxed text-gray-400">
                The discrete Fourier transform takes a signal and rewrites it in
                terms of frequencies. For four numbers, it is just a matrix
                multiplication. Repeated patterns become visible as strong
                frequency outputs.
              </p>
              <EquationBlock
                lines={[
                  "signal = [s0, s1, s2, s3]^T",
                  "",
                  "DFT_4(signal) = (1/2) *",
                  "[[1,  1,  1,  1],",
                  " [1,  i, -1, -i],",
                  " [1, -1,  1, -1],",
                  " [1, -i, -1,  i]]",
                  "* [s0, s1, s2, s3]^T",
                ]}
              />
            </div>
          </section>

          <section className={sectionFrameClasses.conceptGreen}>
            <div className="border-b border-white/5 px-4 py-3.5">
              <span className={badgeClasses.conceptGreen}>concept</span>
              <h2 className="mt-3 font-orbitron text-xl sm:text-2xl text-gray-100">
                QFT Is the Same Fourier Matrix as a Quantum Operator
              </h2>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm sm:text-[15px] leading-relaxed text-gray-400">
                The quantum Fourier transform is a quantum operator: a unitary
                matrix, just like the gates above. It is the DFT matrix acting on
                amplitudes. The QFT changes a state from a signal-like view into
                a frequency-like view, so periodic structure shows up as peaks.
              </p>
              <EquationBlock
                lines={[
                  "Generic QFT formula:",
                  "QFT_N |x> = (1 / sqrt(N)) sum_{y=0}^{N-1} e^(2 pi i x y / N) |y>",
                  "",
                  "For the 4 x 4 case:",
                  "QFT_4 |x> = (1 / 2) sum_{y=0}^{3} e^((i pi / 2) x y) |y>",
                  "",
                  "Same idea: signal pattern in, frequency peaks out.",
                ]}
              />
            </div>
          </section>

          <section className={sectionFrameClasses.exercise}>
            <div className="border-b border-white/5 px-4 py-3.5">
              <span className={badgeClasses.exercise}>exercise</span>
              <h2 className="mt-3 font-orbitron text-xl sm:text-2xl text-gray-100">
                Ultimate Phase Check
              </h2>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm sm:text-[15px] leading-relaxed text-gray-400">
                Use the comb |0&gt; + |4&gt; + |8&gt; + |12&gt; inside a
                16-point Fourier transform. The phase for each x is
                e^(2 pi i x y / 16). For a good y, the phases compound. For a
                bad y, they cancel.
              </p>
              <EquationBlock
                lines={[
                  "phase rule: e^(2 pi i x y / 16)",
                  "comb x values: 0, 4, 8, 12",
                  "",
                  "Write the four phases for y = 4.",
                  "Then write the four phases for y = 5.",
                ]}
              />
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <FormulaAnswerField
                  label="good phases for y = 4"
                  value={goodPhaseAnswer}
                  onChange={setGoodPhaseAnswer}
                  placeholder="write four phases"
                />
                <FormulaAnswerField
                  label="bad phases for y = 5"
                  value={badPhaseAnswer}
                  onChange={setBadPhaseAnswer}
                  placeholder="write four phases"
                />
              </div>
              <button
                type="button"
                onClick={checkPhaseExercise}
                className="mt-5 inline-flex items-center gap-2 rounded-md border border-amber-400/40 bg-amber-500/10 px-3 py-2 font-orbitron text-xs font-semibold uppercase tracking-wide text-amber-300 transition-colors hover:border-amber-300/70 hover:bg-amber-400/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70"
              >
                <Calculator className="h-4 w-4" aria-hidden />
                check phases
              </button>
              {phaseStatus && (
                <p className="mt-4 rounded-lg border border-white/10 bg-[#080a13] px-3 py-3 text-sm text-gray-300">
                  {phaseStatus}
                </p>
              )}
            </div>
          </section>

          <p className="mt-14 text-center text-gray-500 text-sm">
            <Link
              href="/workshops"
              className="text-cyan-400/90 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-500/40"
            >
              Back to workshops
            </Link>
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
