import type { Metadata } from "next";
import ShorsAlgorithmClient from "../components/ShorsAlgorithmClient";

export const metadata: Metadata = {
  title: "Shor's Algorithm Workshop",
  description:
    "A focused Shor's algorithm workshop for understanding and running the N=15 example.",
};

export default function ShorsAlgorithmPage() {
  return <ShorsAlgorithmClient />;
}
