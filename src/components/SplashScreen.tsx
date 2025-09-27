'use client';

import { useState, useEffect } from 'react';
import { Code, Zap, Lightbulb, Rocket, Cpu, Database } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const developmentPhrases = [
  {
    text: "Transformando ideias em código...",
    icon: Lightbulb,
    color: "text-yellow-400"
  },
  {
    text: "Construindo soluções inovadoras...",
    icon: Code,
    color: "text-blue-400"
  },
  {
    text: "Otimizando performance e experiência...",
    icon: Zap,
    color: "text-green-400"
  },
  {
    text: "Desenvolvendo arquiteturas escaláveis...",
    icon: Database,
    color: "text-purple-400"
  },
  {
    text: "Implementando tecnologias de ponta...",
    icon: Cpu,
    color: "text-red-400"
  },
  {
    text: "Preparando para o lançamento...",
    icon: Rocket,
    color: "text-orange-400"
  }
];

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = 9000; // 9 segundos
    const phraseDuration = totalDuration / developmentPhrases.length;
    
    // Atualizar progresso
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + (100 / (totalDuration / 100));
      });
    }, 100);

    // Alternar frases
    const phraseInterval = setInterval(() => {
      setCurrentPhraseIndex(prev => {
        if (prev >= developmentPhrases.length - 1) {
          clearInterval(phraseInterval);
          return prev;
        }
        return prev + 1;
      });
    }, phraseDuration);

    // Finalizar splash screen
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete();
      }, 500); // Aguardar animação de saída
    }, totalDuration);

    return () => {
      clearInterval(progressInterval);
      clearInterval(phraseInterval);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const currentPhrase = developmentPhrases[currentPhraseIndex];
  const IconComponent = currentPhrase.icon;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center splash-screen transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Background com efeito de partículas */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 via-blue-600/20 to-gray-600/20 animate-pulse-soft"></div>
        
        {/* Círculos decorativos */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Conteúdo principal */}
      <div className="relative z-10 text-center px-8 max-w-2xl mx-auto">
        {/* Logo da empresa */}
        <div className="mb-12 logo-animation">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 shadow-2xl">
            <Code className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Soft Line Sistemas
          </h1>
          <p className="text-xl text-white/80 font-light">
            Levantamento de Requisitos Inteligente
          </p>
        </div>

        {/* Frase dinâmica */}
        <div className="mb-12 min-h-[120px] flex flex-col items-center justify-center">
          <div className="flex items-center justify-center mb-4">
            <div className={`p-4 bg-white/20 backdrop-blur-sm rounded-full ${currentPhrase.color} animate-pulse-soft`}>
              <IconComponent className="w-8 h-8" />
            </div>
          </div>
          
          <div className="relative">
            <p 
              key={currentPhraseIndex}
              className="text-2xl md:text-3xl font-medium text-white animate-fade-in"
            >
              {currentPhrase.text}
            </p>
            <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-300 ease-out"
                style={{ width: `${((currentPhraseIndex + 1) / developmentPhrases.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/70">Carregando sistema</span>
            <span className="text-sm text-white/70">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-300 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Indicadores de fase */}
        <div className="flex justify-center mt-8 space-x-2">
          {developmentPhrases.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index <= currentPhraseIndex 
                  ? 'bg-white shadow-lg' 
                  : 'bg-white/30'
              }`}
            ></div>
          ))}
        </div>

        {/* Texto de rodapé */}
        <div className="mt-12">
          <p className="text-sm text-white/60">
            Preparando uma experiência excepcional para você
          </p>
        </div>
      </div>
    </div>
  );
}

