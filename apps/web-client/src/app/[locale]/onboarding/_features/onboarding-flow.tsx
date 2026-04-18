"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  ArrowLeft,
  Leaf,
  Shield,
  CheckCircle2,
  Mail,
  Hexagon,
} from "lucide-react";
// We don't have Apple from lucide-react (wait, is there Apple? lucide-react actually doesn't have an Apple logo we might need to fake it or check if lucide has it).
// Wait, the user imported Apple from 'lucide-react', let's stick to their code, if it exists it works, otherwise I might fix it later.
// Actually, `lucide-react` does have `Apple`. Let's assume it exists.

export function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Analyse de votre profil...");

  const totalSteps = 5;
  const currentProgress = (step / totalSteps) * 100;

  useEffect(() => {
    if (step === 4) {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep(5), 400);
            return 100;
          }
          const newProgress = prev + 1;
          if (newProgress === 25)
            setLoadingText("Assignation de votre Mascotte...");
          if (newProgress === 50)
            setLoadingText("Préparation de votre BioDex...");
          if (newProgress === 75)
            setLoadingText("Génération des recommandations éthiques...");
          return newProgress;
        });
      }, 40);
      return () => clearInterval(interval);
    }
  }, [step]);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="min-h-screen bg-[#0B0F15] text-white font-sans flex flex-col relative overflow-hidden selection:bg-emerald-500/30">
      {/* Barre de progression */}
      {step > 0 && step < 4 && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/5 z-50">
          <div
            className="h-full bg-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${currentProgress}%` }}
          />
        </div>
      )}

      {/* Bouton Retour */}
      {step > 0 && step < 4 && (
        <button
          onClick={prevStep}
          className="absolute top-6 left-6 z-50 w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={20} className="text-white/70" />
        </button>
      )}

      <main className="flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* ================= ÉTAPE 0 : LE HOOK ================= */}
        {step === 0 && (
          <div className="relative flex-1 flex flex-col justify-end p-8 pb-12">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/80 to-transparent"></div>
            <div className="absolute inset-0 bg-emerald-900/10 mix-blend-overlay"></div>

            <div className="relative z-10 text-center space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-full mb-2 backdrop-blur-md">
                <Leaf size={14} className="text-emerald-400" />
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  Make The Change
                </span>
              </div>

              <h1 className="text-4xl font-black leading-tight text-balance">
                Soutenez la nature.<br />Récoltez ses fruits.
              </h1>

              <p className="text-white/60 text-sm max-w-sm mx-auto leading-relaxed">
                Financez les projets de nos artisans locaux, protégez la
                biodiversité et recevez leurs produits d'exception en
                remerciement.
              </p>

              <div className="bg-white/5 rounded-2xl p-4 mt-8 flex justify-around items-center border border-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                <div className="text-center flex flex-col items-center">
                  <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-1">
                    <Hexagon size={14} fill="currentColor" />
                    <p className="text-xl font-black">290k+</p>
                  </div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider font-bold">
                    Abeilles protégées
                  </p>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div className="text-center flex flex-col items-center">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-400 mb-1">
                    <CheckCircle2 size={16} />
                    <p className="text-xl font-black">100%</p>
                  </div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider font-bold">
                    Circuit Court
                  </p>
                </div>
              </div>

              <button
                onClick={nextStep}
                className="w-full mt-6 py-4 rounded-2xl bg-emerald-500 text-[#0B0F15] font-black text-[15px] flex items-center justify-center gap-2 hover:bg-emerald-400 hover:scale-[0.98] active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                Découvrir le mouvement <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ================= ÉTAPE 1 : LE QUIZ ================= */}
        {step === 1 && (
          <div className="px-6 flex flex-col items-center max-w-md mx-auto w-full">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center text-3xl mb-6 border border-emerald-500/30">
              🤔
            </div>
            <h2 className="text-2xl font-black text-center mb-2">
              Faisons un test rapide.
            </h2>
            <p className="text-white/50 text-center mb-10">
              Combien de fleurs une abeille doit-elle butiner pour produire 1 kilo
              de miel ?
            </p>

            <div className="w-full space-y-3">
              {[
                "100 000 fleurs",
                "1 million de fleurs",
                "4 millions de fleurs",
              ].map((answer, i) => (
                <button
                  key={i}
                  onClick={() => setQuizAnswered(true)}
                  disabled={quizAnswered}
                  className={`w-full p-5 rounded-2xl border flex items-center justify-between text-lg font-bold transition-all ${quizAnswered
                      ? i === 2
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                        : "bg-white/5 border-white/5 opacity-50"
                      : "bg-white/5 border-white/10 hover:bg-white/10 active:scale-95"
                    }`}
                >
                  {answer}
                  {quizAnswered && i === 2 && (
                    <CheckCircle2 size={20} className="text-emerald-400" />
                  )}
                </button>
              ))}
            </div>

            {quizAnswered && (
              <div className="mt-8 p-5 bg-gradient-to-br from-emerald-900/40 to-transparent border border-emerald-500/30 rounded-2xl w-full animate-in zoom-in-95 duration-300">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🎉</div>
                  <div>
                    <h3 className="font-bold text-white mb-1">C'est exact !</h3>
                    <p className="text-white/60 text-sm leading-snug mb-4">
                      Le travail des pollinisateurs est colossal. Voici{" "}
                      <strong className="text-emerald-400">500 Graines</strong>{" "}
                      pour récompenser votre curiosité.
                    </p>
                    <button
                      onClick={nextStep}
                      className="bg-emerald-500 text-[#0B0F15] px-6 py-2 rounded-xl font-bold text-sm w-full"
                    >
                      Continuer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ÉTAPE 2 : LA FACTION */}
        {step === 2 && (
          <div className="px-6 flex flex-col items-center max-w-md mx-auto w-full pt-12 pb-6">
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3">
              Votre Identité
            </span>
            <h2 className="text-3xl font-black text-center mb-2">
              Quelle est votre priorité ?
            </h2>
            <p className="text-white/50 text-center mb-8 text-sm">
              Choisissez la cause que vous souhaitez défendre. Vous rejoindrez
              la faction correspondante.
            </p>

            <div className="w-full space-y-4">
              {[
                {
                  id: "faune",
                  title: "Vie Sauvage",
                  desc: "Protégez les abeilles et les espèces menacées.",
                  icon: "🦊",
                  color: "hover:border-amber-500/50 hover:bg-amber-500/10",
                  activeColor: "border-amber-500 bg-amber-500/20",
                },
                {
                  id: "flore",
                  title: "Terres & Forêts",
                  desc: "Financez la plantation d'arbres et l'agroforesterie.",
                  icon: "🌳",
                  color: "hover:border-emerald-500/50 hover:bg-emerald-500/10",
                  activeColor: "border-emerald-500 bg-emerald-500/20",
                },
                {
                  id: "humain",
                  title: "Artisans Locaux",
                  desc: "Aidez les coopératives et le commerce équitable.",
                  icon: "🤝",
                  color: "hover:border-blue-500/50 hover:bg-blue-500/10",
                  activeColor: "border-blue-500 bg-blue-500/20",
                },
              ].map((faction) => (
                <button
                  key={faction.id}
                  onClick={() => setSelectedFaction(faction.id)}
                  className={`w-full p-4 rounded-2xl border flex items-center gap-4 text-left transition-all ${selectedFaction === faction.id
                      ? faction.activeColor
                      : `bg-white/5 border-white/10 ${faction.color}`
                    }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 ${selectedFaction === faction.id
                        ? "bg-white/20"
                        : "bg-white/5"
                      }`}
                  >
                    {faction.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-0.5">
                      {faction.title}
                    </h3>
                    <p className="text-white/50 text-xs leading-snug">
                      {faction.desc}
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedFaction === faction.id
                        ? "border-white bg-white"
                        : "border-white/20"
                      }`}
                  >
                    {selectedFaction === faction.id && (
                      <div className="w-2 h-2 bg-[#0B0F15] rounded-full" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={nextStep}
              disabled={!selectedFaction}
              className={`w-full mt-8 py-4 rounded-2xl font-black text-[15px] transition-all ${selectedFaction
                  ? "bg-white text-[#0B0F15]"
                  : "bg-white/10 text-white/30"
                }`}
            >
              Confirmer mon choix
            </button>
          </div>
        )}

        {/* ÉTAPE 3 : LE CONTRAT */}
        {step === 3 && (
          <div className="px-6 flex flex-col items-center max-w-md mx-auto w-full pt-12">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
              <Shield size={32} />
            </div>
            <h2 className="text-3xl font-black text-center mb-2 leading-tight">
              L'impact, c'est<br />la régularité.
            </h2>
            <p className="text-white/50 text-center mb-10 text-sm px-4">
              Même quelques minutes suffisent. Combien de temps pouvez-vous nous
              accorder par jour ?
            </p>

            <div className="w-full space-y-3">
              {[
                {
                  time: "1 min",
                  desc: "Juste récupérer mes graines",
                  tag: "",
                },
                { time: "3 min", desc: "Lecture + Défis", tag: "Recommandé" },
                { time: "5+ min", desc: "Impact Maximum", tag: "" },
              ].map((option, i) => (
                <button
                  key={i}
                  onClick={nextStep}
                  className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10 active:scale-95 transition-all flex items-center justify-between group"
                >
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg text-white">
                        {option.time}
                      </span>
                      {option.tag && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                          {option.tag}
                        </span>
                      )}
                    </div>
                    <span className="text-white/40 text-sm">{option.desc}</span>
                  </div>
                  <ChevronRight className="text-white/20 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ÉTAPE 4 : FAUX CHARGEMENT */}
        {step === 4 && (
          <div className="px-6 flex flex-col items-center justify-center max-w-md mx-auto w-full h-full">
            <div className="relative w-32 h-32 mb-8">
              <svg
                className="w-full h-full animate-spin text-emerald-500/20"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  strokeWidth="2"
                  stroke="currentColor"
                  strokeDasharray="60 40"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-black text-white">
                  {loadingProgress}%
                </span>
              </div>
            </div>
            <h2 className="text-2xl font-black text-center mb-4">
              Création de votre expérience...
            </h2>
            <div className="h-6 overflow-hidden">
              <p className="text-emerald-400 text-sm font-medium animate-pulse text-center">
                {loadingText}
              </p>
            </div>
          </div>
        )}

        {/* ÉTAPE 5 : LE PAYWALL */}
        {step === 5 && (
          <div className="px-6 flex flex-col items-center justify-center max-w-md mx-auto w-full h-full pb-12 animate-in zoom-in-95 duration-500">
            <div className="relative mb-8 mt-12">
              <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center text-5xl z-10 relative shadow-[0_0_40px_rgba(16,185,129,0.3)] border border-emerald-500/30">
                {selectedFaction === "faune"
                  ? "🦊"
                  : selectedFaction === "humain"
                    ? "🤝"
                    : "🌳"}
              </div>
              <div className="absolute -top-2 -right-2 bg-[#0B0F15] rounded-full p-1 z-20">
                <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-[#0B0F15] text-xs font-black px-2 py-1 rounded-full border border-[#0B0F15]">
                  +500 <Sprout className="inline h-[1.2em] w-[1.2em] align-text-bottom text-lime-400" />
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-black text-center mb-3">
              Votre profil est prêt !
            </h2>
            <p className="text-white/60 text-center mb-10 text-sm px-4">
              Créez votre compte gratuit pour sauvegarder vos{" "}
              <strong className="text-emerald-400">500 Graines</strong> et
              rejoindre votre faction.
            </p>

            <div className="w-full space-y-3">
              <button className="w-full bg-white text-black py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/90 active:scale-95 transition-all">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-apple"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" /><path d="M10 2c1 .5 2 2 2 5" /></svg>
                Continuer avec Apple
              </button>
              <button className="w-full bg-[#4285F4] text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#4285F4]/90 active:scale-95 transition-all">
                <div className="w-[18px] h-[18px] bg-white rounded-full flex items-center justify-center text-[#4285F4] font-black text-[10px]">
                  G
                </div>
                Continuer avec Google
              </button>
              <div className="flex items-center gap-4 my-4 opacity-30">
                <div className="h-px bg-white flex-1"></div>
                <span className="text-xs font-medium uppercase tracking-wider">
                  OU
                </span>
                <div className="h-px bg-white flex-1"></div>
              </div>
              <button className="w-full bg-white/5 border border-white/10 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 active:scale-95 transition-all">
                <Mail size={18} />
                Créer un compte avec Email
              </button>
            </div>

            <p className="text-[10px] text-white/30 text-center mt-6 px-8">
              En continuant, vous acceptez nos Conditions d'utilisation et
              notre Politique de confidentialité.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
