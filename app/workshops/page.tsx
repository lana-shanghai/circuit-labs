import type { Metadata } from "next";
import WorkshopsClient from "../components/WorkshopsClient";

export const metadata: Metadata = {
  title: "Quantum Computing Workshops",
  description:
    "Explore CircuitLabs workshops on quantum computing history, introductory concepts, mathematical foundations, and Shor's algorithm.",
};

export default function WorkshopsPage() {
  return <WorkshopsClient />;
}
