<?php

/**********************************************************
 * API "clientStakeholderSignificance"
 * 
 *  in:     action:     r ead - i nsert - d elete - e dit
 *              
 * 
 *  03.07.2024  JM
 * 
*/

$notLog = 1;

include( 'inc/include.php' );
require_once __DIR__ . '/../inc/all.php';

$param = json_decode( $_REQUEST[ 'param' ] );

$jsonArray = array();

if( isset( $param->action ) )
    $action = $param->action;
else
    $action = 'r';

$notLog = 1;

include( 'inc/include.php' );
require_once __DIR__ . '/../inc/all.php';

// Read raw POST data
$input = file_get_contents('php://input');
$param = json_decode($input);

$jsonArray = array();

if (!isset($param->action)) {
    $jsonArray['errorNo'] = 2;
    $jsonArray['errorMessage'] = 'unbekannte Aktion';
    echo json_encode($jsonArray);
    exit;
}

$action = $param->action;



switch ( $action ) {

    // case "r":                                                                                                                                       // read
    //     $clientId = $param->clientId;
    //     $clientSubGroupId = $param->clientSubGroupId;
    //     $clientStakeholderId = $param->clientStakeholderId;

    //     $cols = array('clientId' => $clientId);
    //     $cols['clientSubGroupId'] = $clientSubGroupId;
    //     $cols['clientStakeholderId'] = $clientStakeholderId;

    //     $query = 'SELECT * FROM `wa_clientStakeholderSignificance` WHERE active = 1 AND clientId = :clientId AND clientSubgroupId = :clientSubGroupId AND clientStakeholderId = :clientStakeholderId';
    //     $clientStakeholderSignificance = dbSelect($db, $query, $cols);

    //     if (count($clientStakeholderSignificance) == 1) {
    //         $jsonArray = array();
    //         $jsonArray[ 'clientSubGroupId' ] = $clientSubGroupId;
    //         $jsonArray[ 'clientStakeholderId' ] = $clientStakeholderId;
    //         $jsonArray[ 'id' ] = $clientStakeholderSignificance[ 0 ][ 'id' ];

    //         $cols = array('clientStakeholderSignificanceId' => $clientStakeholderSignificance[ 0 ][ 'id' ] );
    //         $query = 'SELECT * FROM `wa_clientStakeholderSignificanceText` WHERE active = 1 AND clientStakeholderSignificanceId = :clientStakeholderSignificanceId';
    //         $clientStakeholderSignificanceText = dbSelect($db, $query, $cols);

    //         $jsonArray[ "message" ][ 'title' ] = $clientStakeholderSignificanceText[ 0 ][ 'title' ];
    //         $jsonArray[ "message" ][ 'text' ] = $clientStakeholderSignificanceText[ 0 ][ 'text' ];
    //         $jsonArray[ "message" ][ 'editDate' ] = $clientStakeholderSignificanceText[ 0 ][ 'editDate' ];
    //     }
    //     else {
    //         $jsonArray = array();
    //         $jsonArray[ 'errorNo' ] = 2;
    //         $jsonArray[ 'errorMessage' ] = 'kein Eintrag';
    //     }
    //     break;

    case "i": // insert
        $clientId = $param->clientId;
        $clientSubGroupId = $param->clientSubGroupId;
        $clientStakeholderId = $param->clientStakeholderId;
        $messages = $param->messages;

        $cols = array('clientId' => $clientId);
        $cols['clientSubGroupId'] = $clientSubGroupId;
        $cols['clientStakeholderId'] = $clientStakeholderId;

        $query = 'SELECT * FROM `wa_clientStakeholderSignificance` WHERE active = 1 AND clientId = :clientId AND clientSubGroupId = :clientSubGroupId AND clientStakeholderId = :clientStakeholderId';
        $clientStakeholderSignificance = dbSelect($db, $query, $cols);

        if (count($clientStakeholderSignificance) > 0) {
            $jsonArray['errorNo'] = 3;
            $jsonArray['errorMessage'] = 'Datensatz schon vorhanden';
        } else {
            $cols = array('clientId' => $clientId);
            $cols['clientSubGroupId'] = $clientSubGroupId;
            $cols['clientStakeholderId'] = $clientStakeholderId;
            $cols['active'] = 1;

            $lastId = dbInsert($db, 'wa_clientStakeholderSignificance', $cols);
            $jsonArray['lastId'] = $lastId;

            $cols = array('clientStakeholderSignificanceId' => $lastId);

            foreach ($messages as $message) {
                $cols['active'] = 1;
                $cols['title'] = $message->title;
                $cols['text'] = $message->text;
                $cols['editDate'] = date("Y-m-d H:i:s");
                $lastId = dbInsert($db, 'wa_clientStakeholderSignificanceText', $cols);
            }
        }

        echo json_encode($jsonArray);
        break;


   
    case "d":                                                                                                                                       // delete
        $clientStakeholderSignificanceId = $param->clientStakeholderSignificanceId;                                                                                                                                         // delete
        $deleteMode = $param->action;

        $cols = array('clientStakeholderSignificanceId' => $clientStakeholderSignificanceId );
        $query = 'SELECT * FROM `wa_clientStakeholderSignificance` WHERE active = 1 AND id = :clientStakeholderSignificanceId';
        $clientStakeholderSignificance = dbSelect($db, $query, $cols);

        echo json_encode($clientStakeholderSignificance);

        if (count($clientStakeholderSignificance) == 1) {
            $cols = array();
            $cols[ 'active' ] = 0;       
            $temp = dbUpdate( $db, 'wa_clientStakeholderSignificance', $clientStakeholderSignificanceId, $cols );

            echo json_encode($temp);

            $cols = array();
            $cols[ 'clientStakeholderSignificanceId' ] = $clientStakeholderSignificanceId;   
            $query = 'update wa_clientStakeholderSignificanceText set active = 0 where clientStakeholderSignificanceId = :clientStakeholderSignificanceId'; 
            $temp2 = dbQuery($db, $query, $cols );
  
            echo json_encode($temp2);

            $jsonArray[ 'return' ] = 1;   
        }
        else {
            $jsonArray[ 'return' ] = 0;   
        }   
        break;
        

    case "e":                                                                                                                                         // edit
        $clientStakeholderSignificanceId = $param->clientStakeholderSignificanceId;
        $newMessages = $param->messages;

        $cols = array('clientStakeholderSignificanceId' => $clientStakeholderSignificanceId);
        $query = 'SELECT * FROM `wa_clientStakeholderSignificanceText` WHERE active = 1 AND clientStakeholderSignificanceId = :clientStakeholderSignificanceId';
        $existingMessages = dbSelect($db, $query, $cols);


        if( count( $existingMessages ) > 0 ) {
        foreach ($newMessages as $index => $message) {
            $cols = array(
                'active' => 1,
                'title' => $message->title,
                'text' => $message->text,
                'editDate' => date("Y-m-d H:i:s")
            );

            if (isset($existingMessages[$index])) {
                $messageId = $existingMessages[$index]['id'];
                dbUpdate($db, 'wa_clientStakeholderSignificanceText', $messageId, $cols);
            } else {
                $cols['clientStakeholderSignificanceId'] = $clientStakeholderSignificanceId;
                dbInsert($db, 'wa_clientStakeholderSignificanceText', $cols);
            }
            
            echo json_encode($cols);
        }
        }else{
            $jsonArray = array();
            $jsonArray[ 'errorNo' ] = 2;
            $jsonArray[ 'errorMessage' ] = 'kein Eintrag';
        }
        
        break;

    default:
        $jsonArray = array();
        $jsonArray[ 'errorNo' ] = 2;
        $jsonArray[ 'errorMessage' ] = 'unbekannte Aktion';
    }        
      
    echo json_encode( $jsonArray );
