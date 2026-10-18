<?php

namespace App\Http\Controllers;

use App\Models\Tarefa;
use App\Http\Requests\StoreTarefaRequest;
use App\Http\Requests\UpdateTarefaRequest;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\JsonResponse;

class TarefaController extends Controller
{
    protected Tarefa $tarefa;

    public function __construct(Tarefa $tarefa) {
        $this->tarefa = $tarefa;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $tarefas = Tarefa::all();
        return response()->json($tarefas, Response::HTTP_OK);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTarefaRequest $request): JsonResponse
    {
        $idMembro = $request->input('idMembro_alocado');
        $idProjeto = $request->input('idProjeto_vinculado');

        $numeroProjetos = Tarefa::where('idMembro_alocado', $idMembro) // procura tarefas associadas ao membro
                                ->where('idProjeto_vinculado', '!=', $idProjeto) // procura projetos diferentes
                                ->distinct('idProjeto_vinculado') // ignora duplicatas
                                ->count('idProjeto_vinculado'); // conta todos os projetos que o membro está

        if ($numeroProjetos >= 2) {
            return response()->json(['message' => 'Um membro não pode participar de mais de dois projetos.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $tarefa = Tarefa::create($request->validated());
        return response()->json($tarefa, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(String $id): JsonResponse
    {
        $tarefa = Tarefa::findOrFail($id);
        return response()->json($tarefa, Response::HTTP_OK);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tarefa $tarefa)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTarefaRequest $request, String $id): JsonResponse
    {
        $tarefa = Tarefa::findOrFail($id);
        $validados = $request->validated();

        $idMembro = $validados['idMembro_alocado'];
        $idProjeto = $validados['idProjeto_vinculado'];

        $numeroProjetos = Tarefa::where('idMembro_alocado', $idMembro) // procura tarefas associadas ao membro
                                ->where('id', '!=', $tarefa->id) // ignora a própria tarefa
                                ->where('idProjeto_vinculado', '!=', $idProjeto) // procura projetos diferentes
                                ->distinct('idProjeto_vinculado') // ignora duplicatas
                                ->count('idProjeto_vinculado'); // conta todos os projetos que o membro está

        if ($numeroProjetos >= 2) {
            return response()->json(['message' => 'Um membro não pode participar de mais de dois projetos.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $tarefa->update($request->validated());
        return response()->json($tarefa, Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(String $id): JsonResponse
    {
        $tarefa = Tarefat::findOrFail($id);
        $tarefa->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
