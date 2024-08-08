<?php

namespace App\Http\Controllers;

use App\Models\ClientGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClientGroupController extends Controller
{
    public function index(Request $request)
    {
        $clientId = $request->input('clientId');
        $clientGroups = ClientGroup::where('active', 1)
            ->where('clientId', $clientId)
            ->orderBy('sort', 'ASC')
            ->get();

        if ($clientGroups->isEmpty()) {
            return response()->json([
                'errorNo' => 1,
                'errorMessage' => 'nicht gefunden'
            ]);
        }

        return response()->json($clientGroups);
    }

    /**
     * Handle the POST request to retrieve client groups.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getClientGroups(Request $request)
    {
        $clientId = $request->input('clientId');

        if (!$clientId) {
            return response()->json([
                'errorNo' => 3,
                'errorMessage' => 'clientId is required'
            ], 400);
        }

        $clientGroups = ClientGroup::where('active', 1)
            ->where('clientId', $clientId)
            ->orderBy('sort', 'ASC')
            ->get(['id', 'title', 'description']);

        if ($clientGroups->isEmpty()) {
            return response()->json([
                'errorNo' => 1,
                'errorMessage' => "nicht gefunden"
            ], 404);
        }

        return response()->json($clientGroups, 200);
    }

    public function store(Request $request)
    {
        $clientId = $request->input('clientId');
        $title = $request->input('title');
        $description = $request->input('description');

        $lastSort = ClientGroup::where('active', 1)
            ->where('client_id', $clientId)
            ->orderBy('sort', 'DESC')
            ->value('sort');

        $clientGroup = new ClientGroup();
        $clientGroup->client_id = $clientId;
        $clientGroup->title = $title;
        $clientGroup->description = $description;
        $clientGroup->relevance = null;
        $clientGroup->sort = ($lastSort ?? 0) + 10;
        $clientGroup->active = 1;
        $clientGroup->save();

        return response()->json([
            'lastId' => $clientGroup->id
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $clientGroup = ClientGroup::find($id);

        if ($clientGroup && $clientGroup->active) {
            $clientGroup->active = 0;
            $clientGroup->save();
            return response()->json([
                'return' => 1
            ]);
        }

        return response()->json([
            'return' => 0
        ]);
    }

    public function update(Request $request, $id)
    {
        $clientGroup = ClientGroup::find($id);

        if ($clientGroup && $clientGroup->active) {
            $clientGroup->client_id = $request->input('clientId');
            $clientGroup->title = $request->input('title');
            $clientGroup->description = $request->input('description');
            $clientGroup->save();

            return response()->json([
                'return' => 1
            ]);
        }

        return response()->json([
            'return' => 0
        ]);
    }

    public function updateRelevance(Request $request)
    {
        $clientGroupId = $request->input('clientGroupId');
        $clientSubGroupId = $request->input('clientSubGroupId');
        $clientId = $request->input('clientId');
        $relevance = $request->input('relevance');

        if ($clientGroupId === null) {
            $clientGroupId = DB::table('client_sub_groups')
                ->join('client_groups', 'client_sub_groups.group_id', '=', 'client_groups.id')
                ->where('client_sub_groups.id', $clientSubGroupId)
                ->where('client_groups.active', 1)
                ->value('client_groups.id');
        }

        $clientGroup = ClientGroup::find($clientGroupId);

        if ($clientGroup && $clientGroup->active) {
            $clientGroup->relevance = $relevance;
            $clientGroup->save();

            return response()->json([
                'return' => 1
            ]);
        }

        return response()->json([
            'return' => 0
        ]);
    }
}
