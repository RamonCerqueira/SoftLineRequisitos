import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateProjectDocumentationPDF } from '@/lib/pdf-generator';

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

    // Buscar estimativa (simulando a chamada para a API de estimativa)
    const estimateResponse = await fetch(`${request.nextUrl.origin}/api/advanced-estimate/${projetoId}`);
    
    if (!estimateResponse.ok) {
      return NextResponse.json({
        success: false,
        message: 'Erro ao buscar estimativas do projeto',
      }, { status: 500 });
    }

    const estimateData = await estimateResponse.json();

    // Preparar dados do projeto
    const projectData = {
      id: projeto.id,
      nomeSoftware: projeto.nomeSoftware,
      descricaoIdeia: projeto.descricaoIdeia,
      problemasResolvidos: projeto.problemasResolvidos,
      publicoAlvo: projeto.publicoAlvo,
      tecnologiasPreferenciais: projeto.tecnologiasPreferenciais,
      observacoesAdicionais: projeto.observacoesAdicionais,
      dataCriacao: projeto.dataCriacao.toISOString(),
      cliente: {
        nomeEmpresa: projeto.cliente.nomeEmpresa,
        nomeContato: projeto.cliente.nomeContato,
        emailContato: projeto.cliente.emailContato,
        telefoneContato: projeto.cliente.telefoneContato,
      },
      requisitosFuncionais: projeto.requisitosFuncionais.map((req) => ({
        descricao: req.descricao,
        prioridade: req.prioridade,
      })),
      requisitosNaoFuncionais: projeto.requisitosNaoFuncionais.map((req) => ({
        tipo: req.tipo,
        descricao: req.descricao,
      })),
    };

    // Gerar PDF
    const pdfBuffer = generateProjectDocumentationPDF(projectData, estimateData);

    // Retornar PDF como resposta
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="documentacao_projeto_${projetoId}.pdf"`,
        'Content-Length': pdfBuffer.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error('Erro ao gerar documentação:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor',
    }, { status: 500 });
  }
}

