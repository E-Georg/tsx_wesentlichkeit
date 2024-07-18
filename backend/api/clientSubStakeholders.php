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


    case "i":                                                                                                                                       // insert
        $name = $param->name;
        $email = $param->email;
        $stakeholderId =  $param->stakeholderId;
        
;
        $cols = array( 'active' => 1 );
        $query = 'SELECT id FROM `wa_subStakeholder` WHERE active = :active';
        $clientSubStakeholders = dbSelect($db, $query, $cols);
        

        $cols = array();
        $cols[ 'name' ] = $name;
        $cols[ 'email' ] = $email;
        $cols[ 'stakeholderID' ] = $stakeholderId;
        $cols[ 'active' ] = 1;

        $lastId = dbInsert($db, 'wa_subStakeholder', $cols);
        $jsonArray = array();
        $jsonArray[ 'lastId' ] = $lastId;   
        break;
   
    
    case "e":                                                                                                                                           // edit
        $clientSubStakeholderId = $param->clientSubStakeholderId;
        $name = $param->name;
        $email = $param->email;
        $stakeholderId =  $param->stakeholderId;
        
        $cols = array( 'active' => 1 );
        $query = 'SELECT id FROM `wa_subStakeholder` WHERE active = :active';
        $clientSubStakeholders = dbSelect($db, $query, $cols);

        $jsonArray = array();
        if( count(  $clientSubStakeholders ) > 0 ) {
            $cols = array();
            $cols[ 'name' ] = $name;
            $cols[ 'email' ] = $email;
            $cols[ 'stakeholderId' ] = $stakeholderId;
            $cols[ 'active' ] = 1;
    
            $query = 'update `wa_subStakeholder` set active = :active, name = :name, email = :email, stakeholderId = :stakeholderId where id = ' . $clientSubStakeholderId; 
            dbSelect( $db, $query, $cols );
            
            $jsonArray[ 'return' ] = 1;   
        }
        else {
            $jsonArray[ 'return' ] = 0;   
        }
        break;
    
    case "d":                                                                                                                                         // delete
        $clientSubStakeholderId = $param->clientSubStakeholderId;
        

        $cols = array('id' => $clientSubStakeholderId );
        $query = 'SELECT id FROM `wa_subStakeholder` WHERE active = 1 AND id = :id';
        $clientSubStakeholders = dbSelect($db, $query, $cols);

        $jsonArray = array();
        if( count(  $clientSubStakeholders ) > 0 ) {
            $cols = array();
            $cols[ 'active' ] = 0; 
            
            $query = 'update `wa_subStakeholder` set active = :active where id = ' . $clientSubStakeholderId;       
            dbSelect($db, $query, $cols);
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
