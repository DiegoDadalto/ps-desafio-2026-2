"use client"

import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/dialog'
import FormFieldsTarefa from './form-fields-task'
import { updateTarefa } from '@/actions/tarefa'
import { filterFormData } from '@/services/filter-form-data'
import { useState } from 'react'
import { useToast } from '@/components/use-toast'
import { tarefaType } from '@/types/tarefa'

interface DialogUpdateTarefaProps {
  tarefa: tarefaType
  children: React.ReactNode
}

export function DialogUpdateTarefa({ tarefa, children }: DialogUpdateTarefaProps) {
  const [open, setOpen] = useState<boolean>()
  const { toast } = useToast()

  const submit = async (form: FormData) => {
    const newForm = await filterFormData(form)
    const { error } = await JSON.parse(await updateTarefa(newForm))

    if (error) {
      toast({ title: 'Não foi possível editar a tarefa!' })
    } else {
      toast({ title: 'Tarefa editada com sucesso!' })
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar tarefa</DialogTitle>
          <DialogDescription>
            Atualize as informações da tarefa abaixo e clique em
            &quot;Salvar&quot; para aplicar as alterações.
          </DialogDescription>
        </DialogHeader>
        <form action={submit}>
          <FormFieldsTarefa tarefa={tarefa} />
        </form>
      </DialogContent>
    </Dialog>
  )
}
