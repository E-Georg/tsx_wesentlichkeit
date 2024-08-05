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
    $clientId = isset($data['clientId']) ? $data['clientId'] : null;


    if ($answererdAverageValues != null || $answererdAverageValues == true) {
        // Select all function to one groupId ==> values from there subGroup && clientId && Stakeholder
        // Call function which calculate average of all 

        // gives just the group average
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

        // gives  the group average and the subgroup Average too
        // $query = "SELECT 
        //             g.id as groupId,
        //             sg.id as subGroupId,
        //             AVG(a.answer) as subgroupAverage,

        //             (SELECT AVG(a2.answer)
        //             st.id
        //             FROM wa_clientGroups g2
        //             JOIN wa_clientSubGroups sg2 ON g2.id = sg2.groupId
        //             JOIN wa_clientSubStakeholderAnswers a2 ON sg2.id = a2.clientSubGroupsId
        //             JOIN wa_subStakeholder  ssh ON a2.subStakeholderId = ssh.id
        //             JOIN wa_clientStakeholders st ON ssh.stakeholderId = st.id
        //             WHERE g2.id = g.id AND g2.active = 1 AND sg2.active = 1
        //             ) as groupAverage

        //         FROM
        //             wa_clientGroups g
        //         JOIN 
        //             wa_clientSubGroups sg ON g.id = sg.groupId
        //         JOIN 
        //             wa_clientSubStakeholderAnswers a ON sg.id = a.clientSubGroupsId
        //         WHERE
        //             g.active = 1 
        //             AND sg.active = 1
        //             AND g.clientId = :clientId 
        //         GROUP BY 
        //             g.id, sg.id
        //         ORDER BY 
        //             g.id ASC;
        //         ";

        $query = "SELECT 
        g.id as groupId,
        sg.id as subGroupId,
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
                stt.id = st.id  -- Matching the current stakeholderId
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







        // {
        //     GroupId:
        //     GroupAverage:
        //     GroupAverageTotal: Vorhanden
        //     SubGroups:[
        //         {
        //             SubGroupId:
        //             SubGroupAverageTotal: Vorhanden
        //             StakeholderId: (Value hat Connection zu SubStakeholder)
        //             subGroupAverage:
        //         }
        //     ]
        // }

        $cols = array('clientId' => $clientId);
        $results = dbSelect($db, $query, $cols);

        //echo json_encode($results);
        $data = [];

        foreach ($results as $row) {
            $groupId = $row['groupId'];
            $stakeholderId = $row['stakeholderId'];
            $subGroupId = $row['subGroupId'];

            // Initialize group if not set
            if (!isset($data[$groupId])) {
                $data[$groupId] = [
                    'groupId' => $groupId,
                    'groupAverageTotal' => $row['groupAverageTotal'],
                    'value' => [],
                    'subGroups' => []
                ];
            }

            // Add stakeholder data
            if (!isset($data[$groupId]['value'][$stakeholderId])) {
                $data[$groupId]['value'][$stakeholderId] = [
                    'stakeholderId' => $stakeholderId,
                    'groupAverage' => $row['groupAverage']
                ];
            }

            // Add subGroup data
            $data[$groupId]['subGroups'][] = [
                'subGroupId' => $subGroupId,
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



    echo json_encode($lastIdAnswers);
    echo json_encode($lastIdComments);
} else {
    http_response_code(405);
    $jsonArray = ['error' => 'Method not allowed'];
}

echo json_encode($jsonArray);
