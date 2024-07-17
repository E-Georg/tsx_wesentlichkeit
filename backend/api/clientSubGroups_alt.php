<?php

/**********************************************************
 * API "clientSubGroups"
 * 
 *  in:     clientId, groupId
 * 
 *  27.06.2024  JM
 * 
*/
include( 'inc/include.php' );

$notLog = 1;

require_once __DIR__ . '/../inc/all.php';

$param = json_decode( $_REQUEST[ 'param' ] );



$clientId = $param->clientId;
$groupId = $param->groupId;

$cols = array('groupId' => $groupId, 'clientId' => $clientId);
$query = 'SELECT * FROM `wa_clientSubGroups` WHERE active = 1 AND groupId = :groupId AND clientId = :clientId order by sort ASC';
$clientSubGroups = dbSelect($db, $query, $cols);

if( count( $clientSubGroups ) > 0 ) {
    $jsonArray = array();
    $pointer = 0;
    foreach( $clientSubGroups as $clientSubGroup ) {
        $jsonArray[ $pointer ][ 'id' ] = $clientSubGroup[ 'id' ];
        $jsonArray[ $pointer ][ 'text' ] = $clientSubGroup[ 'text' ];
        $pointer++;
    }
}
else {
    $jsonArray = array();
    $jsonArray[ 'errorNo' ] = 1;
    $jsonArray[ 'errorMessage' ] = 'nicht gefunden';
}

echo json_encode( $jsonArray );

?>
