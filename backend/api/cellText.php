<?php

/**********************************************************
 * API "cellText"
 * 
 *  in:     action:     r ead - i nsert - d elete - e dit
 *              
 * 
 *  23.07.2024  
 * 
*/

$notLog = 1;

include( 'inc/include.php' );
require_once __DIR__ . '/../inc/all.php';

// for JSON DATA
$rawPostData = file_get_contents('php://input');
$data = json_decode($rawPostData, true);

// echo json_encode($data);


$jsonArray = array();

if (json_last_error() == JSON_ERROR_NONE )
    $action = isset($data['action']) ? $data['action'] : null;
else
    $action = 'd';






switch ( $action ) {
    case "d":                                                                                                                                      // DELETE
        // $clientId = isset($data['clientId']) ? $data['clientId'] : null;
        $cellDataTextId = isset($data['cellDataTextId']) ? $data['cellDataTextId'] : null;                                

        $cols = array('cellDataTextId' => $cellDataTextId );
        $query = 'SELECT * FROM `wa_clientStakeholderSignificanceText` WHERE active = 1 AND Id = :cellDataTextId';
        $cellMessage = dbSelect($db, $query, $cols);


        if (count($cellMessage) == 1) {
            $cols = array();
            $cols[ 'active' ] = 0;       
            $temp = dbUpdate( $db, 'wa_clientStakeholderSignificanceText', $cellDataTextId, $cols );

            echo json_encode($temp);

            $jsonArray[ 'return' ] = 1;   
        }
        else {
            $jsonArray[ 'return' ] = 0;   
        }   
        break;

}