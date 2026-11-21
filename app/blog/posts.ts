export type InlineSegment =
  | string
  | { text: string; href: string }
  | { text: string; bold: true };

export type Paragraph = string | InlineSegment[];

export type ContentBlock =
  | { type: "p"; content: Paragraph }
  | { type: "h3"; text: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | {
      type: "gallery";
      items: { src: string; alt: string; caption: string }[];
    }
  | { type: "ul"; items: Paragraph[] }
  | { type: "table"; headers: string[]; rows: string[][] };

export interface BlogSection {
  heading?: string;
  blocks?: ContentBlock[];
  /** Legacy flat paragraphs (TEE post). */
  paragraphs?: Paragraph[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  author?: string;
  date?: string;
  sections: BlogSection[];
}

const p = (content: Paragraph): ContentBlock => ({ type: "p", content });
const h3 = (text: string): ContentBlock => ({ type: "h3", text });
const img = (src: string, alt: string, caption?: string): ContentBlock => ({
  type: "image",
  src,
  alt,
  caption,
});
const ul = (...items: Paragraph[]): ContentBlock => ({ type: "ul", items });
const a = (text: string, href: string) => ({ text, href });
const b = (text: string): InlineSegment => ({ text, bold: true });

export const blogPosts: BlogPost[] = [
  {
    slug: "exponential-quantum-threat",
    title: "The Exponential Quantum Threat",
    excerpt:
      "Quantum computers already exist. The open question is how quickly algorithmic compression and hardware reliability are closing the gap to a cryptographically relevant machine.",
    author: "Lana Ivina",
    date: "November 22, 2026",
    sections: [
      {
        heading: "1. Where is the quantum computer?",
        blocks: [
          p(
            "A colleague recently asked me a deceptively simple question: “Will there really be a quantum computer? We didn’t have one two years ago, and we still don’t. Or am I missing something?”"
          ),
          p("The answer depends on what we mean by a “quantum computer”."),
          p("Usually, one of three things:"),
          ul(
            "A quantum computer: A physical machine that processes information using controlled quantum states and quantum-mechanical operations. These have existed for decades, across several fundamentally different hardware architectures.",
            "A commercially useful quantum computer: A machine that delivers practical value for a real-world workload. These already exist in specialized applications, particularly in optimization and hybrid quantum-classical computing. However, demonstrating a computational or economic advantage over the best classical alternatives remains challenging.",
            "A cryptographically relevant quantum computer (CRQC): A sufficiently powerful, fault-tolerant, general-purpose quantum computer capable of running Shor's algorithm to break widely deployed cryptographic schemes such as RSA-2048 or P-256. This is the machine everyone is waiting for, and the one the cryptographic community is concerned about. No such machine has yet been publicly demonstrated."
          ),
          p(
            "Quantum computers are already here. The open question is when they will become powerful and reliable enough to threaten modern cryptography."
          ),
        ],
      },
      {
        heading: "2. What Are Quantum Computers Actually Doing Today?",
        blocks: [
          p(
            "Quantum computers are already performing computations in manufacturing, logistics, chemistry, biology, and fundamental physics. Some of these applications are deployed in production. To understand their significance, we should distinguish two concepts: quantum-native applications and quantum advantage."
          ),
          p(
            "A quantum-native application is designed to exploit the properties of quantum systems, such as superposition, entanglement, or quantum interference. Simulating the behavior of molecules and generating certifiable quantum randomness are good examples. The term is relatively informal."
          ),
          p(
            "Quantum advantage is a more specific claim: a quantum computer performs a particular task faster, or with fewer resources, than the best known classical methods. I like to call it a “shortcut”. Shor's algorithm offers precisely such a shortcut for cryptography: it allows a sufficiently powerful quantum computer to solve the mathematical problems underlying RSA and elliptic-curve cryptography efficiently."
          ),
          p(
            "A quantum application can therefore be scientifically meaningful or commercially useful before quantum advantage has been established."
          ),
          h3("Quantum computing in industrial optimization"),
          p(
            "One of the earliest commercial applications comes from D-Wave, whose superconducting quantum annealers use quantum dynamics to search for low-energy configurations corresponding to solutions of optimization problems. These are specialized machines, unlike general-purpose, gate-based quantum computers."
          ),
          img(
            "/quantum_threat/routeoptimize.png",
            "Illustration of quantum computing applied to industrial route and scheduling optimization"
          ),
          p([
            "In March 2025, Ford Otosan, the Turkish joint venture between Ford and Koç Holding, announced that it had deployed a hybrid quantum-classical application for vehicle production scheduling. Ford Otosan manufactures more than 1,500 variants of its Transit vehicles, requiring coordination across production lines, equipment availability, workforce constraints, and vehicle configurations. ",
            a(
              "Using D-Wave's hybrid solvers",
              "https://www.dwavequantum.com/company/newsroom/press-release/in-production-ford-otosan-deploys-vehicle-manufacturing-application-built-with-d-wave-technology/"
            ),
            ", the company reported reducing the time required to schedule 1,000 vehicles from 30 minutes to less than five.",
          ]),
          p(
            "Another example is Pattison Food Group, a Canadian retailer whose delivery-driver scheduling process previously consumed approximately 80 person-hours every week."
          ),
          p(
            "A scheduling application built using D-Wave's technology reduced this to 15 hours. The system has been in production since late 2022 and supports delivery operations across more than 100 stores."
          ),
          p(
            "These results do not establish quantum advantage over the best classical optimization algorithms. Both deployed solutions combine quantum and classical computation, and their reported improvements are measured against the companies' previous processes."
          ),
          h3("Chemistry and biology: simulating quantum systems"),
          p(
            "Molecules are quantum-mechanical systems. Accurately describing the interactions between their electrons becomes extraordinarily computationally expensive as molecular complexity increases."
          ),
          p([
            "In May 2026, researchers from IBM, Cleveland Clinic, and RIKEN reported ",
            a(
              "simulating biologically relevant protein–ligand complexes",
              "https://www.ibm.com/quantum/blog/cleveland-clinic-riken-chemistry"
            ),
            " containing up to 12,635 atoms, including the digestive protein trypsin. The calculation combined IBM's superconducting quantum processors with the classical supercomputers Fugaku and Miyabi-G.",
          ]),
          p(
            "The quantum processors sampled electronic configurations of molecular fragments. The classical supercomputers then used those samples to calculate the fragments' energies and reconstruct the overall molecular properties."
          ),
          img(
            "/quantum_threat/moleculesim.png",
            "Illustration of quantum–classical simulation of molecular systems"
          ),
          p(
            "Just four months earlier, the team had demonstrated the same approach on a 303-atom protein. The subsequent work increased the size of the molecular systems by approximately 40 times, while also improving the accuracy of a particular computational step."
          ),
          p([
            "A different approach was demonstrated in a ",
            a(
              "2025 Nature Biotechnology study",
              "https://www.nature.com/articles/s41587-024-02526-3"
            ),
            " on discovering potential inhibitors of KRAS, a protein involved in several forms of cancer.",
          ]),
          p(
            "Researchers combined a generative AI model with a 16-qubit IBM quantum processor. The quantum circuit generated probability distributions used within the molecular-design process. The team synthesized and experimentally tested 15 proposed molecules, identifying two promising candidates for further research."
          ),
          p(
            "Neither study established an overall quantum advantage, and the KRAS compounds remain early-stage research candidates."
          ),
          h3("And what about quantum advantage?"),
          p([
            "In October 2025, Google Quantum AI published results from its ",
            a(
              "Quantum Echoes algorithm",
              "https://research.google/blog/a-verifiable-quantum-advantage/"
            ),
            ", executed on the superconducting Willow processor. The experiment involved measuring out-of-time-order correlators, mathematical quantities that describe how information and perturbations propagate through complex quantum systems.",
          ]),
          p(
            "Google reported that its quantum processor completed the benchmark computation approximately 13,000 times faster than the estimated runtime of leading classical supercomputer methods evaluated by the researchers."
          ),
          p(
            "Unlike earlier random-circuit sampling experiments, Quantum Echoes computes a physically meaningful quantity that can be used to study quantum dynamics, with potential applications in molecular structure analysis through nuclear magnetic resonance."
          ),
          p(
            "The demonstrated quantum advantage applies to the underlying computation, not yet to the molecular application."
          ),
          h3("So where is the quantum computer?"),
          p(
            "These examples demonstrate practical applications and scientific computations across different quantum computing architectures."
          ),
          p(
            "Yet none of these machines can currently factor RSA-2048 or execute the large-scale elliptic-curve attacks required to compromise modern public-key cryptography."
          ),
          p(
            "What exactly separates the quantum computers we have today from the cryptographically relevant quantum computer we are waiting for?"
          ),
        ],
      },
      {
        heading: "3. Deconstructing the Problem: A Quantum Attack Has Many Moving Parts",
        blocks: [
          h3("From cryptography to a mathematical problem"),
          p(
            "Modern public-key cryptography relies on mathematical problems that are computationally difficult to solve using known classical algorithms. For example, RSA relies on the difficulty of factoring large integers into their prime factors. Elliptic-curve cryptography (ECC) relies on the difficulty of the elliptic-curve discrete logarithm problem: recovering a private scalar from its corresponding public point."
          ),
          img(
            "/quantum_threat/discretelog.png",
            "Illustration of the elliptic-curve discrete logarithm problem"
          ),
          p(
            "In 1994, Peter Shor discovered that both problems could be solved efficiently by a sufficiently powerful quantum computer. This was a mathematical breakthrough, but translating Shor's algorithm into a physical computation introduces several layers of complexity."
          ),
          p(
            "RSA uses a public modulus, a 2,048-bit integer constructed by multiplying two large prime numbers. Recovering those factors allows an attacker to reconstruct the corresponding private key. Shor's algorithm reduces factoring to a problem called order finding. In simplified terms, the algorithm looks for the period of a mathematical function involving modular exponentiation."
          ),
          p(
            "Quantum phase estimation, using quantum interference, reveals information about that period. Classical post-processing can then recover the prime factors. But implementing this procedure requires an enormous number of arithmetic operations on quantum information."
          ),
          h3("From algorithms to arithmetic circuits"),
          p(
            "One of the most computationally expensive components of Shor's factoring algorithm is modular exponentiation. It involves repeated modular multiplications, which themselves require additions, comparisons, and other arithmetic operations. Each operation must be expressed as a quantum circuit: a sequence of elementary quantum gates acting on qubits."
          ),
          p(
            "There is an additional constraint: the quantum operations that manipulate coherent superpositions must be reversible. Intermediate calculations often require auxiliary qubits, known as ancillae, whose temporary information may interfere with the computational register and must subsequently be removed through a process called uncomputation."
          ),
          p("This creates several distinct optimization problems:"),
          ul(
            "How efficiently can we implement modular addition and multiplication?",
            "How many auxiliary qubits does each operation require?",
            "How many gates must be executed, and which can run in parallel?",
            "Can temporary qubits be reused?",
            "How much arithmetic precision do we actually need?"
          ),
          p(
            "Similar questions arise in elliptic-curve cryptanalysis, where quantum circuits implement elliptic-curve point additions and arithmetic over finite fields. The efficiency of these arithmetic building blocks directly determines the resources required to execute the overall algorithm."
          ),
          h3("From circuits to logical qubits"),
          p(
            "A quantum circuit can be described in terms of logical qubits and quantum gates. Logical qubits represent the quantum information required by the algorithm. Gate counts describe the operations performed on that information, while circuit depth describes how many sequential computational steps are needed. These quantities are related, but reducing one does not necessarily reduce the others."
          ),
          p(
            "For example, an implementation may use fewer logical qubits but require more operations. Another may consume additional qubits to execute operations in parallel, reducing its runtime. A 2026 study published in PRX Quantum illustrates this tradeoff."
          ),
          p([
            "Researchers from Google Quantum AI and collaborating institutions presented ",
            a(
              "two quantum circuit designs",
              "https://journals.aps.org/prxquantum/abstract/10.1103/j3xf-bw18"
            ),
            " for attacking the 256-bit elliptic-curve discrete logarithm problem underlying secp256k1, the curve used by Bitcoin and other cryptocurrencies.",
          ]),
          p(
            "One design requires at most 1,200 logical qubits and 90 million Toffoli gates. Another uses at most 1,450 logical qubits and 70 million Toffoli gates. Both implement the same mathematical attack, with different resource requirements."
          ),
          p(
            "Toffoli gates are particularly important because they are widely used in reversible arithmetic and are expensive to implement fault-tolerantly in many quantum computing architectures."
          ),
          h3("From logical qubits to physical qubits"),
          p(
            "A quantum circuit requiring 1,200 logical qubits does not translate into a machine containing 1,200 physical qubits. Protecting quantum information and executing operations reliably requires quantum error correction, additional physical qubits, and fault-tolerant operations."
          ),
          h3("From physical qubits to a functioning machine"),
          p(
            "Finally, we reach the hardware itself. Different quantum computing platforms use entirely different physical systems to implement qubits, each with its own tradeoffs in gate speed, fidelity, connectivity, and scalability."
          ),
          h3("One attack, many independent research problems"),
          p(
            "The resource requirements of a quantum attack depend on the interaction of several research areas:"
          ),
          ul(
            "Quantum algorithms: How efficiently can we solve the underlying mathematical problem?",
            "Arithmetic and circuit optimization: How many qubits and operations are required to implement the algorithm?",
            "Fault-tolerant computation: How efficiently can those operations be executed reliably?",
            "Quantum error correction: How much physical hardware is needed to protect the computation?",
            "Hardware engineering: How quickly and reliably can the physical machine execute the required operations?",
            "Classical computing: How efficiently can we compile circuits, decode errors in the quantum system?"
          ),
          p(
            "Progress in one area changes the requirements imposed on the others. Advances in algorithms, error correction, and hardware can reinforce one another, although improvements often involve trade-offs between qubit count and execution time."
          ),
          p(
            "The computational resources required to break cryptography are therefore a moving target."
          ),
        ],
      },
      {
        heading: "4. The Algorithms Are Being Compressed",
        blocks: [
          p(
            "The quantum circuits implementing Shor's algorithm are still being optimized, increasingly with the assistance of AI."
          ),
          p([
            "In May 2026, Eigen Labs launched ",
            a("ecdsa.fail", "https://ecdsa.fail/"),
            ", an open competition to optimize elliptic-curve point addition, one of the expensive computational subroutines in Shor's algorithm for breaking ECDSA signatures on secp256k1, the curve used by Bitcoin.",
          ]),
          p(
            "The competition brought together researchers and AI agents to minimize two resources: logical qubits and Toffoli gates. Each submission was automatically tested for correctness and scored using the product of these two quantities."
          ),
          ul(
            "May 2026: 2,715 qubits × 3.96 million Toffoli gates.",
            "July 2026: 1,151 qubits × 1.30 million Toffoli gates.",
            "November 2026: 1,227 qubits × 722,000 Toffoli gates."
          ),
          p(
            "In less than six months, the best resource score fell by approximately 92%, a twelvefold improvement. No quantum hardware was required to achieve this."
          ),
          p(
            "This optimization concerns one subroutine of a quantum attack, and the resource score is not a direct measure of physical hardware cost or execution time. Nevertheless, it demonstrates something important: the computational requirements of quantum cryptanalysis can fall dramatically through algorithmic improvements alone."
          ),
        ],
      },
      {
        heading: "5. Error Correction: The Cost of Reliability Is Changing",
        blocks: [
          p(
            "An important concept in quantum error correction is the error threshold. Below a certain physical error rate, increasing the code distance—the measure of how many errors an encoded state can tolerate—can progressively suppress logical errors."
          ),
          p([
            "In December 2024, Google Quantum AI ",
            a(
              "demonstrated this experimentally",
              "https://www.nature.com/articles/s41586-024-08449-y"
            ),
            " using its Willow superconducting processor. Increasing the surface-code distance from 5 to 7 reduced the logical error rate by approximately a factor of 2.14. Its distance-7 quantum memory used 101 physical qubits and achieved a logical error rate of 0.143% per correction cycle.",
          ]),
          p([
            "Another breakthrough came in November 2025, when researchers demonstrated ",
            a(
              "key elements of universal fault-tolerant computing",
              "https://www.nature.com/articles/s41586-025-09848-5"
            ),
            " using arrays of up to 448 neutral atoms. Their experiments combined error correction, logical gates, quantum teleportation, and mid-circuit qubit reuse. The latter increased experimental cycle rates by two orders of magnitude.",
          ]),
          p("Research is also reducing the overhead of fault tolerance itself:"),
          ul(
            "Quantum LDPC codes aim to protect more logical qubits using fewer physical qubits.",
            "Magic-state cultivation offers more efficient ways to prepare the special states needed for expensive non-Clifford operations.",
            "Improved decoding algorithms make it possible to identify errors more accurately and process corrections with lower latency."
          ),
          p(
            "Neither experimental result demonstrates a machine capable of executing Shor's algorithm at cryptographic scale. Yet both show measurable progress toward making reliable quantum computation practical."
          ),
          p(
            "The crucial observation is that the number of physical qubits required to execute a given quantum circuit is not fixed. It changes as error-correcting codes, decoding algorithms, and fault-tolerant operations improve."
          ),
        ],
      },
      {
        heading: "6. Several Hardware Architectures Are Advancing Simultaneously",
        blocks: [
          {
            type: "table",
            headers: ["Architecture", "Advantage", "Main challenge"],
            rows: [
              [
                "Superconducting circuits",
                "Fast gates, established chip fabrication",
                "Cryogenics, wiring, scalability",
              ],
              [
                "Trapped ions",
                "High fidelity, long coherence times, connectivity",
                "Slower gates, system integration",
              ],
              [
                "Neutral atoms",
                "Large, reconfigurable qubit arrays",
                "Gate fidelity, control complexity",
              ],
              [
                "Photonics",
                "Optical networking and modularity",
                "Photon loss, resource-state generation",
              ],
              [
                "Semiconductor spins",
                "Potential compatibility with semiconductor manufacturing",
                "Device uniformity, control, scaling",
              ],
            ],
          },
          {
            type: "gallery",
            items: [
              {
                src: "/quantum_threat/superconducting-ibm.jpeg",
                alt: "IBM superconducting quantum processor in a dilution refrigerator",
                caption: "Superconducting circuits · IBM",
              },
              {
                src: "/quantum_threat/trapped-ions-quantinuum.jpeg",
                alt: "Quantinuum trapped-ion quantum computing apparatus",
                caption: "Trapped ions · Quantinuum",
              },
              {
                src: "/quantum_threat/neutral-atoms-quera.jpeg",
                alt: "QuEra neutral-atom quantum computing system",
                caption: "Neutral atoms · QuEra",
              },
              {
                src: "/quantum_threat/photonics-xanadu.jpeg",
                alt: "Xanadu photonic quantum computing hardware",
                caption: "Photonics · Xanadu",
              },
              {
                src: "/quantum_threat/semiconductor-spins-quantummotion.jpeg",
                alt: "Quantum Motion semiconductor spin qubit hardware",
                caption: "Semiconductor spins · Quantum Motion",
              },
            ],
          },
          p(
            "Superconducting qubits require temperatures close to absolute zero. Trapped ions and neutral atoms are manipulated with lasers in vacuum systems. Photonic architectures use light to encode quantum information, with some components operating at room temperature. There is currently no established winner."
          ),
          p([
            "These architectures can also complement one another. In June 2025, IonQ, which develops trapped-ion quantum computers, ",
            a(
              "acquired Lightsynq",
              "https://www.ionq.com/news/ionq-completes-acquisition-of-lightsynq-accelerating-quantum-computing-and"
            ),
            ", a company specializing in photonic interconnects and quantum memory. In October 2026, IonQ demonstrated over 1,000 entanglement events per second between a trapped-ion qubit and a solid-state quantum memory connected through photons. This illustrates how different technologies can combine their strengths to overcome scaling challenges, potentially enabling modular quantum computers composed of interconnected processors.",
          ]),
        ],
      },
      {
        heading: "7. The Actual Signal: Convergence and the Rate of Change",
        blocks: [
          p(
            "A cryptographically relevant quantum computer becomes possible when the resources an attack requires meet the capabilities of the hardware available."
          ),
          p("Both sides of this equation are changing:"),
          ul(
            "Attack requirements: The computational resources needed to execute a cryptographic attack.",
            "Hardware capability: The scale, speed, and reliability of computations that quantum machines can actually perform."
          ),
          img(
            "/quantum_threat/convergence-fronts.png",
            "Diagram comparing falling attack requirements with rising hardware capability",
            "Two fronts approaching: attack requirements versus hardware capability"
          ),
          p(
            "The first frontier is moving downward as researchers discover more efficient implementations of quantum algorithms. The second is moving upward as hardware improves."
          ),
          p(
            "The interesting question is how quickly the gap between them is closing."
          ),
          h3("How do we measure convergence?"),
          p(
            "To put these requirements into perspective, consider the hardware needed to execute the attacks discussed earlier. Google's 2026 secp256k1 estimates involve two circuit designs: 1,200 logical qubits and 90 million Toffoli gates, or 1,450 logical qubits and 70 million gates. Assuming a superconducting architecture with a physical error rate of 0.1%, researchers estimate that fewer than 500,000 physical qubits could complete the attack in just 18–23 minutes."
          ),
          p([
            "RSA-2048 provides a striking example of how these requirements evolve. In 2019, factoring RSA-2048 was estimated to require 20 million physical qubits and eight hours. By 2025, ",
            a(
              "Craig Gidney's updated analysis",
              "https://arxiv.org/abs/2505.15917"
            ),
            " had brought that estimate below one million physical qubits, with an execution time of less than a week.",
          ]),
          p(
            "These estimates describe hypothetical fault-tolerant machines, but show how algorithmic improvements can substantially reduce hardware requirements, with trade-offs between qubit count and execution time."
          ),
          p(
            "On the hardware side, we can measure how many logical qubits a machine can reliably operate, how quickly it executes logical gates, and how long it can sustain a computation before errors become overwhelming."
          ),
          p(
            "A cryptographic attack becomes feasible when its complete resource requirements can be satisfied by a physical machine within an acceptable runtime and probability of success."
          ),
          p(
            "However, neither frontier can be represented accurately by a single number. Circuit optimizations involve trade-offs between memory and execution time, while hardware architectures have different gate speeds, error rates, and connectivity."
          ),
          h3("When might a cryptographically relevant quantum computer actually arrive?"),
          p([
            "Expert forecasts vary considerably, but the 2030s are increasingly considered plausible. A ",
            a(
              "2025 Global Risk Institute survey",
              "https://globalriskinstitute.org/publication/quantum-threat-timeline-report-2025b/"
            ),
            " placed the likelihood of a CRQC emerging within ten years at 28–49%, rising to 51–70% within fifteen years.",
          ]),
          p(["If I had to pick a year, I would say ", b("2038"), "."]),
          h3("Why this matters"),
          p(
            "The exact arrival date remains uncertain, and the technical assumptions behind these predictions are constantly changing."
          ),
          p([
            "The signal the cryptographic industry should be watching is ",
            b("the rate at which the remaining engineering challenges are being overcome"),
            ".",
          ]),
          p(
            "Cryptographic migration takes years. Decisions about quantum readiness must therefore account for this evolving risk long before a successful large-scale attack is demonstrated."
          ),
        ],
      },
    ],
  },
  {
    slug: "zcash-names-tee",
    title: "A fantastic TEE use case: Zcash Names.",
    excerpt:
      "For the past eight weeks, Circuit Labs has been co-developing the Zcash Names protocol. Here is what we learned, and why the protocol leads so naturally to the use of a TEE.",
    sections: [
      {
        paragraphs: [
          "For the past eight weeks, Circuit Labs has been co-developing the Zcash Names protocol. I want to share some of what we learned while refining the design and working through the engineering challenges. One of the most interesting parts is how naturally the protocol leads to the use of a TEE.",
        ],
      },
      {
        heading: "Why Zcash Names ended up inside a TEE",
        paragraphs: [
          "One of the things I love most about Zcash Names is that the architecture is almost forced on you by the privacy model.",
          "In a normal public blockchain naming system, everyone can see the state. If a name points to an address, that mapping is just there, publicly available to everyone.",
          "Zcash is different. Shielded transactions are private by design. If I send something to you, the information is visible to the parties who have the right (viewing) keys to see it. That is great for privacy, but it creates a very specific problem for public names.",
          "If we want one service to understand all registered names, it needs a way to see all of those relevant shielded notes. The obvious way to do that is with one single viewing key, given to all exchanges, wallets, and explorers. Simple and elegant.",
          "And that immediately creates a centralization point.",
          "We managed to unify the names and addresses into a public view. But one viewing key is coupled to one spending key. There is now one entity that can approve state changes and authorize name claims and updates. In our case, that entity is the Mint.",
          "This is exactly where TEEs — Trusted Execution Environments — come in beautifully.",
          "The problem is that centralized infrastructure is controlled by some operator. In ZNS that infrastructure contains a protocol component with privileged authority. Once that component exists, the question becomes: how do we make sure nobody operating the machine can quietly take advantage of that privilege?",
          "Our answer is to run the Mint inside an AMD SEV-SNP confidential VM launched on a Scaleway Elastic Metal bare-metal server.",
          "The operator can start the VM, or guest, stop it, kill it, deny it network access, or delete its disks. What the operator should not be able to do is: read the VM memory from the host, extract the seed from the sealed capsule, or boot a different image and still open that capsule. In production, we also remove ordinary SSH and operator shell access from the guest.",
          "While the operator retains availability control, it does not get unrestricted custody control.",
          "And this is one of the most intuitive use cases of TEEs I have seen in the blockchain space.",
        ],
      },
      {
        heading: "The security boundary: the guest (confidential VM)",
        paragraphs: [
          "The guest image contains the components that comprise the core protocol: Zebra the Zcash node, the Mint, the key generation code, the migration code, and the small amount of infrastructure needed to keep them all alive.",
          "We build a fixed guest image and compute its SEV-SNP measurement. That measurement commits to the launch configuration: the guest firmware, kernel, initial RAM disk, command line, CPU configuration and other measured inputs.",
          "The key idea here is that the seed is not simply “stored on a server.” It is sealed in a capsule to an approved guest context. If one of the measured launch inputs changes, the measurement changes.",
          "If the measurement changes, the new release simply cannot decrypt the original encrypted capsule. The capsule sealing key is derived from the AMD platform’s SEV-SNP key hierarchy and bound to the guest measurement and policy. The measurement and the guest policy are mixed into the derivation.",
          "That is the part I find simple yet sophisticated. The key is tied to the code environment that is allowed to use it.",
          "GitHub releases are therefore part of the security model as well. The release artifacts, expected measurement and upgrade data are published and can be checked independently.",
        ],
      },
      {
        heading: "Inside the guest",
        paragraphs: [
          "The guest is intentionally quite boring (thank God).",
          "There is a small init script that mounts the two persistent volumes, configures networking, starts a supervisor, waits until Zebra is ready, and then allows the key generation ceremony to proceed. Once Zebra is ready and the ceremony is complete, the Mint can run.",
          "Overall there are only a few moving parts, and they all have very explicit open-source dependencies.",
        ],
      },
      {
        heading: "Upgrades and recovery",
        paragraphs: [
          "Sealing a seed into one VM is the first step, but real software evolves.",
          "The protocol improves continuously. The Mint needs to be upgraded. Zebra developers ship quickly. The Linux image changes. Security fixes happen. Eventually hardware changes too.",
          "The moment the measured image changes, the new guest cannot open the previous capsule.",
          "So we needed a way to move custody from one approved VM measurement to another without ever exposing the seed to the host.",
          "The new VM creates an ephemeral migration key and proves, through SEV-SNP attestation, which measurement it is running.",
          "The old guest verifies that attestation and checks that the new measurement is an approved migration target. Only then does the old guest unseal the seed.",
          "It derives a shared secret with the new guest, encrypts the seed for that specific target, and sends only the encrypted transfer through the host-controlled migration channel.",
          "The new guest verifies the source attestation, decrypts the seed, and immediately reseals it with a sealing key derived for its own SEV-SNP platform and guest context.",
          "Then it reopens the new capsule and verifies that the migrated seed is correct before producing a receipt.",
          "So the host coordinates the migration without ever being trusted with the plaintext seed.",
          "The same mechanism also means that, conceptually, a software upgrade and a hardware move are not completely different operations. They are both custody transitions from one attested environment to another.",
          "For disaster recovery, we plan to keep a second SEV-SNP machine in standby, holding its own independently sealed capsule produced by a completed migration of an approved release. While at least one guest capable of opening its capsule is still running, we can migrate onward to a new release or to another SEV-SNP machine. We are also working toward binding each Mint-produced transaction to attestation evidence, so observers can verify which approved guest measurement produced it.",
        ],
      },
      {
        heading: "What the team can and cannot do",
        paragraphs: [
          "Another thing we wanted to make very explicit is the boundary between the operator and the VM.",
          "The host remains ours operationally.",
          "We can kill the VM. We can pause it. We can refuse to restart it. We can block its network. We can destroy the disks.",
          "ZNS users will have to trust us to keep the service available (and the seed capsule safe).",
          "What we are trying to remove is a different kind of trust: the idea that one of us could simply SSH into the mint server, inspect the key, alter the process, or run arbitrary commands next to the custody material.",
          "The production goal is therefore no SSH and no ordinary operator shell inside the guest.",
          "The host should control lifecycle, not guest internals.",
          "TEEs obviously do not remove trust completely. They shift the trust boundary.",
          "And if you define that boundary carefully, they can remove exactly the kind of trust that is most dangerous for custody.",
        ],
      },
      {
        heading: "Does this decentralize the mint?",
        paragraphs: [
          "The short answer is no.",
          "The team still operates the machine. We can still cause downtime. We still control deployment infrastructure today. The TEE doesn’t magically make the system decentralized.",
          "What it does is much more specific, and in my opinion much more meaningful: using hardware, it constrains what the infrastructure operator is allowed to do to the guest.",
          "That is a big improvement over the model where whoever has root on the server effectively owns the application.",
          [
            "There are still steps on the way to becoming ",
            {
              text: "Dev-Proof",
              href: "https://github.com/amiller/devproof-audits-guide#stage-1-checklist",
            },
            ": later we may pin a hash of the guest's attestation in the transactions the mint sends, so the measurement that produced them can be looked up on-chain. The upgrade sequence will soon refuse older releases in order to prevent unauthorized rollbacks. The release itself stays authorized by GitHub, which is the authority we chose to keep.",
          ],
          "But even in the current form, this architecture solves a very real centralization problem created by the neat privacy-first Zcash design. And that is why I like this use of TEEs so much.",
          "It is there because Zcash privacy led to one privileged component, and confidential computing gives us a way to make that component much less dependent on trusting the people running the infrastructure.",
          "That is a genuinely elegant fit.",
        ],
      },
    ],
  },
];

export function getPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getSectionBlocks(section: BlogSection): ContentBlock[] {
  if (section.blocks?.length) return section.blocks;
  return (section.paragraphs ?? []).map((content) => ({ type: "p" as const, content }));
}
