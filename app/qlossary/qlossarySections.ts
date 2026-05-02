export type GlossaryCategoryId =
  | "core"
  | "math"
  | "circuits"
  | "physics"
  | "algorithms"
  | "errors"
  | "hardware";

export interface GlossaryEntry {
  term: string;
  definition: string;
}

export interface GlossarySection {
  id: GlossaryCategoryId;
  heading: string;
  terms: GlossaryEntry[];
}

export const glossarySections: GlossarySection[] = [
  {
    id: "core",
    heading: "Core concepts",
    terms: [
      {
        term: "Qubit",
        definition:
          "The basic unit of quantum information: a two-level quantum system whose state is a complex linear combination of |0⟩ and |1⟩, not just a probabilistic choice between them.",
      },
      {
        term: "Quantum state",
        definition:
          "The full mathematical description of a system, containing everything needed to predict measurement statistics.",
      },
      {
        term: "State vector",
        definition:
          "A column vector of complex amplitudes representing a pure quantum state in some basis.",
      },
      {
        term: "Amplitude",
        definition:
          "A complex coefficient in a quantum state; probabilities come from the squared magnitudes of amplitudes, while phases affect interference.",
      },
      {
        term: "Phase",
        definition:
          "The angle of a complex amplitude; invisible in a single isolated basis probability, but crucial for interference and algorithms.",
      },
      {
        term: "Global phase",
        definition:
          "A phase factor multiplying the entire state equally; it has no observable physical effect.",
      },
      {
        term: "Relative phase",
        definition:
          "The phase difference between components of a superposition; this is physically meaningful and drives interference.",
      },
      {
        term: "Superposition",
        definition:
          "A state that is a linear combination of basis states, allowing the system to evolve in ways that classical bits cannot.",
      },
      {
        term: "Basis",
        definition:
          "A coordinate system for describing states, such as the computational basis or X-basis.",
      },
      {
        term: "Computational basis",
        definition:
          "The standard basis |0⟩ and |1⟩ for qubits, usually the basis in which measurements are reported.",
      },
      {
        term: "Hilbert space",
        definition:
          "The complex vector space in which quantum states live, equipped with an inner product.",
      },
      {
        term: "Observable",
        definition:
          "A measurable physical quantity, represented mathematically by a Hermitian operator.",
      },
      {
        term: "Expectation value",
        definition:
          "The average outcome you would get by repeatedly measuring an observable on identically prepared states.",
      },
      {
        term: "Born rule",
        definition:
          "The rule that converts amplitudes into measurement probabilities by taking squared magnitudes.",
      },
      {
        term: "Measurement",
        definition:
          "The process that extracts classical information from a quantum system, typically disturbing the state.",
      },
      {
        term: "Projective measurement",
        definition:
          "The standard idealized measurement model, where the state is projected onto an eigenspace of the measured observable.",
      },
      {
        term: "POVM",
        definition:
          "A more general measurement framework than projective measurement, useful for noisy, partial, or optimized measurement schemes.",
      },
      {
        term: "Collapse",
        definition:
          "Informal shorthand for state update after measurement; useful operationally, though not always the cleanest foundational language.",
      },
      {
        term: "Pure state",
        definition:
          "A state with maximal quantum coherence, representable by a single state vector.",
      },
      {
        term: "Mixed state",
        definition:
          "A statistical ensemble of possible pure states, represented by a density matrix rather than a single vector.",
      },
    ],
  },
  {
    id: "math",
    heading: "Math that keeps appearing in papers",
    terms: [
      {
        term: "Density matrix",
        definition:
          "A matrix representation of a quantum state that can describe both pure states and mixtures.",
      },
      {
        term: "Inner product",
        definition:
          "The complex generalization of the dot product; it defines angles, norms, probabilities, and orthogonality in quantum theory.",
      },
      {
        term: "Norm",
        definition: "The length of a vector; normalized quantum states have norm 1.",
      },
      {
        term: "Orthogonal",
        definition:
          "Two states are orthogonal when their inner product is zero, meaning they are perfectly distinguishable in principle.",
      },
      {
        term: "Orthonormal basis",
        definition:
          "A basis whose vectors are mutually orthogonal and each have unit norm.",
      },
      {
        term: "Operator",
        definition:
          "A linear map acting on states; gates, observables, and noise processes are all described using operators.",
      },
      {
        term: "Hermitian operator",
        definition:
          "An operator equal to its own conjugate transpose; these represent observables and have real eigenvalues.",
      },
      {
        term: "Unitary operator",
        definition:
          "A norm-preserving reversible operator; ideal closed-system quantum evolution is unitary.",
      },
      {
        term: "Eigenvalue",
        definition:
          "A scalar associated with an operator acting on one of its eigenvectors without changing its direction.",
      },
      {
        term: "Eigenvector",
        definition:
          "A nonzero vector that an operator scales rather than rotates into a different direction.",
      },
      {
        term: "Spectral decomposition",
        definition:
          "Writing an operator in terms of its eigenvalues and projectors; central for understanding measurement and evolution.",
      },
      {
        term: "Tensor product",
        definition:
          "The operation used to combine multiple quantum systems into one larger state space.",
      },
      {
        term: "Partial trace",
        definition:
          "The operation used to discard or ignore part of a composite system, producing a reduced state.",
      },
      {
        term: "Commutator",
        definition:
          "For operators A and B, the quantity AB − BA; nonzero commutators signal incompatible operations or observables.",
      },
      {
        term: "Fourier transform",
        definition:
          "A basis change that rewrites information in frequency-like coordinates; the quantum version is central to several major algorithms.",
      },
      {
        term: "Linear combination",
        definition:
          "A weighted sum of vectors; superposition is a physical realization of this mathematical idea.",
      },
      {
        term: "Span",
        definition: "The set of all linear combinations of a collection of vectors.",
      },
      {
        term: "Subspace",
        definition:
          "A smaller vector space sitting inside a larger one; code spaces in error correction are subspaces.",
      },
      {
        term: "Projection",
        definition:
          "An operator that maps a state onto a subspace, often associated with measurement outcomes.",
      },
      {
        term: "Matrix exponential",
        definition:
          "The way continuous-time evolution is built from a Hamiltonian.",
      },
    ],
  },
  {
    id: "circuits",
    heading: "Gates and circuits",
    terms: [
      {
        term: "Quantum gate",
        definition:
          "A basic operation on one or more qubits, typically represented by a unitary matrix.",
      },
      {
        term: "Quantum circuit",
        definition:
          "A sequence of gates, measurements, and resets arranged to implement a computation.",
      },
      {
        term: "Circuit depth",
        definition:
          "The number of time steps or gate layers in a circuit, relevant because deeper circuits accumulate more error.",
      },
      {
        term: "Circuit width",
        definition: "Roughly the number of qubits used by a circuit.",
      },
      {
        term: "Ancilla qubit",
        definition:
          "An auxiliary qubit used for workspace, syndrome extraction, control logic, or intermediate computation.",
      },
      {
        term: "Single-qubit gate",
        definition:
          "A gate acting on one qubit only, such as X, H, or Rz.",
      },
      {
        term: "Two-qubit gate",
        definition:
          "A gate coupling two qubits; these are usually harder to implement and often dominate hardware difficulty.",
      },
      {
        term: "Entangling gate",
        definition:
          "A multi-qubit gate capable of creating entanglement from product states.",
      },
      {
        term: "Pauli-X gate",
        definition: "The quantum analogue of a bit flip; it swaps |0⟩ and |1⟩.",
      },
      {
        term: "Pauli-Y gate",
        definition: "A combined bit-and-phase flip with an imaginary phase factor.",
      },
      {
        term: "Pauli-Z gate",
        definition:
          "A phase flip; it leaves |0⟩ unchanged and flips the sign of |1⟩.",
      },
      {
        term: "Hadamard gate",
        definition:
          "A gate that maps basis states into equal superpositions and interchanges X- and Z-type viewpoints.",
      },
      {
        term: "Phase gate",
        definition:
          "A gate that changes relative phase without changing computational-basis populations.",
      },
      {
        term: "S gate",
        definition:
          "A quarter-turn phase gate, often viewed as the square root of Z.",
      },
      {
        term: "T gate",
        definition:
          "An eighth-turn phase gate; cheap mathematically, but expensive in many fault-tolerant architectures.",
      },
      {
        term: "Rotation gate",
        definition:
          "A gate parameterized by an angle, such as Rx, Ry, or Rz, representing continuous families of operations.",
      },
      {
        term: "CNOT gate",
        definition:
          "A controlled bit flip: it flips the target qubit only when the control qubit is |1⟩.",
      },
      {
        term: "CZ gate",
        definition:
          "A controlled phase flip; common in superconducting and neutral-atom hardware descriptions.",
      },
      {
        term: "SWAP gate",
        definition: "A gate that exchanges the states of two qubits.",
      },
      {
        term: "Toffoli gate",
        definition:
          "A controlled-controlled-NOT gate; classically universal and a standard cost unit in fault-tolerant resource estimates.",
      },
    ],
  },
  {
    id: "physics",
    heading: "Entanglement, dynamics, and physical intuition",
    terms: [
      {
        term: "Entanglement",
        definition:
          "Correlation structure that cannot be explained by assigning independent local states to subsystems.",
      },
      {
        term: "Bell state",
        definition: "One of the standard maximally entangled two-qubit states.",
      },
      {
        term: "Product state",
        definition:
          "A composite state that factors into separate subsystem states; not entangled.",
      },
      {
        term: "Hamiltonian",
        definition:
          "The operator governing continuous-time evolution and energy structure.",
      },
      {
        term: "Schrödinger equation",
        definition:
          "The differential equation describing how a closed quantum state evolves in time.",
      },
      {
        term: "Time evolution",
        definition:
          "The change of a quantum state over time, ideally generated by a Hamiltonian.",
      },
      {
        term: "Interference",
        definition:
          "The reinforcement or cancellation of amplitudes due to phase relationships; the engine behind many quantum algorithms.",
      },
      {
        term: "Coherence",
        definition:
          "The persistence of well-defined phase relationships in a quantum state.",
      },
      {
        term: "Decoherence",
        definition:
          "Loss of coherence due to unwanted interaction with the environment, turning quantum behavior into effectively classical behavior.",
      },
      {
        term: "Dephasing",
        definition:
          "Noise that randomizes phase information more than population information.",
      },
      {
        term: "Relaxation",
        definition:
          "Energy loss from an excited state toward a lower-energy state, often associated with T1 processes.",
      },
      {
        term: "T1 time",
        definition: "The characteristic timescale for energy relaxation.",
      },
      {
        term: "T2 time",
        definition: "The characteristic timescale for phase coherence decay.",
      },
      {
        term: "Leakage",
        definition:
          "An error where the system leaves the intended computational subspace, such as a qubit drifting into a higher energy level.",
      },
      {
        term: "Crosstalk",
        definition:
          "Undesired coupling where operating on one qubit perturbs another.",
      },
      {
        term: "Fidelity",
        definition:
          "A measure of how close two quantum states or operations are; high fidelity means the implementation is close to the target.",
      },
      {
        term: "Gate fidelity",
        definition:
          "How accurately a physical gate matches its intended ideal transformation.",
      },
      {
        term: "Readout fidelity",
        definition:
          "How reliably measurement hardware reports the correct classical outcome.",
      },
      {
        term: "State preparation",
        definition:
          "The process of initializing a desired quantum state before computation.",
      },
      {
        term: "Mid-circuit measurement",
        definition:
          "Measurement performed before the end of a circuit, essential for error correction and adaptive protocols.",
      },
    ],
  },
  {
    id: "algorithms",
    heading: "Algorithms and computational language",
    terms: [
      {
        term: "Quantum algorithm",
        definition:
          "An algorithm whose core speedup or behavior depends on quantum state evolution, interference, or entanglement.",
      },
      {
        term: "Oracle",
        definition:
          "A black-box operation used to encode problem structure in many complexity-theoretic quantum algorithms.",
      },
      {
        term: "Query complexity",
        definition: "The number of oracle calls needed by an algorithm.",
      },
      {
        term: "Quantum Fourier transform (QFT)",
        definition:
          "The quantum circuit version of the discrete Fourier transform, heavily used in period-finding and phase-estimation routines.",
      },
      {
        term: "Phase estimation",
        definition:
          "A foundational algorithmic primitive for learning eigenphases of a unitary or Hamiltonian.",
      },
      {
        term: "Amplitude amplification",
        definition:
          "The generalization of Grover-style probability boosting using repeated reflections.",
      },
      {
        term: "Amplitude estimation",
        definition:
          "A quantum method for estimating probabilities or expected values faster than some classical sampling methods.",
      },
      {
        term: "Hamiltonian simulation",
        definition:
          "The task of implementing time evolution generated by a target Hamiltonian.",
      },
      {
        term: "Variational algorithm",
        definition:
          "A hybrid quantum-classical method that optimizes parameters in a circuit using classical feedback.",
      },
      {
        term: "Ansatz",
        definition:
          "A chosen parameterized circuit family used in variational methods.",
      },
    ],
  },
  {
    id: "errors",
    heading: "Error correction and fault tolerance",
    terms: [
      {
        term: "Physical qubit",
        definition: "A hardware-level qubit implemented directly in the device.",
      },
      {
        term: "Logical qubit",
        definition:
          "An error-corrected qubit encoded across many physical qubits so that errors can be detected and suppressed.",
      },
      {
        term: "Quantum error correction (QEC)",
        definition:
          "The framework for protecting quantum information by encoding it redundantly and correcting errors without reading out the encoded data itself.",
      },
      {
        term: "Syndrome",
        definition:
          "The classical information extracted from parity-like checks that indicates what kind of error may have occurred.",
      },
      {
        term: "Syndrome extraction",
        definition:
          "The process of measuring stabilizer or parity information without destroying the logical quantum information.",
      },
      {
        term: "Stabilizer",
        definition:
          "An operator whose +1 eigenspace defines the code space of a stabilizer code.",
      },
      {
        term: "Surface code",
        definition:
          "A locality-friendly stabilizer code laid out on a 2D lattice; the dominant reference architecture in much of fault-tolerant quantum computing.",
      },
      {
        term: "Code distance",
        definition:
          "Roughly the minimum number of physical errors needed to cause an undetectable logical failure.",
      },
      {
        term: "Decoder",
        definition:
          "A classical algorithm that converts observed syndromes into a best-guess correction or frame update.",
      },
      {
        term: "Fault tolerance",
        definition:
          "The regime in which computation continues to work reliably even though components are noisy, because errors are detected and contained faster than they accumulate.",
      },
    ],
  },
  {
    id: "hardware",
    heading: "Hardware platforms people keep seeing in the news",
    terms: [
      {
        term: "Superconducting qubit",
        definition:
          "A qubit built from superconducting circuits; fast gates, strong engineering ecosystem, and a major platform for surface-code work.",
      },
      {
        term: "Trapped-ion qubit",
        definition:
          "A qubit encoded in isolated ions manipulated with lasers or fields; known for high-fidelity operations and long coherence times.",
      },
      {
        term: "Neutral-atom qubit",
        definition:
          "A qubit encoded in individually trapped neutral atoms, often using optical tweezers and Rydberg interactions.",
      },
      {
        term: "Photonic qubit",
        definition:
          "A qubit encoded in light, such as path, polarization, or time-bin modes.",
      },
      {
        term: "Topological qubit",
        definition:
          "A proposed qubit whose information is stored in nonlocal topological degrees of freedom, aiming for intrinsic error robustness rather than relying only on active correction.",
      },
    ],
  },
];
