<?php

$zeitstempel = array();
$marker = array();
$zeitstempel[] = hrtime(true);                      // für Laufzeitmessung - siehe /views/footer.view.php
$marker[] = "Start";

date_default_timezone_set('Europe/Berlin');

require_once __DIR__ . '/../env/env.php';
require_once __DIR__ . '/db-connect.php';
require_once __DIR__ . '/util.php';
require_once __DIR__ . '/user.php';
require_once __DIR__ . '/function.php';
require_once __DIR__ . '/charts.php';


$zeitstempel[] = hrtime(true);                      // für Laufzeitmessung - siehe /views/footer.view.php
$marker[] = "nach require_once in all.php";


if (!isset($notLog))
    $logId = loggen($db, $userId);

/*********************************************************************************
 * Rechtesteuerung abhängig von der Nutzerrolle bzw. Seitenfreigabe im Code
 */
$scriptName = $_SERVER['PHP_SELF'];
$scriptName = substr($scriptName, strlen(actPath()));
$userRight = userRights($db, $userId, $scriptName);

$ok = 0;
switch ($userRight) {
    case -1:                                                                // kein Eintrag für diesen Userspace => Rechte unbestimmt
         // echo "<h1>undefiniert</h1>";

        if (isset($pageFree))
            if ($pageFree) {
                $ok = 1;                                                    // Seite im Code mit $pageFree = 1 freigegeben

                // echo "<h1>freigegeben (allgemein)</h1>";
            }
        break;

    case 0:                                                                 // keine Rechte => abweisen
        $ok = 0;
        $string = 'Location: ' . actpath() . 'access_denied.php';
        header( $string );
        die();
        break;

    case 1:
        // Rechte vorhanden => weitermachen
        $ok = 1;
        // echo "<h1>freigegeben (via Nutzerrolle)</h1>";
        break;
}
