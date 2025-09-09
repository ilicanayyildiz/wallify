import { Faq } from "@/components/ui/faq";

export const metadata = {
  title: "Häufig gestellte Fragen | Pixeryo",
  description: "Finden Sie Antworten auf häufige Fragen zu Pixeryos Plattform, Lizenzen und Dienstleistungen.",
};

const faqData = {
  heading: "Häufig gestellte Fragen",
  description: "Finden Sie Antworten auf häufige Fragen zu unserer Stock-Bild-Plattform. Können Sie nicht finden, wonach Sie suchen? Wenden Sie sich an unser Support-Team.",
  supportHeading: "Haben Sie noch Fragen?",
  supportDescription: "Unser engagiertes Support-Team ist hier, um Ihnen bei Fragen zu unseren Stock-Bildern oder Dienstleistungen zu helfen.",
  supportButtonText: "Support kontaktieren",
  supportButtonUrl: "/contacts",
};

export default function FaqPage() {
  return <Faq {...faqData} />;
} 