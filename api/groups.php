<?php

/**********************************************************
 * API "groups"   
 * 
 *  01.07.2024  JM
 * 
*/

include( 'inc/include.php' );

$notLog = 1;

require_once __DIR__ . '/../inc/all.php';

//$param = json_decode( $_REQUEST[ 'param' ] );

//$clientId = $param->clientId;
// $groupId = $param->groupId;

$cols = array('active' => 1 );
$query = 'SELECT * FROM `groups` WHERE active = :active order by sort ASC';
$groups = dbSelect($db, $query, $cols);

if( count( $groups ) > 0 ) {
    $jsonArray = array();
    $pointer = 0;
    foreach( $groups as $group ) {
        $jsonArray[ $pointer ][ 'id' ] = $group[ 'id' ];
        $jsonArray[ $pointer ][ 'text' ] = $group[ 'text' ];
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
