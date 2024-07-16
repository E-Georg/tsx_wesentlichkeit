<?php

/**********************************************************
 * API "clientStakeholderSignificanceLink"
 * 
 *  in:     action:     r ead - i nsert - d elete - e dit
 *              
 * 
 *  09.07.2024  JM
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

$clientStakeholderSignificanceId = $param->clientStakeholderSignificanceId;

$cols = array('clientStakeholderSignificanceId' => $clientStakeholderSignificanceId );

$query = 'SELECT * FROM `wa_clientStakeholderSignificance` WHERE active = 1 AND id = :clientStakeholderSignificanceId';
$clientStakeholderSignificance = dbSelect($db, $query, $cols);

if ( count($clientStakeholderSignificance ) == 0 ) {
    $jsonArray = array();
    $jsonArray[ 'errorNo' ] = 2;
    $jsonArray[ 'errorMessage' ] = 'kein Eintrag';
    $action = "x";
}


switch ( $action ) {

    case "r":                                                                                                                                       // read
        $cols = array('clientStakeholderSignificanceId' => $clientStakeholderSignificanceId );

        $query = 'SELECT * FROM `wa_clientStakeholderSignificanceLinks` WHERE active = 1 AND clientStakeholderSignificanceId = :clientStakeholderSignificanceId';
        $clientStakeholderSignificanceLinks = dbSelect($db, $query, $cols);

ar( $clientStakeholderSignificanceLinks );

        if( count( $clientStakeholderSignificanceLinks ) > 1) {
            $pointer = 0;
            $jsonArray = array();
            foreach( $clientStakeholderSignificanceLinks as $clientStakeholderSignificanceLink ) {
                $jsonArray[ $pointer ][ 'id' ] = $clientStakeholderSignificanceLink[ 'id' ];
   
                $jsonArray[ $pointer ][ "link" ][ 'title' ] = $clientStakeholderSignificanceLink[ 0 ][ 'title' ];
                $jsonArray[ $pointer ][ "link" ][ 'url' ] = $clientStakeholderSignificanceLink[ 0 ][ 'link' ];
                $jsonArray[ $pointer ][ "link" ][ 'text' ] = $clientStakeholderSignificanceLink[ 0 ][ 'text' ];
                $jsonArray[ $pointer ][ "link" ][ 'editDate' ] = $clientStakeholderSignificanceLink[ 0 ][ 'editDate' ];
                $pointer++;
            }
        }

ar( $jsonArray );

exit;

/*

            $jsonArray = array();

            $cols = array('clientStakeholderSignificanceId' => $clientStakeholderSignificance[ 0 ][ 'id' ] );
            $query = 'SELECT * FROM `wa_clientStakeholderSignificanceText` WHERE active = 1 AND clientStakeholderSignificanceId = :clientStakeholderSignificanceId';
            $clientStakeholderSignificanceText = dbSelect($db, $query, $cols);

            $jsonArray[ "message" ][ 'title' ] = $clientStakeholderSignificanceText[ 0 ][ 'title' ];
            $jsonArray[ "message" ][ 'text' ] = $clientStakeholderSignificanceText[ 0 ][ 'text' ];
            $jsonArray[ "message" ][ 'editDate' ] = $clientStakeholderSignificanceText[ 0 ][ 'editDate' ];
        }
        else {
            $jsonArray = array();
            $jsonArray[ 'errorNo' ] = 2;
            $jsonArray[ 'errorMessage' ] = 'kein Eintrag';
        }

*/        
        break;



    case "i":                                                                                                                                       // insert
        $clientId = $param->clientId;
        $clientSubGroupId = $param->clientSubGroupId;
        $clientStakeholderId = $param->clientStakeholderId;
        $title = $param->title;
        $text = $param->text;

        $cols = array('clientId' => $clientId);
        $cols['clientSubGroupId'] = $clientSubGroupId;
        $cols['clientStakeholderId'] = $clientStakeholderId;

        $query = 'SELECT * FROM `wa_clientStakeholderSignificance` WHERE active = 1 AND clientId = :clientId AND clientSubgroupId = :clientSubGroupId AND clientStakeholderId = :clientStakeholderId';
        $clientStakeholderSignificance = dbSelect($db, $query, $cols);
        if( count( $clientStakeholderSignificance ) > 0 ) {
            $jsonArray = array();
            $jsonArray[ 'errorNo' ] = 3;
            $jsonArray[ 'errorMessage' ] = 'Datensatz schon vorhanden';
        }
        else {
            $cols = array('clientId' => $clientId);
            $cols['clientSubGroupId'] = $clientSubGroupId;
            $cols['clientStakeholderId'] = $clientStakeholderId;
            $cols[ 'active' ] = 1; 

            $lastId = dbInsert($db, 'wa_clientStakeholderSignificance', $cols);
            $jsonArray = array();
            $jsonArray[ 'lastId' ] = $lastId;
            
            $cols = array('clientStakeholderSignificanceId' => $lastId );
            $cols[ 'active' ] = 1; 
            $cols[ 'title' ] = $title;
            $cols[ 'text' ] = $text;
            $cols[ 'editDate' ] = date("Y-m-d H:i:s");
            $lastId = dbInsert($db, 'wa_clientStakeholderSignificanceText', $cols);
        }      
        break;
   
    case "d":                                                                                                                                       // delete
        $clientStakeholderSignificanceId = $param->clientStakeholderSignificanceId;                                                                                                                                         // delete
        $deleteMode = $param->deleteMode;

        $cols = array('clientStakeholderSignificanceId' => $clientStakeholderSignificanceId );
        $query = 'SELECT * FROM `wa_clientStakeholderSignificance` WHERE active = 1 AND id = :clientStakeholderSignificanceId';
        $clientStakeholderSignificance = dbSelect($db, $query, $cols);

        if (count($clientStakeholderSignificance) == 1) {
            $cols = array();
            $cols[ 'active' ] = 0;       
            dbUpdate( $db, 'wa_clientStakeholderSignificance', $clientStakeholderSignificanceId, $cols );

            $cols = array();
            $cols[ 'clientStakeholderSignificanceId' ] = $clientStakeholderSignificanceId;   
            $query = 'update wa_clientStakeholderSignificanceText set active = 0 where clientStakeholderSignificanceId = :clientStakeholderSignificanceId'; 
            dbQuery($db, $query, $cols );
  
            $jsonArray[ 'return' ] = 1;   
        }
        else {
            $jsonArray[ 'return' ] = 0;   
        }   
        break;
        

    case "e":                                                                                                                                         // edit
        $clientStakeholderSignificanceId = $param->clientStakeholderSignificanceId;
        $title = $param->title;
        $text = $param->text;

        $cols = array();
        $cols[ 'clientStakeholderSignificanceId' ] = $clientStakeholderSignificanceId;

        $query = 'SELECT * FROM `wa_clientStakeholderSignificanceText` WHERE active = 1 AND clientStakeholderSignificanceId = :clientStakeholderSignificanceId';
        $clientStakeholderSignificance = dbSelect($db, $query, $cols);
        if( count( $clientStakeholderSignificance ) > 0 ) {
            $cols[ 'title' ] = $title;
            $cols[ 'text' ] = $text;
            $cols[ 'editDate' ] = date("Y-m-d H:i:s");
            dbUpdate( $db, 'wa_clientStakeholderSignificanceText',  $clientStakeholderSignificance[ 0 ][ 'id' ] , $cols);
            
            $jsonArray[ 'return' ] = 1;   
        }
        else {

            $jsonArray = array();
            $jsonArray[ 'errorNo' ] = 2;
            $jsonArray[ 'errorMessage' ] = 'kein Eintrag';
        }      
        break;

    case "x":
        break;

    default:
        $jsonArray = array();
        $jsonArray[ 'errorNo' ] = 2;
        $jsonArray[ 'errorMessage' ] = 'unbekannte Aktion';
    }        
      
    echo json_encode( $jsonArray );

?>
