import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Função para analisar complexidade baseada em palavras-chave
function analisarComplexidade(projeto: any) {
  const palavrasChaveComplexas = [
    'inteligencia artificial', 'machine learning', 'blockchain', 'microservicos',
    'real-time', 'tempo real', 'big data', 'analytics', 'dashboard', 'relatorios',
    'integracao', 'api', 'mobile', 'responsivo', 'autenticacao', 'login',
    'pagamento', 'ecommerce', 'chat', 'notificacao', 'push', 'geolocalização'
  ];

  const textoCompleto = `${projeto.descricaoIdeia} ${projeto.problemasResolvidos} ${projeto.publicoAlvo}`.toLowerCase();
  
  const palavrasEncontradas = palavrasChaveComplexas.filter(palavra => 
    textoCompleto.includes(palavra)
  );

  const numRequisitosFuncionais = projeto.requisitosFuncionais?.length || 0;
  const numRequisitosNaoFuncionais = projeto.requisitosNaoFuncionais?.length || 0;

  let score = 0;
  score += palavrasEncontradas.length * 0.5;
  score += numRequisitosFuncionais * 0.3;
  score += numRequisitosNaoFuncionais * 0.2;

  let nivel = 'Baixa';
  if (score >= 3) nivel = 'Alta';
  else if (score >= 1.5) nivel = 'Média-Alta';
  else if (score >= 0.8) nivel = 'Média';

  return {
    nivel,
    score,
    numRequisitosFuncionais,
    numRequisitosNaoFuncionais,
    palavrasChaveEncontradas: palavrasEncontradas
  };
}

// Função para recomendar tecnologias
function recomendarTecnologias(projeto: any, complexidade: any) {
  const textoCompleto = `${projeto.descricaoIdeia} ${projeto.problemasResolvidos}`.toLowerCase();
  
  let tipoProjetoDetectado = 'web_app';
  
  if (textoCompleto.includes('mobile') || textoCompleto.includes('app')) {
    tipoProjetoDetectado = 'mobile_app';
  } else if (textoCompleto.includes('ecommerce') || textoCompleto.includes('loja')) {
    tipoProjetoDetectado = 'ecommerce';
  } else if (textoCompleto.includes('dashboard') || textoCompleto.includes('relatorio')) {
    tipoProjetoDetectado = 'dashboard';
  } else if (textoCompleto.includes('api') || textoCompleto.includes('integracao')) {
    tipoProjetoDetectado = 'api_service';
  }

  const stacksRecomendadas: Record<string, any> = {
    web_app: {
      frontend: ['Next.js', 'React', 'TypeScript'],
      backend: ['Node.js', 'Next.js API Routes', 'Express.js'],
      database: ['PostgreSQL', 'SQL Server', 'MongoDB'],
      cloud: ['Vercel', 'AWS', 'Azure']
    },
    mobile_app: {
      frontend: ['React Native', 'Flutter', 'Ionic'],
      backend: ['Node.js', 'Python Flask', 'Firebase'],
      database: ['Firebase Firestore', 'PostgreSQL', 'MongoDB'],
      cloud: ['Firebase', 'AWS Amplify', 'Azure Mobile']
    },
    ecommerce: {
      frontend: ['Next.js', 'React', 'Vue.js'],
      backend: ['Node.js', 'Shopify API', 'WooCommerce'],
      database: ['PostgreSQL', 'MySQL', 'MongoDB'],
      cloud: ['Vercel', 'Shopify', 'AWS']
    },
    dashboard: {
      frontend: ['Next.js', 'React', 'D3.js'],
      backend: ['Node.js', 'Python', 'Express.js'],
      database: ['PostgreSQL', 'InfluxDB', 'MongoDB'],
      cloud: ['Vercel', 'AWS', 'Google Cloud']
    },
    api_service: {
      frontend: ['Swagger UI', 'Postman', 'GraphQL Playground'],
      backend: ['Node.js', 'Express.js', 'FastAPI'],
      database: ['PostgreSQL', 'Redis', 'MongoDB'],
      cloud: ['AWS Lambda', 'Vercel Functions', 'Azure Functions']
    }
  };

  const tecnologiasEspecificas = [];
  
  if (textoCompleto.includes('autenticacao') || textoCompleto.includes('login')) {
    tecnologiasEspecificas.push('JWT', 'OAuth 2.0', 'Auth0');
  }
  
  if (textoCompleto.includes('pagamento')) {
    tecnologiasEspecificas.push('Stripe', 'PayPal', 'PagSeguro');
  }
  
  if (textoCompleto.includes('chat') || textoCompleto.includes('mensagem')) {
    tecnologiasEspecificas.push('Socket.io', 'WebRTC', 'Firebase Messaging');
  }

  return {
    tipoProjetoDetectado,
    stackRecomendada: stacksRecomendadas[tipoProjetoDetectado],
    tecnologiasEspecificas,
    justificativa: `Baseado na análise dos requisitos, identificamos um projeto do tipo ${tipoProjetoDetectado.replace('_', ' ')}`
  };
}

// Função para estimar horas e custos
function estimarHorasECustos(complexidade: any, tecnologias: any) {
  const multiplicadorComplexidade = {
    'Baixa': 0.8,
    'Média': 1.0,
    'Média-Alta': 1.3,
    'Alta': 1.6
  }[complexidade.nivel] || 1.0;

  const horasBase = {
    requisitosFuncionais: complexidade.numRequisitosFuncionais * 8,
    requisitosNaoFuncionais: complexidade.numRequisitosNaoFuncionais * 4
  };

  const horasTotal = Math.round((horasBase.requisitosFuncionais + horasBase.requisitosNaoFuncionais) * multiplicadorComplexidade);
  
  const horasPorFase = {
    analiseDesign: Math.max(Math.round(horasTotal * 0.15), 2),
    desenvolvimento: Math.max(Math.round(horasTotal * 0.60), 8),
    testes: Math.max(Math.round(horasTotal * 0.15), 2),
    deployConfiguracao: Math.max(Math.round(horasTotal * 0.05), 1),
    documentacao: Math.max(Math.round(horasTotal * 0.05), 1)
  };

  const valorHora = 100; // R$ por hora
  const custoDesenvolvimento = horasTotal * valorHora;
  
  const custosAdicionais = {
    infraestruturaCloud: Math.round(custoDesenvolvimento * 0.05),
    licencasFerramentas: Math.round(custoDesenvolvimento * 0.03),
    contingencia: Math.round(custoDesenvolvimento * 0.15)
  };

  const custoTotal = custoDesenvolvimento + Object.values(custosAdicionais).reduce((a, b) => a + b, 0);

  return {
    estimativaHoras: {
      total: horasTotal,
      porFase: horasPorFase,
      detalhamento: {
        requisitosFuncionais: horasBase.requisitosFuncionais,
        requisitosNaoFuncionais: horasBase.requisitosNaoFuncionais,
        multiplicadorComplexidade
      }
    },
    estimativaCustos: {
      valorHora,
      custoDesenvolvimento,
      custosAdicionais,
      custoTotal,
      faixasPagamento: {
        entrada: Math.round(custoTotal * 0.3),
        desenvolvimento: Math.round(custoTotal * 0.5),
        entrega: Math.round(custoTotal * 0.2)
      }
    }
  };
}

// Função para gerar cronograma
function gerarCronograma(estimativaHoras: any) {
  const horasPorSemana = 40;
  const totalSemanas = Math.ceil(estimativaHoras.total / horasPorSemana);
  
  const fases = {
    analiseDesign: {
      horas: estimativaHoras.porFase.analiseDesign,
      semanas: Math.max(Math.ceil(estimativaHoras.porFase.analiseDesign / horasPorSemana), 1)
    },
    desenvolvimento: {
      horas: estimativaHoras.porFase.desenvolvimento,
      semanas: Math.max(Math.ceil(estimativaHoras.porFase.desenvolvimento / horasPorSemana), 1)
    },
    testes: {
      horas: estimativaHoras.porFase.testes,
      semanas: Math.max(Math.ceil(estimativaHoras.porFase.testes / horasPorSemana), 1)
    },
    deployConfiguracao: {
      horas: estimativaHoras.porFase.deployConfiguracao,
      semanas: Math.max(Math.ceil(estimativaHoras.porFase.deployConfiguracao / horasPorSemana), 1)
    },
    documentacao: {
      horas: estimativaHoras.porFase.documentacao,
      semanas: Math.max(Math.ceil(estimativaHoras.porFase.documentacao / horasPorSemana), 1)
    }
  };

  return {
    totalSemanas,
    totalMeses: Math.ceil(totalSemanas / 4),
    fases,
    observacoes: [
      'Cronograma baseado em 40 horas/semana',
      `Complexidade ${estimativaHoras.detalhamento?.multiplicadorComplexidade > 1 ? 'Alta' : 'Média'} pode afetar o prazo`,
      'Prazos podem variar conforme disponibilidade da equipe'
    ]
  };
}

// Função para identificar riscos
function identificarRiscos(projeto: any, complexidade: any) {
  const riscos = [];
  
  if (!projeto.tecnologiasPreferenciais) {
    riscos.push({
      tipo: 'Tecnologias Indefinidas',
      descricao: 'Falta de definição tecnológica pode causar retrabalho',
      impacto: 'Baixo',
      mitigacao: 'Definir stack tecnológica na fase de análise'
    });
  }
  
  if (complexidade.nivel === 'Alta') {
    riscos.push({
      tipo: 'Complexidade Elevada',
      descricao: 'Projeto com alta complexidade pode exceder estimativas',
      impacto: 'Alto',
      mitigacao: 'Dividir em fases menores e validar constantemente'
    });
  }
  
  if (complexidade.numRequisitosFuncionais > 10) {
    riscos.push({
      tipo: 'Escopo Extenso',
      descricao: 'Muitos requisitos podem impactar qualidade e prazo',
      impacto: 'Médio',
      mitigacao: 'Priorizar requisitos e implementar em sprints'
    });
  }

  return riscos;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projetoId = parseInt(params.id);
    
    if (isNaN(projetoId)) {
      return NextResponse.json({
        success: false,
        message: 'ID do projeto inválido',
      }, { status: 400 });
    }

    const projeto = await prisma.projeto.findUnique({
      where: {
        id: projetoId,
      },
      include: {
        cliente: true,
        requisitosFuncionais: true,
        requisitosNaoFuncionais: true,
      },
    });

    if (!projeto) {
      return NextResponse.json({
        success: false,
        message: 'Projeto não encontrado',
      }, { status: 404 });
    }

    // Análises
    const complexidade = analisarComplexidade(projeto);
    const tecnologias = recomendarTecnologias(projeto, complexidade);
    const { estimativaHoras, estimativaCustos } = estimarHorasECustos(complexidade, tecnologias);
    const cronograma = gerarCronograma(estimativaHoras);
    const riscos = identificarRiscos(projeto, complexidade);

    const estimativaCompleta = {
      projetoId: projeto.id,
      complexidade,
      tecnologiasRecomendadas: {
        tipoProjetoDetectado: tecnologias.tipoProjetoDetectado,
        stackRecomendada: tecnologias.stackRecomendada,
        tecnologiasEspecificas: tecnologias.tecnologiasEspecificas,
        justificativa: tecnologias.justificativa
      },
      estimativaHoras,
      estimativaCustos,
      cronograma,
      riscos,
      recomendacoes: [
        'Documente regras de negócio específicas para evitar ambiguidades',
        'Realize reuniões de acompanhamento semanais durante o desenvolvimento',
        'Mantenha um ambiente de testes atualizado para validações contínuas'
      ]
    };

    return NextResponse.json(estimativaCompleta);

  } catch (error) {
    console.error('Erro ao gerar estimativa:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor',
    }, { status: 500 });
  }
}

