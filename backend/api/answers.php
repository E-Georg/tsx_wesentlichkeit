<?php

/**********************************************************
 * API-Funktion "Antworten"
 * 
 *  13.03.2024  JM
 * 
 * in:  ?qId=xx&aId=yy          FragenId / AntwortId
 */

$notLog = 1;

require_once __DIR__ . '/../inc/all.php';

if ( $userId > 0 ) {

    $questionId = 0;
    if (isset($_GET['qId'])) {
        $questionId = (int) $_GET['qId'];
    }
    $answerId = 0;
    if (isset($_GET['aId'])) {
        $answerId = (int) $_GET['aId'];
    }

    // Antwort in DB schreiben und ggfs. alte Antwort löschen:   

    if ($questionId > 0 and $answerId > 0) {                                                                           // da gehen wir mal von einer gültigen Antwort aus

        $cols = array();
        $cols['userId'] = $userId;
        $cols['questionId'] = $questionId;
        $query = 'DELETE FROM `useranswers` WHERE userId = :userId AND questionId = :questionId';                      // alte Antwort der Frage löschen
        dbQuery($db, $query, $cols);
    
        if( dbSelectId($db, 'answers', $answerId) != false ) {                                                         // gibt es die Antwort überhaupt?
            $cols = array();
            $cols['userId'] = $userId;
            $cols['questionId'] = $questionId;
            $cols['answerId'] = $answerId;
            $cols['rating'] = dbSelectId($db, 'answers', $answerId)['rating'];
            $cols['active'] = 1;        
            dbInsert($db, "useranswers", $cols);                                                                       // neue Antwort der Frage schreiben
        }
     }
    
    // Daten für Chart aufbereiten
    $row = dbSelectId($db, 'questions', $questionId);
    $chartData = array(
        'charttags' => dataForChart($db, $userId, 1),                                                                     // Gruppen (Kurzbezeichnung)
        'chartnames' =>  dataForChart($db, $userId, 2),                                                                   // Gruppen (Kurzbezeichnung + Text)
        'chartscores' =>  dataForChart($db, $userId, 3),                                                                  // Werte der Gruppen
        'groupId' =>  $row['groupId'],                                                                                      // GruppenId
        'groupQuestionsLength' => countQuestions($db, $row['groupId']),                                     // Anzahl der Fragen in dieser Gruppe
        'groupQuestionsAnswerd' =>  countAnswers($db, $userId, $row['groupId']),                       // Anzahl der Antworten in dieser Gruppe
        'questionsCount' => countQuestions($db),                                                                   // Gesamtanzahl der Fragen
        'answersCount' => countAnswers($db, $userId)                                                      // Gesamtanzahl der Antworten
    );

    echo json_encode($chartData);

    // ar( $chartData );

} else {
    echo "nix";
}
