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

            if ($clientId) {
                $query = '
                SELECT 
                    g.id as groupId, 
                    sg.id as subGroupId, 
                    sg.title as subGroupTitle, 
                    q.description as questionDescription, 
                    q.Id as questionId
                FROM 
                    wa_clientGroups g
                LEFT JOIN 
                    wa_clientSubGroups sg ON sg.clientId = g.clientId  AND g.id = sg.groupId AND sg.active = 1
                LEFT JOIN 
                    wa_clientQuestions q ON q.clientId = sg.clientId AND q.active = 1  AND q.clientSubgroupId = sg.Id
                WHERE 
                    g.active = 1 AND g.clientId = :clientId
                ORDER BY 
                    g.sort ASC, sg.sort ASC
                ';

                $cols = array('clientId' => $clientId);
                $results = dbSelect($db, $query, $cols);

                // echo json_encode($results);
                $groupMap = [];

                $pointer = 0;
                foreach ($results as $result) {
                    $groupId = $result['groupId'];
                    $subGroupId = $result['subGroupId'];

                    if (!isset($groupMap[$groupId])) {
                        if ($result["questionId"] != null)
                            $groupMap[$pointer] = [
                                'groupId' => $groupId,
                                'subGroupId' => $subGroupId,
                                'subGroupTitle' => $result['subGroupTitle'],
                                'questionDescription' => $result['questionDescription'],
                                'questionId' => $result['questionId'],
                            ];
                    }
                    $pointer = $pointer + 1;
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
} else {
    http_response_code(405);
    $jsonArray = ['error' => 'Method not allowed'];
}

echo json_encode($jsonArray);
