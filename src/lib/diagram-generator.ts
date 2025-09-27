interface ProjectData {
  id: number;
  nomeSoftware?: string;
  descricaoIdeia: string;
  problemasResolvidos: string;
  publicoAlvo: string;
  requisitosFuncionais: Array<{
    descricao: string;
    prioridade: string;
  }>;
  requisitosNaoFuncionais: Array<{
    tipo: string;
    descricao: string;
  }>;
}

export function generateClassDiagramPlantUML(projectData: ProjectData): string {
  const softwareName = projectData.nomeSoftware || 'Sistema';
  
  // Analisar requisitos para identificar entidades
  const entidades = new Set<string>();
  const relacionamentos = new Map<string, string[]>();
  
  // Palavras-chave que indicam entidades
  const entidadeKeywords = [
    'usuario', 'user', 'cliente', 'produto', 'pedido', 'order', 'conta', 'account',
    'perfil', 'profile', 'categoria', 'item', 'servico', 'service', 'empresa',
    'relatorio', 'report', 'dashboard', 'notificacao', 'notification', 'mensagem',
    'message', 'arquivo', 'file', 'documento', 'document', 'pagamento', 'payment'
  ];
  
  // Analisar requisitos funcionais
  projectData.requisitosFuncionais.forEach(req => {
    const texto = req.descricao.toLowerCase();
    entidadeKeywords.forEach(keyword => {
      if (texto.includes(keyword)) {
        entidades.add(keyword.charAt(0).toUpperCase() + keyword.slice(1));
      }
    });
  });
  
  // Se não encontrou entidades, usar entidades padrão
  if (entidades.size === 0) {
    entidades.add('Usuario');
    entidades.add('Sistema');
    entidades.add('Dados');
  }
  
  // Gerar PlantUML
  let plantUML = '@startuml\n';
  plantUML += `title Diagrama de Classes - ${softwareName}\n\n`;
  
  // Adicionar classes
  entidades.forEach(entidade => {
    plantUML += `class ${entidade} {\n`;
    plantUML += '  -id: Long\n';
    plantUML += '  -dataCriacao: Date\n';
    plantUML += '  -dataAtualizacao: Date\n';
    plantUML += '  +getId(): Long\n';
    plantUML += '  +criar(): void\n';
    plantUML += '  +atualizar(): void\n';
    plantUML += '  +excluir(): void\n';
    plantUML += '}\n\n';
  });
  
  // Adicionar relacionamentos básicos
  const entidadesArray = Array.from(entidades);
  if (entidadesArray.length > 1) {
    for (let i = 0; i < entidadesArray.length - 1; i++) {
      plantUML += `${entidadesArray[i]} --> ${entidadesArray[i + 1]}\n`;
    }
  }
  
  plantUML += '\n@enduml';
  
  return plantUML;
}

export function generateArchitectureDiagramPlantUML(
  projectData: ProjectData,
  tecnologias: any
): string {
  const softwareName = projectData.nomeSoftware || 'Sistema';
  
  let plantUML = '@startuml\n';
  plantUML += `title Diagrama de Arquitetura - ${softwareName}\n\n`;
  plantUML += '!define RECTANGLE class\n\n';
  
  // Camada de Apresentação
  plantUML += 'package "Camada de Apresentação" {\n';
  if (tecnologias.stackRecomendada?.frontend) {
    tecnologias.stackRecomendada.frontend.forEach((tech: string) => {
      plantUML += `  [${tech}]\n`;
    });
  } else {
    plantUML += '  [Frontend]\n';
  }
  plantUML += '}\n\n';
  
  // Camada de Aplicação
  plantUML += 'package "Camada de Aplicação" {\n';
  if (tecnologias.stackRecomendada?.backend) {
    tecnologias.stackRecomendada.backend.forEach((tech: string) => {
      plantUML += `  [${tech}]\n`;
    });
  } else {
    plantUML += '  [Backend]\n';
  }
  plantUML += '}\n\n';
  
  // Camada de Dados
  plantUML += 'package "Camada de Dados" {\n';
  if (tecnologias.stackRecomendada?.database) {
    tecnologias.stackRecomendada.database.forEach((tech: string) => {
      plantUML += `  [${tech}]\n`;
    });
  } else {
    plantUML += '  [Database]\n';
  }
  plantUML += '}\n\n';
  
  // Camada de Infraestrutura
  plantUML += 'package "Infraestrutura" {\n';
  if (tecnologias.stackRecomendada?.cloud) {
    tecnologias.stackRecomendada.cloud.forEach((tech: string) => {
      plantUML += `  [${tech}]\n`;
    });
  } else {
    plantUML += '  [Cloud]\n';
  }
  plantUML += '}\n\n';
  
  // Relacionamentos básicos
  const frontend = tecnologias.stackRecomendada?.frontend?.[0] || 'Frontend';
  const backend = tecnologias.stackRecomendada?.backend?.[0] || 'Backend';
  const database = tecnologias.stackRecomendada?.database?.[0] || 'Database';
  const cloud = tecnologias.stackRecomendada?.cloud?.[0] || 'Cloud';
  
  plantUML += `[${frontend}] --> [${backend}] : HTTP/API\n`;
  plantUML += `[${backend}] --> [${database}] : SQL/NoSQL\n`;
  plantUML += `[${cloud}] --> [${frontend}] : Deploy\n`;
  plantUML += `[${cloud}] --> [${backend}] : Deploy\n`;
  
  plantUML += '\n@enduml';
  
  return plantUML;
}

// Função para converter PlantUML em imagem (simulação)
export async function generateDiagramImage(plantUMLCode: string): Promise<Buffer> {
  // Em um ambiente real, você usaria um serviço como PlantUML Server
  // ou uma biblioteca para renderizar o diagrama
  
  // Por enquanto, retornamos um placeholder
  const placeholderSVG = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0" stroke="#ccc" stroke-width="2"/>
      <text x="200" y="150" text-anchor="middle" font-family="Arial" font-size="16" fill="#333">
        Diagrama Gerado
      </text>
      <text x="200" y="180" text-anchor="middle" font-family="Arial" font-size="12" fill="#666">
        PlantUML Code Ready
      </text>
    </svg>
  `;
  
  return Buffer.from(placeholderSVG, 'utf-8');
}

