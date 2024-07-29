<?php

/**********************************************************
 * API "clientShakeholders"
 * 
 *  in:     clientId, groupId
 * 
 *  27.06.2024  JM
 * 
 */
$notLog = 1;

include('inc/include.php');
require_once __DIR__ . '/../inc/all.php';


header('Content-Type: application/json');
$jsonArray = array();





if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $jsonData = isset($_GET['data']) ? $_GET['data'] : null;
    $data = json_decode($jsonData, true);

    $clientId = isset($data['clientId']) ? $data['clientId'] : null;

    $cols = array('clientId' => $clientId);
    $query = 'SELECT * FROM `wa_clientGroups` WHERE active = 1 AND clientId = :clientId order by sort ASC';
    $clientGroups = dbSelect($db, $query, $cols);

    if (count($clientGroups) > 0) {
        $jsonArray = array();
        $pointer = 0;
        foreach ($clientGroups as $clientGroup) {

            $cols = array('clientId' => $clientId);
            $query = 'SELECT * FROM `wa_clientStakeholders` WHERE active = 1 AND clientId = :clientId order by sort asc';
            $clientStakeholders = dbSelect($db, $query, $cols);

            foreach ($clientStakeholders as $clientStakeholder) {

                $cols = array('clientId' => $clientId);
                $cols['clientGroupId'] = $clientGroup['id'];
                $cols['clientStakeholderId'] = $clientStakeholder['id'];

                $query = 'SELECT * FROM `wa_clientStakeholderSignificance` WHERE active = 1 AND clientId = :clientId AND clientgroupId = :clientGroupId AND clientStakeholderId = :clientStakeholderId';
                $clientStakeholderSignificance = dbSelect($db, $query, $cols);

                if (count($clientStakeholderSignificance) > 0) {
                    foreach ($clientStakeholderSignificance as $clientStakeholderSignificanceItem) {
                        $jsonArray[$pointer]['clientSubGroupId'] = $clientStakeholderSignificanceItem['id'];
                        $jsonArray[$pointer]['clientGroupId'] = $clientGroup['id'];
                        $jsonArray[$pointer]['clientStakeholderId'] = $clientStakeholder['id'];
                        $jsonArray[$pointer]['id'] = $clientStakeholderSignificanceItem['id'];

                        $cols = array('clientStakeholderSignificanceId' => $clientStakeholderSignificanceItem['id']);
                        $query = 'SELECT * FROM `wa_clientStakeholderSignificanceText` WHERE active = 1 AND clientStakeholderSignificanceId = :clientStakeholderSignificanceId';
                        $clientStakeholderSignificanceText = dbSelect($db, $query, $cols);

                        $messages = []; // Temporäres Array für Nachrichten
                        foreach ($clientStakeholderSignificanceText as $client) {
                            $messages[] = [
                                'id' => $client['id'],
                                'text' => $client['text'],
                                'subStakeholderId' => $client['subStakeholderId'],
                                'editDate' => $client['editDate']
                            ];
                        }
                        $jsonArray[$pointer]["message"] = $messages; // Zuweisen des temporären Arrays zum Hauptarray
                        $pointer++;
                    }
                }
            }
        }
    }


    echo json_encode($jsonArray);
}
