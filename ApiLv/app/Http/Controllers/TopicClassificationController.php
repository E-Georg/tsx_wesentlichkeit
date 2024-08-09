<?php

namespace App\Http\Controllers;

use App\Models\ClientTopicClassification;
use Illuminate\Http\Request;

class TopicClassificationController extends Controller
{
    public function index(Request $request)
    {
        $clientId = 2; // Assuming you want to filter by a specific clientId

        $clientTopicClassifications = ClientTopicClassification::with([
            'clientSubGroup', // To get groupId
            'answers.categorizationValues', // To get categorization details
            'stakeholders.stakeholder', // To get stakeholder details
            'answers' // To get answers details
        ])
            ->where('clientId', $clientId)
            ->where('active', 1)
            ->get();

        $result = $clientTopicClassifications->map(function ($classification) {
            return [
                'caseId' => $classification->id,
                'caseTitle' => $classification->specificAmountCase,
                'groupId' => optional($classification->clientSubGroup)->groupId,
                'subGroupId' => $classification->clientSubGroupId,
                'stakeholders' => $classification->stakeholders->map(function ($stakeholder) {
                    return [
                        'stakeholderId' => $stakeholder->stakeholderId,
                        'stakeholderTitle' => optional($stakeholder->stakeholder)->title,
                    ];
                }),
                'Answers' => $classification->answers->map(function ($answer) {
                    return [
                        'answerId' => $answer->id,
                        'answerText' => $answer->topicClassificationCategorizationText,
                        'answerPulldownValue' => $answer->topicClassificationCategorizationValue,
                    ];
                }),
                //         'Questions' => $classification->answers->map(function ($answer) {
                //             return [
                //                 'topicId' => $answer->id,
                //                 'topicTitle' => $answer->topicClassificationCategorizationText, // Adjusted field
                //             ];
                //         }),
                // 'Choices' => $classification->answers->flatMap(function ($answer) {
                //     return $answer->categorizationValues->map(function ($value) {
                //         return [
                //             'choiceId' => $value->id,
                //             'choiceValue' => $value->topicClassificationCategorizationValueId,
                //             'choiceText' => $value->text,
                //             'clientTopicClassificationId' => $value->clientTopicClassificationId,
                //         ];
                //     });
                // })
            ];
        });

        return response()->json($clientTopicClassifications);
        //return response()->json($result);
    }
}
