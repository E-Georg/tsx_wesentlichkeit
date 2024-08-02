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


    $clientId = isset($data['clientId']) ? $data['clientId'] : null;
    $subStakeholderID = isset($data['subStakeholderID']) ? $data['subStakeholderID'] : null;;
    // $subGroupId = isset($data['subGroupId']) ? $data['subGroupId'] : null;
    $groupId = isset($data['groupId']) ? $data['groupId'] : null;
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
