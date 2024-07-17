<?php

/**********************************************************
 * API-Funktion "Chart"
 * 
 *  14.03.2024  JM
 * 
*/

$notLog = 1;

require_once __DIR__ . '/../inc/all.php';

if ( $userId > 0 ) {

    $chartData = array(
        'charttags' => dataForChart($db, $userId, 1),                                       // Gruppen (Kurzbezeichnung)
        'chartnames' =>  dataForChart($db, $userId, 2),                                     // Gruppen (Kurzbezeichnung + Text)
        'chartscores' =>  dataForChart($db, $userId, 3),                                    // Werte der Gruppen
    );

    echo json_encode($chartData);

//    ar( $chartData );

} else {
    echo "nix";
}
