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
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="grow flex flex-col items-center justify-center text-center px-margin-mobile md:px-margin-desktop py-stack-xl mt-16 md:mt-14">
        {code && (
          <h1 className="font-serif text-[72px] md:text-[120px] leading-none tracking-[-0.04em] text-primary mb-6 animate-fade-in-up">
            {code}
          </h1>
        )}
        <h2
          className={`font-serif ${
            code
              ? "text-[20px] md:text-[28px] tracking-[0.1em] uppercase text-primary mb-4 animate-fade-in-up delay-100"
              : "text-[48px] md:text-[80px] leading-none tracking-[-0.02em] text-primary mb-6 animate-fade-in-up"
          }`}
        >
          {title}
        </h2>
        <p className="font-sans text-[14px] md:text-[16px] text-secondary max-w-[480px] mb-12 leading-relaxed animate-fade-in-up delay-200">
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
