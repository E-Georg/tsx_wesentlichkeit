<?php

/**********************************************************
 * API "clients"   
 * 
 *  01.07.2024  JM
 * 
*/

include( 'inc/include.php' );

$notLog = 1;

require_once __DIR__ . '/../inc/all.php';

$cols = array('active' => 1 );
$query = 'SELECT * FROM `wa_clients` WHERE active = :active';
$clients = dbSelect($db, $query, $cols);

if( count( $clients ) > 0 ) {
    $jsonArray = array();
    $pointer = 0;
    foreach( $clients as $client ) {
        $jsonArray[ $pointer ][ 'id' ] = $client[ 'id' ];
        $jsonArray[ $pointer ][ 'text' ] = $client[ 'text' ];
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
