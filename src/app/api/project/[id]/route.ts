import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // Serializar dados do projeto
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
        id: projeto.cliente.id,
        nomeEmpresa: projeto.cliente.nomeEmpresa,
        nomeContato: projeto.cliente.nomeContato,
        emailContato: projeto.cliente.emailContato,
        telefoneContato: projeto.cliente.telefoneContato,
      },
      requisitosFuncionais: projeto.requisitosFuncionais.map((req) => ({
        id: req.id,
        descricao: req.descricao,
        prioridade: req.prioridade,
      })),
      requisitosNaoFuncionais: projeto.requisitosNaoFuncionais.map((req) => ({
        id: req.id,
        tipo: req.tipo,
        descricao: req.descricao,
      })),
    };

    return NextResponse.json(projectData);

  } catch (error) {
    console.error('Erro ao buscar projeto:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor',
    }, { status: 500 });
  }
}

