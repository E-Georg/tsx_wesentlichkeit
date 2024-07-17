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
        $subGroupId = $param->groupId;
        
        $cols = array('groupId' => $subGroupId, 'clientId' => $clientId);
        $query = 'SELECT * FROM `wa_clientSubGroups` WHERE active = 1 AND groupId = :groupId AND clientId = :clientId order by sort ASC';
        $clientSubGroups = dbSelect($db, $query, $cols);
        
        if( count( $clientSubGroups ) > 0 ) {
            $pointer = 0;
            foreach( $clientSubGroups as $clientSubGroup ) {
                $jsonArray[ $pointer ][ 'id' ] = $clientSubGroup[ 'id' ];
                $jsonArray[ $pointer ][ 'title' ] = $clientSubGroup[ 'title' ];
                $jsonArray[ $pointer ][ 'description' ] = $clientSubGroup[ 'description' ];
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
        $groupId = $param->groupId;
        $text = $param->text;
        $description = $param->description;

        $cols = array('groupId' => $groupId, 'clientId' => $clientId);
        $query = 'SELECT id,sort FROM `wa_clientSubGroups` WHERE active = 1 AND groupId = :groupId AND clientId = :clientId order by sort DESC';
        $clientSubGroups = dbSelect($db, $query, $cols);
        $lastSort = $clientSubGroups[ 0 ][ 'sort' ];

        $cols = array();
        $cols[ 'groupId' ] = $groupId;
        $cols[ 'clientId' ] = $clientId;
        $cols[ 'text' ] = $text;
        $cols[ 'description' ] = $description;
        $cols[ 'sort' ] = $lastSort + 10; 
        $cols[ 'active' ] = 1;

        $lastId = dbInsert($db, 'wa_clientSubGroups', $cols);
        $jsonArray = array();
        $jsonArray[ 'lastId' ] = $lastId;       
        break;
   
    case "d":                                                                                                                                         // delete
        $clientSubGroupId = $param->clientSubGroupId;

        $cols = array('id' => $clientSubGroupId );
        $query = 'SELECT id FROM `wa_clientSubGroups` WHERE active = 1 AND id = :id';
        $clientSubGroups = dbSelect($db, $query, $cols);

        $jsonArray = array();
        if( count(  $clientSubGroups ) > 0 ) {
            $cols = array();
            $cols[ 'active' ] = 0;       
            dbUpdate($db, 'wa_clientSubGroups', $clientSubGroupId, $cols);
            $jsonArray[ 'return' ] = 1;   
        }
        else {
            $jsonArray[ 'return' ] = 0;   
        }            
        break;
        

    case "e":                                                                                                                                         // edit
            $clientSubGroupId = $param->clientSubGroupId;
            $clientId = $param->clientId;
            $groupId = $param->groupId;
            $text = $param->text;
            $description = $param->description;
                
            $cols = array('id' => $clientSubGroupId );
            $query = 'SELECT id FROM `wa_clientSubGroups` WHERE active = 1 AND id = :id';
            $clientSubGroups = dbSelect($db, $query, $cols);
    
            $jsonArray = array();
            if( count(  $clientSubGroups ) > 0 ) {
                $cols = array();
                $cols[ 'clientId' ] = $clientId;
                $cols[ 'groupId' ] = $groupId;
                $cols[ 'text' ] = $text;
                $cols[ 'description' ] = $description;
                
                $query = 'update `wa_clientSubGroups` set clientId = :clientId, groupId = :groupId, text = :text, description = :description where id = ' . $clientSubGroupId; 
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

?>
