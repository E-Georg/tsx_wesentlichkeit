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
                g.title as groupTitle,
                sg.id as subGroupId,
                sg.title as subGroupTitle
            
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

    // echo json_encode($clientGroups);


    if (count($clientGroups) > 0) {
        $pointer = 0;
        foreach ($clientGroups as $clientGroup) {
            $jsonArray[$pointer]['groupId'] = $clientGroup['groupId'];
            $jsonArray[$pointer]['groupTitle'] = $clientGroup['groupTitle'];
            $jsonArray[$pointer]['subGroupId'] = $clientGroup['subGroupId'];
            $jsonArray[$pointer]['subGroupTitle'] = $clientGroup['subGroupTitle'];
            $pointer++;
        }
    } else {
        $jsonArray['errorNo'] = 1;
        $jsonArray['errorMessage'] = "nicht gefunden";
    }

    echo json_encode($jsonArray);
}
