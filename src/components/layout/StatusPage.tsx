import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface StatusPageProps {
  code?: string;
  title: string;
  subtitle: string;
  actions: ReactNode;
}

export function StatusPage({ code, title, subtitle, actions }: StatusPageProps) {
  // The page's one h1: the code when there is one, otherwise the title.
  const Title = code ? "h2" : "h1";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="grow flex flex-col items-center justify-center text-center px-margin-mobile md:px-margin-desktop py-stack-xl mt-16 md:mt-14">
        {code && (
          <h1 className="text-status-code text-primary mb-6 animate-fade-in-up">
            {code}
          </h1>
        )}
        <Title
          className={`${
            code
              ? "text-status-label text-primary mb-4 animate-fade-in-up delay-100"
              : "text-status-title text-primary mb-6 animate-fade-in-up"
          }`}
        >
          {title}
        </Title>
        <p className="text-status-body text-secondary max-w-[480px] mb-12 animate-fade-in-up delay-200">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
          {actions}
        </div>
      </main>
      <Footer />
    </div>
  );
}
