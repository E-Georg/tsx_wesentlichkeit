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
            'clientsubgroup.groups', // To get groupId
            'answers.categorizationvalues.categorizationvalues', // To get categorization details
            'stakeholders.stakeholder', // To get stakeholder details
        ])
            ->where('clientId', $clientId)
            ->where('active', 1)
            ->get();

        $result = $clientTopicClassifications->map(function ($classification) {
            return [
                'caseId' => $classification->id,
                'caseTitle' => $classification->specificAmountCase,
                'groupId' => optional($classification->clientsubgroup)->groupId,
                'subGroupId' => $classification->clientSubGroupId,
                'stakeholders' => $classification->stakeholders->map(function ($stakeholder) {
                    return [
                        'stakeholderId' => $stakeholder->stakeholderId,
                        'stakeholderTitle' => optional($stakeholder->stakeholder)->title,
                    ];
                }),
                'answers' => $classification->answers->map(function ($answer) {
                    return [
                        'answerId' => $answer->id,
                        'caseId' => $answer->clientTopicClassificationId,
                        'questionId' => $answer->topicClassificationCategorizationId,
                        'answerText' => $answer->topicClassificationCategorizationText,
                        'answerPulldownValue' => $answer->topicClassificationCategorizationValue,
                    ];
                }),
                'questionsAndOptions' => $classification->answers->map(function ($answer) {
                    // Check if `categorization_values` is present and is not null
                    if ($answer->categorizationvalues) {
                        return [
                            'question' => [
                                'questionId' => $answer->categorizationvalues->id,
                                'questionTitle' => $answer->categorizationvalues->title,
                            ],
                            'options' => $answer->categorizationvalues->categorizationvalues->map(function ($value) {
                                return [
                                    'pullDownId' => $value->id,
                                    'pullDownOption' => $value->text,
                                ];
                            })->toArray()
                        ];
                    }
                }),
            ];
        });
        //return ($clientTopicClassifications);
        return response()->json($result);
    }


    public function getAnswers(Request $request)
    {
        $clientId = $request->input('clientId');

        $answers = ClientTopicClassification::with(['answers'])
            ->where('clientId', $clientId)
            ->where('active', 1)
            ->get()
            ->map(function ($classification) {
                return $classification->answers->map(function ($answer) {
                    return [
                        'answerId' => $answer->id,
                        'caseId' => $answer->clientTopicClassificationId,
                        'questionId' => $answer->topicClassificationCategorizationId,
                        'answerText' => $answer->topicClassificationCategorizationText,
                        'answerPulldownValue' => $answer->topicClassificationCategorizationValue,
                    ];
                });
            });

        return response()->json($answers);
    }

    public function getQuestionsAndOptions(Request $request)
    {
        $clientId = $request->input('clientId');

        $questionsAndOptions = ClientTopicClassification::with([
            'answers.categorizationvalues.categorizationvalues' // Load related categorization values
        ])
            ->where('clientId', $clientId)
            ->where('active', 1)
            ->get()
            ->map(function ($classification) {
                return $classification->answers->map(function ($answer) {
                    if ($answer->categorizationvalues) {
                        return [
                            'question' => [
                                'questionId' => $answer->categorizationvalues->id,
                                'questionTitle' => $answer->categorizationvalues->title,
                            ],
                            'options' => $answer->categorizationvalues->categorizationvalues->map(function ($value) {
                                return [
                                    'pullDownId' => $value->id,
                                    'pullDownOption' => $value->text,
                                ];
                            })->toArray()
                        ];
                    }
                    return null;
                })->filter(); // Filter out any null results
            });

        return response()->json($questionsAndOptions);
    }

    public function getRestOfData(Request $request)
    {
        $clientId = $request->input('clientId');

        $restOfData = ClientTopicClassification::with([
            'clientsubgroup.groups', // To get groupId
            'stakeholders.stakeholder', // To get stakeholder details
        ])
            ->where('clientId', $clientId)
            ->where('active', 1)
            ->get()
            ->map(function ($classification) {
                return [
                    'caseId' => $classification->id,
                    'caseTitle' => $classification->specificAmountCase,
                    'groupId' => optional($classification->clientsubgroup)->groupId,
                    'subGroupId' => $classification->clientSubGroupId,
                    'stakeholders' => $classification->stakeholders->map(function ($stakeholder) {
                        return [
                            'stakeholderId' => $stakeholder->stakeholderId,
                            'stakeholderTitle' => optional($stakeholder->stakeholder)->title,
                        ];
                    }),
                ];
            });

        return response()->json($restOfData);
    }
}
