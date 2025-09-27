import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Schema de validação usando Zod
const RequisitoFuncionalSchema = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  prioridade: z.enum(['Alta', 'Media', 'Baixa']).default('Media'),
});

const RequisitoNaoFuncionalSchema = z.object({
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
});

const SubmitRequirementsSchema = z.object({
  nomeEmpresa: z.string().min(1, 'Nome da empresa é obrigatório'),
  nomeContato: z.string().min(1, 'Nome do contato é obrigatório'),
  emailContato: z.string().email('Email inválido'),
  telefoneContato: z.string().optional(),
  nomeSoftware: z.string().optional(),
  descricaoIdeia: z.string().min(1, 'Descrição da ideia é obrigatória'),
  problemasResolvidos: z.string().min(1, 'Problemas resolvidos é obrigatório'),
  publicoAlvo: z.string().min(1, 'Público-alvo é obrigatório'),
  tecnologiasPreferenciais: z.string().optional(),
  observacoesAdicionais: z.string().optional(),
  requisitosFuncionais: z.array(RequisitoFuncionalSchema).min(1, 'Pelo menos um requisito funcional é obrigatório'),
  requisitosNaoFuncionais: z.array(RequisitoNaoFuncionalSchema).optional().default([]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar dados de entrada
    const validatedData = SubmitRequirementsSchema.parse(body);
    
    // Criar transação para garantir consistência
    const result = await prisma.$transaction(async (tx) => {
      // Criar ou encontrar cliente
      let cliente = await tx.cliente.findFirst({
        where: {
          emailContato: validatedData.emailContato,
        },
      });

      if (!cliente) {
        cliente = await tx.cliente.create({
          data: {
            nomeEmpresa: validatedData.nomeEmpresa,
            nomeContato: validatedData.nomeContato,
            emailContato: validatedData.emailContato,
            telefoneContato: validatedData.telefoneContato,
          },
        });
      }

      // Criar projeto
      const projeto = await tx.projeto.create({
        data: {
          clienteId: cliente.id,
          nomeSoftware: validatedData.nomeSoftware,
          descricaoIdeia: validatedData.descricaoIdeia,
          problemasResolvidos: validatedData.problemasResolvidos,
          publicoAlvo: validatedData.publicoAlvo,
          tecnologiasPreferenciais: validatedData.tecnologiasPreferenciais,
          observacoesAdicionais: validatedData.observacoesAdicionais,
        },
      });

      // Criar requisitos funcionais
      if (validatedData.requisitosFuncionais.length > 0) {
        await tx.requisitoFuncional.createMany({
          data: validatedData.requisitosFuncionais.map((req) => ({
            projetoId: projeto.id,
            descricao: req.descricao,
            prioridade: req.prioridade,
          })),
        });
      }

      // Criar requisitos não funcionais
      if (validatedData.requisitosNaoFuncionais.length > 0) {
        await tx.requisitoNaoFuncional.createMany({
          data: validatedData.requisitosNaoFuncionais.map((req) => ({
            projetoId: projeto.id,
            tipo: req.tipo,
            descricao: req.descricao,
          })),
        });
      }

      return { projeto, cliente };
    });

    return NextResponse.json({
      success: true,
      message: 'Requisitos enviados com sucesso!',
      projeto_id: result.projeto.id,
      cliente_id: result.cliente.id,
    });

  } catch (error) {
    console.error('Erro ao processar requisitos:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Dados inválidos',
        errors: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor',
    }, { status: 500 });
  }
}

