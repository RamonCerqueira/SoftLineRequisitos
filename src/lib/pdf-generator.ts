import jsPDF from 'jspdf';

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

export function generateProjectDocumentationPDF(
  projectData: ProjectData,
  estimateData: EstimateData
): Uint8Array {
  const doc = new jsPDF();
  let yPosition = 20;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const lineHeight = 7;

  // Função para adicionar nova página se necessário
  const checkPageBreak = (requiredSpace: number = 20) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = 20;
    }
  };

  // Função para adicionar texto com quebra de linha
  const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    
    const lines = doc.splitTextToSize(text, doc.internal.pageSize.width - 2 * margin);
    
    checkPageBreak(lines.length * lineHeight);
    
    lines.forEach((line: string) => {
      doc.text(line, margin, yPosition);
      yPosition += lineHeight;
    });
    
    yPosition += 3; // Espaço extra após o texto
  };

  // Cabeçalho
  doc.setFillColor(46, 139, 87); // Verde da empresa
  doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('SOFT LINE SISTEMAS', margin, 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Documentação de Requisitos de Software', margin, 27);

  yPosition = 45;
  doc.setTextColor(0, 0, 0);

  // Informações do Cliente
  addText('INFORMAÇÕES DO CLIENTE', 16, true);
  addText(`Empresa: ${projectData.cliente.nomeEmpresa}`);
  addText(`Contato: ${projectData.cliente.nomeContato}`);
  addText(`Email: ${projectData.cliente.emailContato}`);
  if (projectData.cliente.telefoneContato) {
    addText(`Telefone: ${projectData.cliente.telefoneContato}`);
  }
  addText(`Data de Criação: ${new Date(projectData.dataCriacao).toLocaleDateString('pt-BR')}`);

  yPosition += 10;

  // Informações do Projeto
  addText('INFORMAÇÕES DO PROJETO', 16, true);
  if (projectData.nomeSoftware) {
    addText(`Nome do Software: ${projectData.nomeSoftware}`);
  }
  addText(`Descrição da Ideia: ${projectData.descricaoIdeia}`);
  addText(`Problemas que Resolve: ${projectData.problemasResolvidos}`);
  addText(`Público-alvo: ${projectData.publicoAlvo}`);
  
  if (projectData.tecnologiasPreferenciais) {
    addText(`Tecnologias Preferenciais: ${projectData.tecnologiasPreferenciais}`);
  }
  
  if (projectData.observacoesAdicionais) {
    addText(`Observações Adicionais: ${projectData.observacoesAdicionais}`);
  }

  yPosition += 10;

  // Requisitos Funcionais
  addText('REQUISITOS FUNCIONAIS', 16, true);
  projectData.requisitosFuncionais.forEach((req, index) => {
    addText(`${index + 1}. ${req.descricao} (Prioridade: ${req.prioridade})`);
  });

  yPosition += 10;

  // Requisitos Não Funcionais
  if (projectData.requisitosNaoFuncionais.length > 0) {
    addText('REQUISITOS NÃO FUNCIONAIS', 16, true);
    projectData.requisitosNaoFuncionais.forEach((req, index) => {
      addText(`${index + 1}. [${req.tipo}] ${req.descricao}`);
    });
    yPosition += 10;
  }

  // Análise de Complexidade
  addText('ANÁLISE DE COMPLEXIDADE', 16, true);
  addText(`Nível de Complexidade: ${estimateData.complexidade.nivel}`);
  addText(`Score de Complexidade: ${estimateData.complexidade.score.toFixed(2)}`);

  yPosition += 10;

  // Estimativas
  addText('ESTIMATIVAS DO PROJETO', 16, true);
  addText(`Horas Totais Estimadas: ${estimateData.estimativaHoras.total}h`);
  addText(`Valor por Hora: R$ ${estimateData.estimativaCustos.valorHora.toLocaleString('pt-BR')}`);
  addText(`Custo Total: R$ ${estimateData.estimativaCustos.custoTotal.toLocaleString('pt-BR')}`);
  addText(`Prazo Estimado: ${estimateData.cronograma.totalSemanas} semanas (${estimateData.cronograma.totalMeses} meses)`);

  yPosition += 5;
  addText('Forma de Pagamento Sugerida:', 14, true);
  addText(`• Entrada (30%): R$ ${estimateData.estimativaCustos.faixasPagamento.entrada.toLocaleString('pt-BR')}`);
  addText(`• Desenvolvimento (50%): R$ ${estimateData.estimativaCustos.faixasPagamento.desenvolvimento.toLocaleString('pt-BR')}`);
  addText(`• Entrega (20%): R$ ${estimateData.estimativaCustos.faixasPagamento.entrega.toLocaleString('pt-BR')}`);

  yPosition += 10;

  // Tecnologias Recomendadas
  addText('TECNOLOGIAS RECOMENDADAS', 16, true);
  addText(`Tipo de Projeto: ${estimateData.tecnologiasRecomendadas.tipoProjetoDetectado.replace('_', ' ')}`);
  addText(`Justificativa: ${estimateData.tecnologiasRecomendadas.justificativa}`);
  
  yPosition += 5;
  Object.entries(estimateData.tecnologiasRecomendadas.stackRecomendada).forEach(([category, techs]) => {
    addText(`${category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}: ${techs.join(', ')}`);
  });

  yPosition += 10;

  // Riscos Identificados
  if (estimateData.riscos.length > 0) {
    addText('RISCOS IDENTIFICADOS', 16, true);
    estimateData.riscos.forEach((risco, index) => {
      addText(`${index + 1}. ${risco.tipo} (Impacto: ${risco.impacto})`);
      addText(`   Descrição: ${risco.descricao}`);
      addText(`   Mitigação: ${risco.mitigacao}`);
      yPosition += 3;
    });
  }

  // Rodapé
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Soft Line Sistemas - Página ${i} de ${totalPages}`,
      margin,
      pageHeight - 10
    );
    doc.text(
      `Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
      doc.internal.pageSize.width - margin - 80,
      pageHeight - 10
    );
  }

  return doc.output('arraybuffer') as Uint8Array;
}

