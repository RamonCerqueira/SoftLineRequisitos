import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateClassDiagramPlantUML, generateDiagramImage } from '@/lib/diagram-generator';

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

    // Buscar dados do projeto
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

    // Preparar dados do projeto
    const projectData = {
      id: projeto.id,
      nomeSoftware: projeto.nomeSoftware,
      descricaoIdeia: projeto.descricaoIdeia,
      problemasResolvidos: projeto.problemasResolvidos,
      publicoAlvo: projeto.publicoAlvo,
      requisitosFuncionais: projeto.requisitosFuncionais.map((req) => ({
        descricao: req.descricao,
        prioridade: req.prioridade,
      })),
      requisitosNaoFuncionais: projeto.requisitosNaoFuncionais.map((req) => ({
        tipo: req.tipo,
        descricao: req.descricao,
      })),
    };

    // Gerar código PlantUML
    const plantUMLCode = generateClassDiagramPlantUML(projectData);
    
    // Gerar imagem do diagrama
    const diagramBuffer = await generateDiagramImage(plantUMLCode);

    // Retornar imagem como resposta
    return new NextResponse(diagramBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Content-Disposition': `attachment; filename="diagrama_classe_projeto_${projetoId}.svg"`,
        'Content-Length': diagramBuffer.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error('Erro ao gerar diagrama de classes:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor',
    }, { status: 500 });
  }
}

