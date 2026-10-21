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
import { tarefaType } from '@/types/tarefa'
import { useState } from 'react'

interface DialogInformationTarefaProps {
  tarefa: tarefaType
  children: React.ReactNode
}

export function DialogInformationTarefa({
  tarefa,
  children,
}: DialogInformationTarefaProps) {
  const [open, setOpen] = useState<boolean>()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Informações do projeto</DialogTitle>
          <DialogDescription>
            Visualize as informações detalhadas do projeto abaixo.
          </DialogDescription>
        </DialogHeader>
        <FormFieldsTarefa tarefa={tarefa} readOnly />
      </DialogContent>
    </Dialog>
  )
}
