<?php

/**********************************************************
 * API "clientShakeholders"
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
        $clientId = $param->clientId;

        $cols = array('clientId' => $clientId);
        $query = 'SELECT * FROM `wa_clientStakeholders` WHERE active = 1 AND clientId = :clientId order by sort asc';
        $clientStakeholders = dbSelect($db, $query, $cols);

        if( count( $clientStakeholders ) > 0 ) {
            $jsonArray = array();
            $pointer = 0;
            foreach( $clientStakeholders as $clientStakeholder ) {
                $jsonArray[ $pointer ][ 'id' ] = $clientStakeholder[ 'id' ];
                $jsonArray[ $pointer ][ 'title' ] = $clientStakeholder[ 'title' ];
                $jsonArray[ $pointer ][ 'description' ] = $clientStakeholder[ 'description' ];
                $jsonArray[ $pointer ][ 'classification' ] = $clientStakeholder[ 'classification' ];
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
        $title = $param->title;
        $description = $param->description;
        $classification = $param->classification;

        $cols = array('clientId' => $clientId);
        $query = 'SELECT id,sort FROM `wa_clientStakeholders` WHERE active = 1 AND clientId = :clientId order by sort DESC';
        $clientStakeholders = dbSelect($db, $query, $cols);
        $lastSort = $clientStakeholders[ 0 ][ 'sort' ];

        $cols = array();
        $cols[ 'clientId' ] = $clientId;
        $cols[ 'title' ] = $title;
        $cols[ 'description' ] = $description;
        $cols[ 'classification' ] = $classification;
        $cols[ 'sort' ] = $lastSort + 10; 
        $cols[ 'active' ] = 1;

        $lastId = dbInsert($db, 'wa_clientStakeholders', $cols);
        $jsonArray = array();
        $jsonArray[ 'lastId' ] = $lastId;       
        break;
   
    case "d":                                                                                                                                         // delete
        $clientStakeholderId = $param->clientStakeholderId;

        $cols = array('id' => $clientStakeholderId );
        $query = 'SELECT id FROM `wa_clientStakeholders` WHERE active = 1 AND id = :id';
        $clientStakeholders = dbSelect($db, $query, $cols);

        $jsonArray = array();
        if( count(  $clientStakeholders ) > 0 ) {
            $cols = array();
            $cols[ 'active' ] = 0;       
            dbUpdate($db, 'wa_clientStakeholders', $clientStakeholderId, $cols);
            $jsonArray[ 'return' ] = 1;   
        }
        else {
            $jsonArray[ 'return' ] = 0;   
        }            
        break;
        
    case "e":                                                                                                                                           // edit
            $clientStakeholderId = $param->clientStakeholderId;
            $title = $param->title;
            $description = $param->description;
            $classification = $param->classification;
                
            $cols = array('id' => $clientStakeholderId );
            $query = 'SELECT id FROM `wa_clientStakeholders` WHERE active = 1 AND id = :id';
            $clientStakeholders = dbSelect($db, $query, $cols);

            $jsonArray = array();
            if( count(  $clientStakeholders ) > 0 ) {
                $cols = array();
                $cols[ 'title' ] = $title;
                $cols[ 'description' ] = $description;
                $cols[ 'classification' ] = $classification;
                $cols[ 'active' ] = 1;
        
                $query = 'update `wa_clientStakeholders` set active = :active, text = :text, description = :description, classification = :classification where id = ' . $clientStakeholderId; 
                dbSelect( $db, $query, $cols );
                
                $jsonArray[ 'return' ] = 1;   
            }
            else {
                $jsonArray[ 'return' ] = 0;   
            }
            break;

    default:
        $jsonArray = array();
        $jsonArray[ 'errorNo' ] = 2;
        $jsonArray[ 'errorMessage' ] = 'unbekannte Aktion';
    }        
    


    echo json_encode( $jsonArray );

