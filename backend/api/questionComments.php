<?php
/**********************************************************
 * API-Funktion "Fragen-Kommentare"
 * 
 *  18.03.2024  JM
 * 
 * in:  POST   JSON mit questionId und comment
 */

$notLog = 1;

require_once __DIR__ . '/../inc/all.php';

$json = file_get_contents('php://input');                                                                       // POST-Paramter als JSON-String
$postData = json_decode( $json );

if( isset( $postData->questionId ) )
    $questionId = $postData->questionId;
else
    $questionId = 0;
if( isset( $postData->comment ) )
    $comment = $postData->comment;
else
    $comment = '';

if ( $userId > 0 and $questionId > 0 ) {                                                                        // gültiger User und existierende Frage 

    if ($questionId > 0 ) {                                                                                     // da gehen wir mal von einer gültigen Frage aus
        $cols = array();
        $cols['userId'] = $userId;
        $cols['questionId'] = $questionId;
        $query = 'DELETE FROM `userquestioncomments` WHERE userId = :userId AND questionId = :questionId';      // alter Kommentar der Frage löschen
        dbQuery($db, $query, $cols);

        if( strlen( $comment ) > 0 ) {
            $cols = array();
            $cols['userId'] = $userId;
            $cols['questionId'] = $questionId;
            $cols['comment'] = strip_tags( $comment );
            $cols['active'] = 1;
            dbInsert($db, "userquestioncomments", $cols);                                                           // neuer Kommentar zu dieser Frage speichern
        }
    }
    
} else {
    echo "nix";
}
