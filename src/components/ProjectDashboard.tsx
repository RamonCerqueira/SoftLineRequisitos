'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  FileText, 
  Network, 
  Calculator, 
  Clock, 
  DollarSign, 
  Users, 
  Building, 
  Mail, 
  Phone,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Calendar
} from 'lucide-react';

interface ProjectData {
  id: number;
  nomeSoftware?: string;
  descricaoIdeia: string;
  problemasResolvidos: string;
  publicoAlvo: string;
  tecnologiasPreferenciais?: string;
  observacoesAdicionais?: string;
  dataCriacao: string;
  cliente: {
    nomeEmpresa: string;
    nomeContato: string;
    emailContato: string;
    telefoneContato?: string;
  };
  requisitosFuncionais: Array<{
    descricao: string;
    prioridade: string;
  }>;
  requisitosNaoFuncionais: Array<{
    tipo: string;
    descricao: string;
  }>;
}

interface EstimateData {
  complexidade: {
    nivel: string;
    score: number;
  };
  estimativaHoras: {
    total: number;
    porFase: Record<string, number>;
  };
  estimativaCustos: {
    custoTotal: number;
    valorHora: number;
    faixasPagamento: {
      entrada: number;
      desenvolvimento: number;
      entrega: number;
    };
  };
  cronograma: {
    totalSemanas: number;
    totalMeses: number;
  };
  tecnologiasRecomendadas: {
    tipoProjetoDetectado: string;
    stackRecomendada: Record<string, string[]>;
    justificativa: string;
  };
  riscos: Array<{
    tipo: string;
    descricao: string;
    impacto: string;
    mitigacao: string;
  }>;
}

interface ProjectDashboardProps {
  projectId: number;
  onBack: () => void;
}

export default function ProjectDashboard({ projectId, onBack }: ProjectDashboardProps) {
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [estimateData, setEstimateData] = useState<EstimateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Buscar dados do projeto
        const projectResponse = await fetch(`/api/project/${projectId}`);
        if (!projectResponse.ok) {
          throw new Error('Erro ao buscar dados do projeto');
        }
        const projectResult = await projectResponse.json();
        setProjectData(projectResult);

        // Buscar estimativas
        const estimateResponse = await fetch(`/api/advanced-estimate/${projectId}`);
        if (!estimateResponse.ok) {
          throw new Error('Erro ao buscar estimativas');
        }
        const estimateResult = await estimateResponse.json();
        setEstimateData(estimateResult);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const handleDownload = async (type: 'documentation' | 'class-diagram' | 'architecture-diagram') => {
    try {
      const response = await fetch(`/api/generate-${type}/${projectId}`);
      if (!response.ok) {
        throw new Error(`Erro ao gerar ${type}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      const filename = {
        'documentation': `documentacao_projeto_${projectId}.pdf`,
        'class-diagram': `diagrama_classe_projeto_${projectId}.svg`,
        'architecture-diagram': `diagrama_arquitetura_projeto_${projectId}.svg`
      }[type];
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error(`Erro ao baixar ${type}:`, error);
    }
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'Alta': return 'destructive';
      case 'Media': return 'secondary';
      case 'Baixa': return 'outline';
      default: return 'secondary';
    }
  };

  const getComplexityColor = (nivel: string) => {
    switch (nivel) {
      case 'Alta': return 'text-red-600';
      case 'Média-Alta': return 'text-orange-600';
      case 'Média': return 'text-yellow-600';
      case 'Baixa': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskColor = (impacto: string) => {
    switch (impacto) {
      case 'Alto': return 'destructive';
      case 'Médio': return 'secondary';
      case 'Baixo': return 'outline';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dados do projeto...</p>
        </div>
      </div>
    );
  }

  if (error || !projectData || !estimateData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive mb-4">{error || 'Erro ao carregar dados'}</p>
          <Button onClick={onBack} variant="outline">
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">
            {projectData.nomeSoftware || `Projeto #${projectData.id}`}
          </h1>
          <p className="text-muted-foreground">
            Documentação e análise completa do projeto
          </p>
        </div>
        <Button onClick={onBack} variant="outline">
          Voltar
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Complexidade</p>
                <p className={`text-2xl font-bold ${getComplexityColor(estimateData.complexidade.nivel)}`}>
                  {estimateData.complexidade.nivel}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Horas Estimadas</p>
                <p className="text-2xl font-bold text-primary">
                  {estimateData.estimativaHoras.total}h
                </p>
              </div>
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Custo Total</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {estimateData.estimativaCustos.custoTotal.toLocaleString('pt-BR')}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Prazo</p>
                <p className="text-2xl font-bold text-blue-600">
                  {estimateData.cronograma.totalMeses} meses
                </p>
              </div>
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Downloads */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Downloads
          </CardTitle>
          <CardDescription>
            Baixe a documentação e diagramas do projeto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => handleDownload('documentation')}
              className="btn-soft-primary hover-lift"
            >
              <FileText className="w-4 h-4 mr-2" />
              Documentação PDF
            </Button>
            <Button
              onClick={() => handleDownload('class-diagram')}
              className="btn-soft-secondary hover-lift"
            >
              <Network className="w-4 h-4 mr-2" />
              Diagrama de Classes
            </Button>
            <Button
              onClick={() => handleDownload('architecture-diagram')}
              variant="outline"
              className="hover-lift"
            >
              <Network className="w-4 h-4 mr-2" />
              Diagrama de Arquitetura
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Informações do Cliente */}
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-primary" />
              Informações do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{projectData.cliente.nomeEmpresa}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>{projectData.cliente.nomeContato}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{projectData.cliente.emailContato}</span>
            </div>
            {projectData.cliente.telefoneContato && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{projectData.cliente.telefoneContato}</span>
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              Criado em {new Date(projectData.dataCriacao).toLocaleDateString('pt-BR')}
            </div>
          </CardContent>
        </Card>

        {/* Estimativas Financeiras */}
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Estimativas Financeiras
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Valor por hora:</span>
                <span className="font-medium">R$ {estimateData.estimativaCustos.valorHora}</span>
              </div>
              <div className="flex justify-between">
                <span>Total de horas:</span>
                <span className="font-medium">{estimateData.estimativaHoras.total}h</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Custo Total:</span>
                <span className="text-green-600">
                  R$ {estimateData.estimativaCustos.custoTotal.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Forma de Pagamento Sugerida:</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Entrada (30%):</span>
                  <span>R$ {estimateData.estimativaCustos.faixasPagamento.entrada.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Desenvolvimento (50%):</span>
                  <span>R$ {estimateData.estimativaCustos.faixasPagamento.desenvolvimento.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Entrega (20%):</span>
                  <span>R$ {estimateData.estimativaCustos.faixasPagamento.entrega.toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requisitos Funcionais */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            Requisitos Funcionais ({projectData.requisitosFuncionais.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {projectData.requisitosFuncionais.map((req, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                <span className="text-sm font-medium text-muted-foreground mt-1">
                  {index + 1}.
                </span>
                <div className="flex-1">
                  <p className="text-sm">{req.descricao}</p>
                </div>
                <Badge variant={getPriorityColor(req.prioridade) as any}>
                  {req.prioridade}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Requisitos Não Funcionais */}
      {projectData.requisitosNaoFuncionais.length > 0 && (
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-secondary" />
              Requisitos Não Funcionais ({projectData.requisitosNaoFuncionais.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projectData.requisitosNaoFuncionais.map((req, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                  <span className="text-sm font-medium text-muted-foreground mt-1">
                    {index + 1}.
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{req.tipo}</Badge>
                    </div>
                    <p className="text-sm">{req.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tecnologias Recomendadas */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5 text-primary" />
            Tecnologias Recomendadas
          </CardTitle>
          <CardDescription>
            {estimateData.tecnologiasRecomendadas.justificativa}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(estimateData.tecnologiasRecomendadas.stackRecomendada).map(([category, techs]) => (
              <div key={category} className="space-y-2">
                <h4 className="font-medium capitalize">
                  {category.replace('_', ' ')}:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {techs.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Riscos Identificados */}
      {estimateData.riscos.length > 0 && (
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Riscos Identificados ({estimateData.riscos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {estimateData.riscos.map((risco, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{risco.tipo}</h4>
                    <Badge variant={getRiskColor(risco.impacto) as any}>
                      {risco.impacto}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {risco.descricao}
                  </p>
                  <div className="text-sm">
                    <span className="font-medium">Mitigação: </span>
                    {risco.mitigacao}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

