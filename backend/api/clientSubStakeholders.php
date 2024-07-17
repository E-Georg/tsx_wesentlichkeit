<?php

/**********************************************************
 * API "ClientSubStakeholders"
 * 
 *  in:     action:     r ead - i nsert - d elete - e dit
 *              
 * 
 *  02.07.2024  JM
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

switch ( $action ) { 

    case "r":                                                                                                                                       // read
        
        $cols = array( 'active' => 1 );
        $query = 'SELECT * FROM `wa_subStakeholder` WHERE active = :active';
        $subStakeholders = dbSelect($db, $query, $cols);
        $countSubStakeholder = is_array($subStakeholders) ? count($subStakeholders) : 0;

        if( $countSubStakeholder > 0 ) {
            $jsonArray = array();
            $pointer = 0;
            foreach( $subStakeholders as $subStakeholder ) {
                $jsonArray[ $pointer ][ 'id' ] = $subStakeholder[ 'id' ];
                $jsonArray[ $pointer ][ 'name' ] = $subStakeholder[ 'name' ];
                $jsonArray[ $pointer ][ 'email' ] = $subStakeholder[ 'email' ];
                $jsonArray[ $pointer ][ 'stakeholderId' ] = $subStakeholder[ 'stakeholderId' ];
                $pointer++;
            }
        }
        else {
            $jsonArray = array();
            $jsonArray[ 'errorNo' ] = 1;
            $jsonArray[ 'errorMessage' ] = 'nicht gefunden';
        }
        break;

    case "rid":                                                                                                                                       // readonlywithstakeholderID
            $clientId = $param->clientId;
            $stakeholderId = $param->stakeholderId;

        $cols = array('clientId' => $clientId);
        $cols = array('stakeholderId' => $stakeholderId);
        $query = 'SELECT * FROM `wa_clientSubStakeholders` WHERE active = 1 AND clientId = :clientId AND stakeholderId = :stakeholderId order by sort asc';
        $clientStakeholders = dbSelect($db, $query, $cols);

        if( count( $clientStakeholders ) > 0 ) {
            $jsonArray = array();
            $pointer = 0;
            foreach( $clientStakeholders as $clientStakeholder ) {
                $jsonArray[ $pointer ][ 'id' ] = $clientStakeholder[ 'id' ];
                $jsonArray[ $pointer ][ 'name' ] = $clientStakeholder[ 'name' ];
                $jsonArray[ $pointer ][ 'email' ] = $clientStakeholder[ 'email' ];
                $jsonArray[ $pointer ][ 'stakeholderName' ] = $clientStakeholder[ 'stakeholderName' ];
                $jsonArray[ $pointer ][ 'stakeholderID' ] = $clientStakeholder[ 'stakeholderID' ];
                $pointer++;
            }
        }
        else {
            $jsonArray = array();
            $jsonArray[ 'errorNo' ] = 1;
            $jsonArray[ 'errorMessage' ] = 'nicht gefunden';
        }
        break;

    case "i":                                                                                                                                       // insert
        $clientId = $param->clientId;
        $name = $param->name;
        $email = $param->email;
        $stakeholderId =  $param->stakeholderId;
        
;
        $cols = array('clientId' => $clientId);
        $query = 'SELECT id,sort FROM `wa_clientStakeholders` WHERE active = 1 AND clientId = :clientId order by sort DESC';
        $clientStakeholders = dbSelect($db, $query, $cols);
        $lastSort = $clientStakeholders[ 0 ][ 'sort' ];

        $cols = array();
        $cols[ 'clientId' ] = $clientId;
        $cols[ 'name' ] = $name;
        $cols[ 'email' ] = $email;
        $cols[ 'stakeholderID' ] = $stakeholderId;
        $cols[ 'sort' ] = $lastSort + 10; 
        $cols[ 'active' ] = 1;

        $lastId = dbInsert($db, 'wa_clientSubStakeholders', $cols);
        $jsonArray = array();
        $jsonArray[ 'lastId' ] = $lastId;       
        break;
   
   

    default:
        $jsonArray = array();
        $jsonArray[ 'errorNo' ] = 2;
        $jsonArray[ 'errorMessage' ] = 'unbekannte Aktion';
    }        
    


    echo json_encode( $jsonArray );

?>
