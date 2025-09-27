'use client';

import { useState } from 'react';
import SplashScreen from '@/components/SplashScreen';
import RequirementsForm from '@/components/RequirementsForm';
import ProjectDashboard from '@/components/ProjectDashboard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type AppState = 'splash' | 'home' | 'form' | 'dashboard';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);

  const handleSplashComplete = () => {
    setAppState('home');
  };

  const handleStartForm = () => {
    setAppState('form');
  };

  const handleFormSuccess = (projectId: number) => {
    setCurrentProjectId(projectId);
    setAppState('dashboard');
  };

  const handleBackToHome = () => {
    setAppState('home');
    setCurrentProjectId(null);
  };

  const handleBackToForm = () => {
    setAppState('form');
  };

  if (appState === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (appState === 'form') {
    return (
      <main className="min-h-screen bg-gradient-soft-light">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              onClick={handleBackToHome} 
              variant="outline" 
              className="hover-lift"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </div>
          <RequirementsForm onSubmitSuccess={handleFormSuccess} />
        </div>
      </main>
    );
  }

  if (appState === 'dashboard' && currentProjectId) {
    return (
      <main className="min-h-screen bg-gradient-soft-light">
        <ProjectDashboard 
          projectId={currentProjectId} 
          onBack={handleBackToHome}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-soft-light">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">
            Soft Line Sistemas
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sistema inteligente de levantamento de requisitos para desenvolvimento de software
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-lg border hover-lift">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Formulário Inteligente</h3>
              <p className="text-muted-foreground">
                Coleta estruturada de requisitos com validação automática
              </p>
            </div>

            <div className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-lg border hover-lift">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Análise Automática</h3>
              <p className="text-muted-foreground">
                Estimativas de tempo, custo e tecnologias recomendadas
              </p>
            </div>

            <div className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-lg border hover-lift">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Documentação Completa</h3>
              <p className="text-muted-foreground">
                PDFs profissionais e diagramas técnicos gerados automaticamente
              </p>
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={handleStartForm}
              className="btn-soft-primary px-8 py-4 rounded-lg text-lg font-semibold hover-lift"
            >
              Iniciar Levantamento de Requisitos
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

