<?php
$notLog = 1;
include('inc/include.php');
require_once __DIR__ . '/../inc/all.php';

header('Content-Type: application/json');

$jsonArray = array();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $jsonData = isset($_GET['data']) ? $_GET['data'] : null;

    // Ensure jsonData is not null or empty
    if ($jsonData) {
        $data = json_decode($jsonData, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            $clientId = isset($data['clientId']) ? $data['clientId'] : null;

            // ClientGroups
            // ClientSubGroups
            // ClientSubSubGroups

            if ($clientId) {
                $query = '
                SELECT 
                    g.id as groupId, 
                    sg.id as subGroupId, 
                    sg.title as subGroupTitle, 
                    ss.description as questionDescription, 
                    ss.id as questionId
                FROM 
                    wa_clientGroups g
                LEFT JOIN 
                    wa_clientSubGroups sg ON sg.clientId = g.clientId  AND g.id = sg.groupId AND sg.active = 1
                LEFT JOIN 
                    wa_clientSubSubGroups ss ON ss.clientId = sg.clientId AND ss.subGroupId = sg.Id AND ss.active = 1  
                WHERE 
                    g.active = 1 AND g.clientId = :clientId
                ORDER BY 
                    g.sort ASC, sg.sort ASC
                ';

                $cols = array('clientId' => $clientId);
                $results = dbSelect($db, $query, $cols);

                $groupMap = [];

                foreach ($results as $result) {
                    $groupId = $result['groupId'];
                    $subGroupId = $result['subGroupId'];

                    // Check if the groupId already exists in the groupMap
                    $found = false;
                    foreach ($groupMap as &$group) {
                        if ($group['groupId'] == $groupId && $group['subGroupId'] == $subGroupId) {
                            $found = true;
                            // Add the questionDescription and questionId as an object to the existing array
                            if ($result['questionId'] != null) {
                                $group['questions'] = [
                                    'id' => $result['questionId'],
                                    'value' => $result['questionDescription']
                                ];
                            }
                            break;
                        }
                    }
                    // If not found, create a new entry
                    if (!$found) {
                        $questionsArray = [];
                        if ($result['questionId'] != null) {
                            $questionsArray = [
                                'id' => $result['questionId'],
                                'value' => $result['questionDescription']
                            ];
                        }
                        $groupMap[] = [
                            'groupId' => $groupId,
                            'subGroupId' => $subGroupId,
                            'subGroupTitle' => $result['subGroupTitle'],
                            'questions' => $questionsArray
                        ];
                    }
                }

                $jsonArray = array_values($groupMap);
            } else {
                http_response_code(400);
                $jsonArray = ['error' => 'Missing or invalid clientId'];
            }
        } else {
            http_response_code(400);
            $jsonArray = ['error' => 'Invalid JSON data'];
        }
    } else {
        http_response_code(400);
        $jsonArray = ['error' => 'No data provided'];
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawPostData = file_get_contents("php://input");
    $data = json_decode($rawPostData, true);
    $jsonArray = array();

    $answererdAverageValues = isset($data['answererdAverageValues']) ? $data['answererdAverageValues'] : null;
    $answererdText = isset($data['answererdText']) ? $data['answererdText'] : null;
    $clientId = isset($data['clientId']) ? $data['clientId'] : null;
    $subStakeholder = isset($data['subStakeholder']) ? $data['subStakeholder'] : null;


    if ($answererdAverageValues != null && $answererdAverageValues == true) {
        // {
        //     GroupId:
        //     GroupTitle
        //     GroupRelevance
        //     value:[{
        //              averageValue:
        //               stakeholderId:
        //             }]
        //     GroupAverageTotal: Vorhanden
        //     SubGroups:[
        //         {
        //             SubGroupId:
        //             SubGroupTitle:
        //             StakeholderId: (Value hat Connection zu SubStakeholder)
        //             subGroupAverage:
        //         }
        //     ]
        // }
        $query = "SELECT 
                    g.id as groupId,
                    AVG(a.answer) as answerValue
                FROM
                    wa_clientGroups g, 
                    wa_clientSubGroups sg, 
                    wa_clientSubStakeholderAnswers a
                WHERE
                    g.id = sg.groupId 
                    AND sg.id = a.clientSubGroupsId 
                    AND g.active = 1 
                    AND g.clientId = :clientId
                GROUP BY
                g.id
                ORDER BY 
                    g.sort ASC, sg.sort ASC;
                ";

        $query = "SELECT 
                    g.id as groupId,
                    g.title as groupTitle,
                    g.relevance as groupRelevance,
                    sg.id as subGroupId,
                    sg.title as subGroupTitle,
                    st.id as stakeholderId,
                    AVG(a.answer) as subgroupAverage,
                    (
                        SELECT AVG(a2.answer)
                        FROM wa_clientGroups g2
                        JOIN wa_clientSubGroups sg2 ON g2.id = sg2.groupId
                        JOIN wa_clientSubStakeholderAnswers a2 ON sg2.id = a2.clientSubGroupsId
                        WHERE   
                            g2.id = g.id 
                        AND 
                            g2.active = 1 
                        AND 
                            sg2.active = 1
                    ) as groupAverageTotal,
                    (
                        SELECT AVG(a2.answer)
                        FROM wa_clientGroups g2
                        JOIN wa_clientSubGroups sg2 ON g2.id = sg2.groupId
                        JOIN wa_clientSubStakeholderAnswers a2 ON sg2.id = a2.clientSubGroupsId
                        JOIN wa_subStakeholder sst ON sst.id = a2.subStakeholderId
                        JOIN wa_clientStakeholders stt ON stt.id = sst.stakeholderId
                        WHERE   
                            g2.id = g.id 
                        AND 
                            g2.active = 1 
                        AND 
                            sg2.active = 1
                        AND 
                            stt.id = st.id  
                    ) as groupAverage
                FROM wa_clientGroups g
                JOIN wa_clientSubGroups sg ON g.id = sg.groupId
                JOIN wa_clientSubStakeholderAnswers a ON sg.id = a.clientSubGroupsId
                JOIN wa_subStakeholder sst ON sst.id = a.subStakeholderId
                JOIN wa_clientStakeholders st ON st.id = sst.stakeholderId
                WHERE
                    g.active = 1 
                AND sg.active = 1
                AND g.clientId = :clientId 
                GROUP BY 
                    g.id, sg.id, st.id
                ORDER BY 
                    g.id ASC;
            ";

        $cols = array('clientId' => $clientId);
        $results = dbSelect($db, $query, $cols);

        //echo json_encode($results);
        $data = [];

        foreach ($results as $row) {
            $groupId = $row['groupId'];
            $groupTitle = $row['groupTitle'];
            $groupRelevance = $row['groupRelevance'];
            $stakeholderId = $row['stakeholderId'];
            $subGroupId = $row['subGroupId'];
            $subGroupTitle = $row['subGroupTitle'];

            // Initialize group if not set
            if (!isset($data[$groupId])) {
                $data[$groupId] = [
                    'groupId' => $groupId,
                    'groupTitle' => $groupTitle,
                    'groupRelevance' => $groupRelevance,
                    'groupAverageTotal' => $row['groupAverageTotal'],
                    'value' => [],
                    'subGroups' => []
                ];
            }

            if (!isset($data[$groupId]['value'][$stakeholderId])) {
                $data[$groupId]['value'][$stakeholderId] = [
                    'stakeholderId' => $stakeholderId,
                    'groupAverage' => $row['groupAverage']
                ];
            }

            // Add subGroup data
            $data[$groupId]['subGroups'][] = [
                'subGroupId' => $subGroupId,
                'subGroupTitle' => $subGroupTitle,
                'stakeholderId' => $stakeholderId,
                'subgroupAverage' => $row['subgroupAverage']
            ];
        }

        // Reindex 'value' array to be numerically indexed
        foreach ($data as &$group) {
            $group['value'] = array_values($group['value']);
        }

        // Convert to JSON
        $json = json_encode(array_values($data), JSON_PRETTY_PRINT);


        echo $json;
        return;
    } else if ($answererdText != null && $answererdText == true) {
        // {
        //     groupId:
        //     Messages:[
        //         {
        //             SubstakeholderId:
        //             SubStakeholderName:
        //             text: 
        //         }
        //     ]
        // }



        $query = "SELECT
                        g.id AS groupId,
                        sst.stakeholderId AS stakeholderId,
                        sst.id AS subStakeholderId,
                        sst.name AS subStakeholderName,
                        a.comment AS answeredText
                    FROM
                        wa_clientSubStakeholderAnswersComments a
                    JOIN
                        wa_subStakeholder sst ON a.subStakeholderId = sst.id
                    JOIN
                        wa_clientGroups g ON a.clientGroupId = g.id
                    WHERE
                        sst.responded = 1
                        AND sst.active = 1
                        AND g.active = 1
                        AND g.clientId = :clientId
                    GROUP BY
                        g.id, sst.stakeholderId, sst.id;
        ";


        $cols = array('clientId' => $clientId);
        $results = dbSelect($db, $query, $cols);

        //echo json_encode($results);

        $processedData = [];

        foreach ($results as $row) {
            $groupId = $row['groupId'];
            $subStakeholderId = $row['subStakeholderId'];
            $subStakeholderName = $row['subStakeholderName'];
            $answeredText = $row['answeredText'];

            if (!isset($processedData[$groupId])) {
                $processedData[$groupId] = [
                    'groupId' => $groupId,
                    'Messages' => []
                ];
            }

            $processedData[$groupId]['Messages'][] = [
                'SubstakeholderId' => $subStakeholderId,
                'SubStakeholderName' => $subStakeholderName,
                'text' => $answeredText
            ];
        }

        $finalResult = array_values($processedData);

        echo json_encode($finalResult);
        return;
    } else if ($subStakeholder != null && $subStakeholder == true) {
        // GroupId:                                 wa_clientSubGroups
        // SubGroupId :                             wa_clientSubStakeholderAnswers ===> wa_clientSubGroups : GroupId
        // StakeholderId:                           wa_subStakeholder              ===> responded
        // SubStakeholderId:                        wa_clientSubStakeholderAnswers
        // SubStakeholderName:                      wa_subStakeholder
        // AverageValue: (for this cell)            wa_clientSubStakeholderAnswers



        // {
        // subtakeholderId:
        // substakeholderName:
        // stakeholderId
        // AverageValusGroup:[
        //     {
        //         groupId:
        //         AverageValue:
        //     }
        // ]
        // AverageValueSubGroups:[
        //     {
        //         subGroupId:
        //         AverageValueSubGroup:
        //     }
        // ]
        // }

        $query = "SELECT
                        sg.groupId AS groupId,
                        sg.id AS subGroupId,
                        sst.stakeholderId AS stakeholderId,
                        sst.id AS subStakeholderId,
                        sst.name AS subStakeholderName,
                        AVG(a.answer) AS AverageValue
                    FROM
                        wa_clientSubStakeholderAnswers a
                    JOIN
                        wa_subStakeholder sst ON a.subStakeholderId = sst.id
                    JOIN
                        wa_clientSubGroups sg ON a.clientSubGroupsId = sg.id
                    WHERE
                        sst.responded = 1
                        AND sst.active = 1
                        AND sg.active = 1
                        AND sg.clientId = :clientId
                    GROUP BY
                        sg.groupId, sg.id, sst.stakeholderId, sst.id;
        ";


        $cols = array('clientId' => $clientId);
        $results = dbSelect($db, $query, $cols);

        //echo json_encode($results);

        $processedData = [];

        foreach ($results as $row) {
            $subStakeholderId = $row['subStakeholderId'];
            $subStakeholderName = $row['subStakeholderName'];
            $stakeholderId = $row['stakeholderId'];
            $groupId = $row['groupId'];
            $subGroupId = $row['subGroupId'];
            $averageValue = $row['AverageValue'];

            if (!isset($processedData[$subStakeholderId])) {
                $processedData[$subStakeholderId] = [
                    'subStakeholderId' => $subStakeholderId,
                    'subStakeholderName' => $subStakeholderName,
                    'stakeholderId' => $stakeholderId,
                    'AverageValusGroup' => [],
                    'AverageValueSubGroups' => []
                ];
            }

            $processedData[$subStakeholderId]['AverageValusGroup'][] = [
                'groupId' => $groupId,
                'AverageValue' => $averageValue
            ];

            $processedData[$subStakeholderId]['AverageValueSubGroups'][] = [
                'subGroupId' => $subGroupId,
                'AverageValueSubGroup' => $averageValue
            ];
        }

        $finalResult = array_values($processedData);
        echo json_encode($finalResult);
        return;
    }



    $subGroupId = isset($data['subGroupId']) ? $data['subGroupId'] : null;
    $groupId = isset($data['groupId']) ? $data['groupId'] : null;
    $subStakeholderID = isset($data['subStakeholderID']) ? $data['subStakeholderID'] : null;;
    $messages = isset($data['message']) ? $data['message'] : null;
    $comments = isset($data['comment']) ? $data['comment'] : null;
    echo json_encode($data);

    // if values on this id exist, remove the first. => but better to block the link after first submit
    foreach ($messages as $message) {
        $cols = [
            'subStakeholderID' => $subStakeholderID,
            'clientSubGroupsId' => $message['subGroupId'],
            'answer' => $message['answer'],
            'active' => 1,
            'editDate' => date("Y-m-d H:i:s")
        ];
        $lastIdAnswers = dbInsert($db, 'wa_clientSubStakeholderAnswers', $cols);
    }

    foreach ($comments as $comment) {
        $colsN = [
            'subStakeholderID' => $subStakeholderID,
            'clientGroupId' => $comment['groupId'],
            'comment' => $comment['text'],
            'clientId' => $clientId,
            'active' => 1,
            'editDate' => date("Y-m-d H:i:s")
        ];
        $lastIdComments = dbInsert($db, 'wa_clientSubStakeholderAnswersComments', $colsN);
    }

    if ($lastIdAnswers != false && $lastIdComments != false) {
        $responded = 1;
        // "UPDATE `wa_subStakeholder` SET `responded` = :responded WHERE `id` = :subStakeholderId";
        $cols = array('responded' => $responded);
        dbUpdate($db, 'wa_subStakeholder', $subStakeholderID, $cols);
        echo "Record updated successfully!";
    }

    echo json_encode($lastIdAnswers);
    echo json_encode($lastIdComments);
} else {
    http_response_code(405);
    $jsonArray = ['error' => 'Method not allowed'];
}

echo json_encode($jsonArray);
