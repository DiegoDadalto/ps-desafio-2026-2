import { DashboardContainer } from '@/components/dashboard/dashboard-items'
import { Button } from '@/components/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/dashboard/table'
import { api } from '@/services/api'
import { tarefaType } from '@/types/tarefa'
import { LuInfo, LuPen, LuPlus, LuTrash, LuFilter } from 'react-icons/lu'
import { DialogUpdateTarefa } from './dialog-update-task'
import { DialogTarefaDelete } from './dialog-delete-task'
import { DialogInformationTarefa } from './dialog-information-task'
import { DialogCreateTarefa } from './dialog-create-task'
import { DialogFilterTarefa } from './dialog-filter-task'
import { projetoType } from '@/types/projeto'
import { membroType } from '@/types/member'

export default async function ListTasks() {
  const { response } = await api<tarefaType[]>('GET', '/tarefas')
  const { response: projetos } = await api<projetoType[]>('GET', '/projetos')
  const { response: membros } = await api<membroType[]>('GET', '/membros')
  
  if (!response) {
    return (
      <DashboardContainer className="text-destructive">
        Não foi possível obter as tarefas.
      </DashboardContainer>
    )
  }

  return (
    <>
      <DashboardContainer className="flex h-min space-x-0 gap-x-1 gap-y-2.5 max-sm:flex-col">
        <DialogCreateTarefa projetos={projetos} membros={membros}>
          <Button size="sm">
            <LuPlus />
            Nova tarefa
          </Button>
        </DialogCreateTarefa>
        <DialogFilterTarefa>
          <Button size="sm">
              <LuFilter />
              Filtrar tarefas
          </Button>
        </DialogFilterTarefa>
      </DashboardContainer>
      <DashboardContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Projeto</TableHead>
              <TableHead>Membro</TableHead>
              <TableHead className="hidden md:table-cell">Início</TableHead>
              <TableHead className="hidden md:table-cell">Fim</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {response.map((tarefa: tarefaType) => (
              <TableRow key={tarefa.id}>
                <TableCell>{tarefa.titulo}</TableCell>
                <TableCell>{tarefa.projeto.nome}</TableCell>
                <TableCell>{tarefa.membro?.nome}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {new Date(tarefa.data_inicio).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {new Date(tarefa.data_fim).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}
                </TableCell>
                <TableCell className="block sm:flex justify-end gap-2">
                  <DialogInformationTarefa tarefa={tarefa}>
                    <Button variant="default-inverse" size="icon">
                      <LuInfo />
                    </Button>
                  </DialogInformationTarefa>
                  <DialogUpdateTarefa tarefa={tarefa} projetos={projetos} membros={membros}>
                    <Button variant="secondary-inverse" size="icon">
                      <LuPen />
                    </Button>
                  </DialogUpdateTarefa>
                  <DialogTarefaDelete id={tarefa.id}>
                    <Button variant="destructive-inverse" size="icon">
                      <LuTrash />
                    </Button>
                  </DialogTarefaDelete>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {!response.length && (
            <TableCaption>Nenhum projeto encontrado.</TableCaption>
          )}
        </Table>
      </DashboardContainer>
    </>
  )
}
