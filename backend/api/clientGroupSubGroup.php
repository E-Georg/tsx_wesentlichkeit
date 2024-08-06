<?php


include('inc/include.php');
require_once __DIR__ . '/../inc/all.php';

header('Content-Type: application/json');

$jsonArray = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawPostData = file_get_contents("php://input");
    $data = json_decode($rawPostData, true);


    $clientId = isset($data['clientId']) ? $data['clientId'] : null;



    $cols = array('clientId' => $clientId);
    $query = 'SELECT * FROM `wa_clientGroups` WHERE active = 1 AND clientId = :clientId order by sort ASC';

    $query = 'SELECT 
                g.id as groupId,
                g.relevance as groupRelevance,
                g.title as groupTitle,
                sg.id as subGroupId,
                sg.title as subGroupTitle,
                sg.groupId as subGroupGroupId
            FROM
                wa_clientGroups g
            LEFT JOIN
                wa_clientSubGroups sg ON sg.clientId = g.clientId  AND g.id = sg.groupId
            WHERE 
              g.active = 1 AND g.clientId = :clientId
            ORDER BY 
                g.sort ASC, sg.sort ASC
            ';




    $clientGroups = dbSelect($db, $query, $cols);


    $jsonArray = [];

    if (count($clientGroups) > 0) {
        foreach ($clientGroups as $clientGroup) {
            $groupId = $clientGroup['groupId'];

            // Check if the group already exists in the $jsonArray
            if (!isset($jsonArray[$groupId])) {
                // If it doesn't exist, create a new group entry
                $jsonArray[$groupId] = [
                    'groupId' => $clientGroup['groupId'],
                    'groupTitle' => $clientGroup['groupTitle'],
                    'groupRelevance' => $clientGroup['groupRelevance'],
                    'subGroups' => []
                ];
            }

            // Add the subgroup to the corresponding group's 'subGroups' array
            $jsonArray[$groupId]['subGroups'][] = [
                'subGroupId' => $clientGroup['subGroupId'],
                'subGroupTitle' => $clientGroup['subGroupTitle']
            ];
        }

        // Re-index the array by resetting the keys to make it a non-associative array
        $jsonArray = array_values($jsonArray);
    } else {
        $jsonArray['errorNo'] = 1;
        $jsonArray['errorMessage'] = "nicht gefunden";
    }


    echo json_encode($jsonArray);
}
