import type { Metadata } from "next";
import QlossaryClient from "../components/QlossaryClient";

export const metadata: Metadata = {
  title: "Quantum Glossary",
  description:
    "Expandable glossary of quantum computing terms: core concepts, math, circuits, physics, algorithms, error correction, and hardware.",
};

export default function QlossaryPage() {
  return <QlossaryClient />;
}
