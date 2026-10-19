import type { Metadata } from "next";
import { Wizard } from "@/components/wizard/Wizard";

export const metadata: Metadata = {
  title: "Marke anmelden",
};

export default function AnmeldenPage() {
  return <Wizard />;
}
