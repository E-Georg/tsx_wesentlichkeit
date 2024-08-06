<?php

/**********************************************************
 * API "clientSubGroups"
 * 
 *  in:     action:     r ead - i nsert - d elete - e dit
 *              
 * 
 *  27.06.2024  JM
 * 
 */

$notLog = 1;

include('inc/include.php');
require_once __DIR__ . '/../inc/all.php';

$param = json_decode($_REQUEST['param']);


// for JSON DATA
$rawPostData = file_get_contents('php://input');
$data = json_decode($rawPostData, true);

$jsonArray = array();

if (isset($param->action))
    $action = $param->action;
else if (json_last_error() == JSON_ERROR_NONE)
    $action = isset($data['action']) ? $data['action'] : null;
else
    $action = 'r';

switch ($action) {

    case "r":                                                                                                                                       // read
        $clientId = $param->clientId;

        $cols = array('clientId' => $clientId);
        $query = 'SELECT * FROM `wa_clientGroups` WHERE active = 1 AND clientId = :clientId order by sort ASC';
        $clientGroups = dbSelect($db, $query, $cols);


        if (count($clientGroups) > 0) {
            $pointer = 0;
            foreach ($clientGroups as $clientGroup) {
                $jsonArray[$pointer]['id'] = $clientGroup['id'];
                $jsonArray[$pointer]['title'] = $clientGroup['title'];
                $jsonArray[$pointer]['description'] = $clientGroup['description'];
                $pointer++;
            }
        } else {
            $jsonArray['errorNo'] = 1;
            $jsonArray['errorMessage'] = "nicht gefunden";
        }
        break;

    case "i":                                                                                                                                       // insert

        // new, but needed
        $clientId = isset($data['clientId']) ? $data['clientId'] : null;
        $title = isset($data['title']) ? $data['title'] : null;
        $description = isset($data['description']) ? $data['description'] : null;

        $cols = array('clientId' => $clientId);
        $query = 'SELECT id,sort FROM `wa_clientGroups` WHERE active = 1 AND clientId = :clientId order by sort DESC';
        $clientGroups = dbSelect($db, $query, $cols);
        $lastSort = $clientGroups[0]['sort'];

        $cols = array();
        $cols['clientId'] = $clientId;
        $cols['title'] = $title;
        $cols['description'] = $description;
        $cols['relevance'] = null;
        $cols['sort'] = $lastSort + 10;
        $cols['active'] = 1;

        $lastId = dbInsert($db, 'wa_clientGroups', $cols);
        $jsonArray = array();
        $jsonArray['lastId'] = $lastId;
        break;

    case "d":                                                                                                                                         // delete
        $clientGroupId = $param->clientGroupId;

        $cols = array('id' => $clientGroupId);
        $query = 'SELECT id FROM `wa_clientGroups` WHERE active = 1 AND id = :id';
        $clientGroups = dbSelect($db, $query, $cols);

        $jsonArray = array();
        if (count($clientGroups) > 0) {
            $cols = array();
            $cols['active'] = 0;
            dbUpdate($db, 'wa_clientGroups', $clientGroupId, $cols);
            $jsonArray['return'] = 1;
        } else {
            $jsonArray['return'] = 0;
        }
        break;


    case "e":                                                                                                                                         // edit

        // new, but needed
        $clientGroupId =  isset($data['clientGroupId']) ? $data['clientGroupId'] : null;
        $clientId = isset($data['clientId']) ? $data['clientId'] : null;
        $title = isset($data['title']) ? $data['title'] : null;
        $description = isset($data['description']) ? $data['description'] : null;

        // $clientSubGroupId = $param->clientSubGroupId;
        // $clientId = $param->clientId;
        // $groupId = $param->groupId;
        // $title = $param->title;
        // $description = $param->description;

        $cols = array('id' => $clientGroupId);
        $query = 'SELECT id FROM `wa_clientGroups` WHERE active = 1 AND id = :id';
        $clientGroups = dbSelect($db, $query, $cols);

        $jsonArray = array();
        if (count($clientGroups) > 0) {
            $cols = array();
            $cols['clientId'] = $clientId;
            $cols['title'] = $title;
            $cols['description'] = $description;


            $query = 'update `wa_clientGroups` set clientId = :clientId, title = :title, description = :description where id = ' . $clientGroupId;
            dbSelect($db, $query, $cols);

            $jsonArray['return'] = 1;
        } else {
            $jsonArray['return'] = 0;
        }

        break;
    case "er":
        $clientGroupId =  isset($data['clientGroupId']) ? $data['clientGroupId'] : null;
        $clientSubGroupId =  isset($data['clientSubGroupId']) ? $data['clientSubGroupId'] : null;
        $clientId = isset($data['clientId']) ? $data['clientId'] : null;
        $relevance = isset($data['relevance']) ? $data['relevance'] : null;


        if ($clientGroupId == null) {
            $query = 'SELECT
                            g.id AS GroupId
                        FROM wa_clientSubGroups sg
                        JOIN wa_clientGroups g ON sg.groupId = g.id
                        WHERE sg.id = :clientSubGroupId AND g.active = 1
                        GROUP BY g.id;
            ';
            $cols = array('clientSubGroupId' => $clientSubGroupId);
            $results = dbSelect($db, $query, $cols);

            $clientGroupId = $results[0]['GroupId'];
        }
        $cols = array('id' => $clientGroupId);
        $query = 'SELECT id FROM `wa_clientGroups` WHERE active = 1 AND id = :id';
        $clientGroups = dbSelect($db, $query, $cols);

        $jsonArray = array();
        if (count($clientGroups) > 0) {
            $cols = array();
            $cols['relevance'] = $relevance;

            $query = 'update `wa_clientGroups` set relevance = :relevance where id = ' . $clientGroupId;
            dbSelect($db, $query, $cols);

            $jsonArray['return'] = 1;
        } else {
            $jsonArray['return'] = 0;
        }

        break;


    default:
        $jsonArray = array();
        $jsonArray['errorNo'] = 2;
        $jsonArray['errorMessage'] = 'unbekannte Aktion';
}

echo json_encode($jsonArray);
