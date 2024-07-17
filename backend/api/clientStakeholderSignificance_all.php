<?php

/**********************************************************
 * API "clientShakeholders"
 * 
 *  in:     clientId, clientSubGroupId, clientShakeholderId
 * 
 *  27.06.2024  JM
 * 
*/

// Allow from any origin                            siehe: https://stackoverflow.com/questions/8719276/cross-origin-request-headerscors-with-php-headers
if(isset($_SERVER["HTTP_ORIGIN"]))
{
    // You can decide if the origin in $_SERVER['HTTP_ORIGIN'] is something you want to allow, or as we do here, just allow all
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
}
else
{
    //No HTTP_ORIGIN set, so we allow any. You can disallow if needed here
    header("Access-Control-Allow-Origin: *");
}
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 600");    // cache for 10 minutes

if($_SERVER["REQUEST_METHOD"] == "OPTIONS")
{
    if (isset($_SERVER["HTTP_ACCESS_CONTROL_REQUEST_METHOD"]))
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT"); //Make sure you remove those you do not want to support

    if (isset($_SERVER["HTTP_ACCESS_CONTROL_REQUEST_HEADERS"]))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    //Just exit with 200 OK with the above headers for OPTIONS method
    exit(0);
}
//From here, handle the request as it is ok


$notLog = 1;

require_once __DIR__ . '/../inc/all.php';

$param = json_decode( $_REQUEST[ 'param' ] );

$clientId = $param->clientId;
$clientSubGroupId = $param->clientSubGroupId;
$clientStakeholderId = $param->clientStakeholderId;

$cols = array('clientId' => $clientId);
$cols['clientSubGroupId'] = $clientSubGroupId;
$cols['clientStakeholderId'] = $clientStakeholderId;

$query = 'SELECT * FROM `wa_clientStakeholderSignificance` WHERE active = 1 AND clientId = :clientId AND clientSubgroupId = :clientSubGroupId AND clientStakeholderId = :clientStakeholderId';
$clientStakeholderSignificance = dbSelect($db, $query, $cols);

if (count($clientStakeholderSignificance) == 1) {
    $jsonArray = array();
    $jsonArray[ 'clientSubGroupId' ] = $clientSubGroupId;
    $jsonArray[ 'clientStakeholderId' ] = $clientStakeholderId;
    $jsonArray[ 'id' ] = $clientStakeholderSignificance[ 0 ][ 'id' ];

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

echo json_encode( $jsonArray );

?>
