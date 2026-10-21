"use client"

import { Button } from '@/components/button'
import { FormFieldsGroup, FormField } from '@/components/dashboard/form'
import { DialogFooter } from '@/components/dialog'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { cn } from '@/lib/utils'
import { tarefaType } from '@/types/tarefa'
import { useFormStatus } from 'react-dom'

interface FormFieldsTarefaProps {
  tarefa?: tarefaType
  readOnly?: boolean
}

export default function FormFieldsTarefa({
  tarefa,
  readOnly,
}: FormFieldsTarefaProps) {
  const { pending } = useFormStatus()

  return (
    <>
      <FormFieldsGroup>
        {tarefa && <Input defaultValue={tarefa.id} type="text" name="id" hidden />}
        {tarefa && <Input defaultValue={tarefa.idMembro_alocado} type="text" name="idMembro_alocado" hidden />}
        {tarefa && <Input defaultValue={tarefa.idProjeto_vinculado} type="text" name="idProjeto_vinculado" hidden />}
        <FormField>
          <Label htmlFor="descricao">Descrição</Label>
          <Input
            name="descricao"
            id="descricao"
            placeholder="Insira a descrição da tarefa"
            defaultValue={tarefa?.descricao}
            disabled={pending}
            readOnly={readOnly}
          />
        </FormField>
        <FormField>
          <Label htmlFor="data_inicio">Data de início</Label>
          <Input
            name="data_inicio"
            id="data_inicio"
            type="date"
            defaultValue={tarefa?.data_inicio}
            disabled={pending}
            readOnly={readOnly}
          />
        </FormField>
        <FormField>
          <Label htmlFor="data_fim">Data de fim</Label>
          <Input
            name="data_fim"
            id="data_fim"
            type="date"
            defaultValue={tarefa?.data_fim}
            disabled={pending}
            readOnly={readOnly}
          />
        </FormField>
      </FormFieldsGroup>
      <DialogFooter className={cn({ hidden: readOnly })}>
        <Button type="submit" pending={pending}>
          Salvar
        </Button>
      </DialogFooter>
    </>
  )
}
