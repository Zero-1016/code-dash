"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight } from "lucide-react";
import { useAppLanguage } from "@/lib/use-app-language";
import { problems } from "@/lib/problems";

export function HeroSection() {
  const { copy } = useAppLanguage();
  const router = useRouter();

  const handleStartSolving = () => {
    if (problems.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * problems.length);
    const randomProblem = problems[randomIndex];
    router.push(`/problem/${randomProblem.id}`);
  };

  return (
    <section className="relative overflow-hidden py-12 lg:py-20">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-6 flex items-center gap-2 rounded-2xl bg-accent px-4 py-2"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-accent-foreground">
              {copy.hero.badge}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="max-w-2xl text-balance text-4xl font-bold tracking-tight text-foreground lg:text-5xl"
          >
            {copy.hero.titleTop}
            <br />
            <span className="text-primary">{copy.hero.titleBottom}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="mt-4 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground lg:text-lg"
          >
            {copy.hero.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="mt-8"
          >
            <motion.button
              onClick={handleStartSolving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-2 rounded-[20px] bg-[#3182F6] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#3182F6]/30 transition-all hover:bg-[#2870d8] hover:shadow-xl hover:shadow-[#3182F6]/40"
            >
              {copy.hero.startSolving}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
