'use client'

import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/dialog'
import FormFieldsTarefa from './form-fields-task'
import { createTarefa } from '@/actions/tarefa'
import { filterFormData } from '@/services/filter-form-data'
import { useEffect, useState } from 'react'
import { useToast } from '@/components/use-toast'

interface DialogFilterTarefaProps {
  children: React.ReactNode
}

export function DialogFilterTarefa({ children }: DialogFilterTarefaProps) {
  const [open, setOpen] = useState<boolean>()
  const { toast } = useToast()

  const submit = async (form: FormData) => {
    const newForm = await filterFormData(form)
    const { error } = await JSON.parse(await createTarefa(newForm))

    if (error) {
      toast({ title: 'Não foi possível criar a tarea!' })
    } else {
      toast({ title: 'Tarefa criada com sucesso!' })
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filtrar tarefa</DialogTitle>
          <DialogDescription>
            Escolha o método de filtragem de tarefas
          </DialogDescription>
        </DialogHeader>
        <form action={submit}>
          <FormFieldsTarefa />
        </form>
      </DialogContent>
    </Dialog>
  )
}
