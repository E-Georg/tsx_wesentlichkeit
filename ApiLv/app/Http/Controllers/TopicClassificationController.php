<?php

namespace App\Http\Controllers;

use App\Models\ClientTopicClassification;
use Illuminate\Http\Request;

class TopicClassificationController extends Controller
{
    public function index(Request $request)
    {
        $clientId = 2;

        // Fetching the data with eager loading
        $clientTopicClassifications = ClientTopicClassification::with([
            'categorizations.categorizationValues',
            'stakeholders'
        ])->where('clientId', $clientId)
            ->where('active', 1)
            ->get();

        // Prepare the data to return as JSON
        $response = [];

        foreach ($clientTopicClassifications as $classification) {
            $classificationData = [
                'classificationId' => $classification->id,
                'clientSubGroupId' => $classification->clientSubGroupId,
                'specificAmountCase' => $classification->specificAmountCase,
                'categorizations' => [],
                'stakeholders' => [],
            ];

            // Add categorizations and their values
            foreach ($classification->categorizations as $categorization) {
                $classificationData['categorizations'][] = [
                    'categorizationText' => $categorization->topicClassificationCategorizationText,
                    'categorizationValueTitle' => $categorization->categorizationValues->title ?? null,
                ];
            }

            // Add stakeholders
            foreach ($classification->stakeholders as $stakeholder) {
                $classificationData['stakeholders'][] = [
                    'stakeholderId' => $stakeholder->stakeholderId,
                ];
            }

            $response[] = $classificationData;
        }

        // Return the response as JSON
        return response()->json($response);
    }
}
