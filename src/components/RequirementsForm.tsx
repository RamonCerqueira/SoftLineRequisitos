'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Send, Building, User, Mail, Phone, Lightbulb, Users, Settings, AlertCircle } from 'lucide-react';

// Schema de validação
const RequisitoFuncionalSchema = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  prioridade: z.enum(['Alta', 'Media', 'Baixa']).default('Media'),
});

const RequisitoNaoFuncionalSchema = z.object({
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
});

const FormSchema = z.object({
  nomeEmpresa: z.string().min(1, 'Nome da empresa é obrigatório'),
  nomeContato: z.string().min(1, 'Nome do contato é obrigatório'),
  emailContato: z.string().email('Email inválido'),
  telefoneContato: z.string().optional(),
  nomeSoftware: z.string().optional(),
  descricaoIdeia: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  problemasResolvidos: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  publicoAlvo: z.string().min(5, 'Público-alvo deve ter pelo menos 5 caracteres'),
  tecnologiasPreferenciais: z.string().optional(),
  observacoesAdicionais: z.string().optional(),
  requisitosFuncionais: z.array(RequisitoFuncionalSchema).min(1, 'Pelo menos um requisito funcional é obrigatório'),
  requisitosNaoFuncionais: z.array(RequisitoNaoFuncionalSchema).optional().default([]),
});

type FormData = z.infer<typeof FormSchema>;

interface RequirementsFormProps {
  onSubmitSuccess?: (projectId: number) => void;
}

export default function RequirementsForm({ onSubmitSuccess }: RequirementsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      requisitosFuncionais: [{ descricao: '', prioridade: 'Media' }],
      requisitosNaoFuncionais: [],
    },
  });

  const {
    fields: requisitosFuncionaisFields,
    append: appendRequisitoFuncional,
    remove: removeRequisitoFuncional,
  } = useFieldArray({
    control,
    name: 'requisitosFuncionais',
  });

  const {
    fields: requisitosNaoFuncionaisFields,
    append: appendRequisitoNaoFuncional,
    remove: removeRequisitoNaoFuncional,
  } = useFieldArray({
    control,
    name: 'requisitosNaoFuncionais',
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/submit-requirements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        onSubmitSuccess?.(result.projeto_id);
      } else {
        setSubmitError(result.message || 'Erro ao enviar requisitos');
      }
    } catch (error) {
      setSubmitError('Erro de conexão. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tiposRequisitosNaoFuncionais = [
    'Performance',
    'Segurança',
    'Usabilidade',
    'Confiabilidade',
    'Escalabilidade',
    'Manutenibilidade',
    'Portabilidade',
    'Compatibilidade',
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gradient mb-2">
          Levantamento de Requisitos
        </h1>
        <p className="text-muted-foreground">
          Preencha as informações abaixo para gerar automaticamente a documentação do seu projeto
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Informações da Empresa */}
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-primary" />
              Informações da Empresa
            </CardTitle>
            <CardDescription>
              Dados da empresa que está solicitando o desenvolvimento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nomeEmpresa" className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Nome da Empresa *
                </Label>
                <Input
                  id="nomeEmpresa"
                  {...register('nomeEmpresa')}
                  placeholder="Ex: Minha Empresa Ltda"
                  className={errors.nomeEmpresa ? 'border-destructive' : ''}
                />
                {errors.nomeEmpresa && (
                  <p className="text-sm text-destructive">{errors.nomeEmpresa.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nomeContato" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nome do Contato *
                </Label>
                <Input
                  id="nomeContato"
                  {...register('nomeContato')}
                  placeholder="Ex: João Silva"
                  className={errors.nomeContato ? 'border-destructive' : ''}
                />
                {errors.nomeContato && (
                  <p className="text-sm text-destructive">{errors.nomeContato.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailContato" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email do Contato *
                </Label>
                <Input
                  id="emailContato"
                  type="email"
                  {...register('emailContato')}
                  placeholder="Ex: joao@minhaempresa.com"
                  className={errors.emailContato ? 'border-destructive' : ''}
                />
                {errors.emailContato && (
                  <p className="text-sm text-destructive">{errors.emailContato.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefoneContato" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Telefone do Contato
                </Label>
                <Input
                  id="telefoneContato"
                  {...register('telefoneContato')}
                  placeholder="Ex: (11) 99999-9999"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações do Projeto */}
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Informações do Projeto
            </CardTitle>
            <CardDescription>
              Descreva sua ideia e os objetivos do software
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nomeSoftware">Nome do Software</Label>
              <Input
                id="nomeSoftware"
                {...register('nomeSoftware')}
                placeholder="Ex: Sistema de Gestão Empresarial"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricaoIdeia">Descrição da Ideia *</Label>
              <Textarea
                id="descricaoIdeia"
                {...register('descricaoIdeia')}
                placeholder="Descreva detalhadamente sua ideia de software..."
                rows={4}
                className={errors.descricaoIdeia ? 'border-destructive' : ''}
              />
              {errors.descricaoIdeia && (
                <p className="text-sm text-destructive">{errors.descricaoIdeia.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="problemasResolvidos">Problemas que o Software Resolverá *</Label>
              <Textarea
                id="problemasResolvidos"
                {...register('problemasResolvidos')}
                placeholder="Quais problemas específicos seu software vai resolver?"
                rows={3}
                className={errors.problemasResolvidos ? 'border-destructive' : ''}
              />
              {errors.problemasResolvidos && (
                <p className="text-sm text-destructive">{errors.problemasResolvidos.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="publicoAlvo" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Público-alvo *
              </Label>
              <Textarea
                id="publicoAlvo"
                {...register('publicoAlvo')}
                placeholder="Quem são os usuários que utilizarão o software?"
                rows={2}
                className={errors.publicoAlvo ? 'border-destructive' : ''}
              />
              {errors.publicoAlvo && (
                <p className="text-sm text-destructive">{errors.publicoAlvo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tecnologiasPreferenciais" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Tecnologias Preferenciais
              </Label>
              <Input
                id="tecnologiasPreferenciais"
                {...register('tecnologiasPreferenciais')}
                placeholder="Ex: React, Node.js, PostgreSQL (opcional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoesAdicionais">Observações Adicionais</Label>
              <Textarea
                id="observacoesAdicionais"
                {...register('observacoesAdicionais')}
                placeholder="Informações extras que considera importantes..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Requisitos Funcionais */}
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Requisitos Funcionais *
            </CardTitle>
            <CardDescription>
              Funcionalidades que o sistema deve ter
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {requisitosFuncionaisFields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg bg-muted/20">
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="space-y-2">
                      <Label>Descrição do Requisito</Label>
                      <Textarea
                        {...register(`requisitosFuncionais.${index}.descricao`)}
                        placeholder="Ex: O sistema deve permitir login de usuários"
                        rows={2}
                        className={errors.requisitosFuncionais?.[index]?.descricao ? 'border-destructive' : ''}
                      />
                      {errors.requisitosFuncionais?.[index]?.descricao && (
                        <p className="text-sm text-destructive">
                          {errors.requisitosFuncionais[index]?.descricao?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Prioridade</Label>
                      <Select
                        value={watch(`requisitosFuncionais.${index}.prioridade`)}
                        onValueChange={(value) => setValue(`requisitosFuncionais.${index}.prioridade`, value as 'Alta' | 'Media' | 'Baixa')}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Alta">
                            <Badge variant="destructive">Alta</Badge>
                          </SelectItem>
                          <SelectItem value="Media">
                            <Badge variant="secondary">Média</Badge>
                          </SelectItem>
                          <SelectItem value="Baixa">
                            <Badge variant="outline">Baixa</Badge>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {requisitosFuncionaisFields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeRequisitoFuncional(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => appendRequisitoFuncional({ descricao: '', prioridade: 'Media' })}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Requisito Funcional
            </Button>

            {errors.requisitosFuncionais && (
              <p className="text-sm text-destructive">{errors.requisitosFuncionais.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Requisitos Não Funcionais */}
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-secondary" />
              Requisitos Não Funcionais
            </CardTitle>
            <CardDescription>
              Características de qualidade do sistema (opcional)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {requisitosNaoFuncionaisFields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg bg-muted/20">
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <Select
                        value={watch(`requisitosNaoFuncionais.${index}.tipo`)}
                        onValueChange={(value) => setValue(`requisitosNaoFuncionais.${index}.tipo`, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {tiposRequisitosNaoFuncionais.map((tipo) => (
                            <SelectItem key={tipo} value={tipo}>
                              {tipo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Descrição</Label>
                      <Textarea
                        {...register(`requisitosNaoFuncionais.${index}.descricao`)}
                        placeholder="Ex: O sistema deve suportar até 1000 usuários simultâneos"
                        rows={2}
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeRequisitoNaoFuncional(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => appendRequisitoNaoFuncional({ tipo: '', descricao: '' })}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Requisito Não Funcional
            </Button>
          </CardContent>
        </Card>

        <Separator />

        {/* Botão de Envio */}
        <div className="flex flex-col items-center space-y-4">
          {submitError && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-center">
              {submitError}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="btn-soft-primary px-8 py-3 text-lg font-semibold hover-lift"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processando...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Enviar Requisitos
              </>
            )}
          </Button>

          <p className="text-sm text-muted-foreground text-center max-w-md">
            Após o envio, você receberá automaticamente a documentação completa, 
            estimativas de custo e cronograma do projeto.
          </p>
        </div>
      </form>
    </div>
  );
}

