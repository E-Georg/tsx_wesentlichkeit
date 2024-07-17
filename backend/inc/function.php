<?php

/*******************************************************************************
 *  Pfeile
 * 
 *  24.01.24    JM
 *
 *  $value
 * 
 */
function arrow($value): string
{
    if ($value == 0) {
        $string = '<i class="bi bi-arrow-down-circle-fill fw-bolder"></i>';
    } else if ($value <= 0.25) {
        $string = '<i class="bi bi-arrow-down-right-circle-fill fw-bolder"></i>';
    } else if ($value <= 0.50) {
        $string = '<i class="bi bi-arrow-right-circle-fill fw-bolder"></i>';
    } else if ($value <= 0.75) {
        $string = '<i class="bi bi-arrow-up-right-circle-fill fw-bolder"></i>';
    } else if ($value <= 1) {
        $string = '<i class="bi bi-arrow-up-circle-fill fw-bolder"></i>';
    } else {
        $string = '<i class="bi bi-bug-fill"></i>';
    }
    return ($string);
}

/*******************************************************************************
 *  Anzahl der Antworten pro Gruppe bzw. aller Antworten / User ermitteln
 * 
 *  16.01.24    JM
 *
 *  $userId
 *  $groupId    bei 0 => alle Antworten / User 
 * 
 */
function countAnswers($db, $userId, $groupId = 0)
{
    $count = 0;
    if ($groupId == 0) {                                    // Anzahl der beantworteten Fragen pro User
        $cols = array();
        $cols['userId'] = $userId;
        $query = 'SELECT id FROM useranswers WHERE active = 1 AND userId = :userId';
        $userAnswers = dbSelect($db, $query, $cols);
        $count = count($userAnswers);
    } else                                                  // Anzahl der beantworteten Fragen pro User und Gruppe
    {
        $cols = array();
        $cols['userId'] = $userId;
        $cols['groupId'] = $groupId;
        $query = 'SELECT useranswers.id, useranswers.questionId, questions.groupId FROM useranswers INNER JOIN questions ON useranswers.questionId = questions.id WHERE questions.groupId = :groupId AND useranswers.active = 1 AND useranswers.userId = :userId';

        $userAnswers = dbSelect($db, $query, $cols);
        $count = count($userAnswers);
    }

    return ($count);
}

/*******************************************************************************
 *  Anzahl der Fragen pro Gruppe ermitteln
 * 
 *  16.01.24    JM
 *
 *  $groupId    bei 0 => alle Fragen  
 * 
 */
function countQuestions($db, $groupId = 0)
{

    $count = 0;
    if ($groupId == 0) {                                        // Anzahl der Fragen
        $cols = array();
        $query = 'SELECT id FROM questions WHERE active = 1';
        $questions = dbSelect($db, $query, $cols);
        $count = count($questions);
    } else                                                      // Anzahl der Fragen pro Gruppe
    {
        $cols = array();
        $cols['groupId'] = $groupId;
        $query = 'SELECT id FROM questions WHERE active = 1 AND groupId = :groupId';
        $userAnswers = dbSelect($db, $query, $cols);
        $questions = dbSelect($db, $query, $cols);
        $count = count($questions);
    }
    return ($count);
}


/*******************************************************************************
 *  Rating der Antworten ermitteln
 * 
 *  16.01.24    JM
 *
 *  $userId
 *  $groupId    bei 0 => alle Antworten, ansonsten jeweils für eine Gruppe  
 * 
 */
function answersRating($db, $userId, $groupId = 0)
{
    $count = 0;
    if ($groupId == 0) {                                    // Anzahl der beantworteten Fragen pro User
        $cols = array();
        $cols['userId'] = $userId;
        $query = 'SELECT rating FROM useranswers WHERE active = 1 AND userId = :userId';
        $userAnswers = dbSelect($db, $query, $cols);
        $count = count($userAnswers);
    } else                                                    // Anzahl der beantworteten Fragen pro User und Gruppe
    {
        $cols = array();
        $cols['userId'] = $userId;
        $cols['groupId'] = $groupId;
        $query = 'SELECT useranswers.rating, useranswers.id, useranswers.questionId, questions.groupId FROM useranswers INNER JOIN questions ON useranswers.questionId = questions.id WHERE questions.groupId = :groupId AND useranswers.active = 1 AND useranswers.userId = :userId';
        $userAnswers = dbSelect($db, $query, $cols);
        $count = count($userAnswers);
    }
    $rating = 0;
    if ($count > 0) {
        foreach ($userAnswers as $answer) {
            $rating += $answer['rating'];
        }
        $rating = $rating / ($count * 4);                             // der Teiler 4 ist hier unschön - der muss noch durch das höchste Rating in dieser Gruppe ersetzt werden.  Das muss aber noch besser druchdacht werden
        $rating = round($rating, 1);
    }
    return ($rating);
}

/*******************************************************************************
 *  alle Antworten eines Users löschen
 * 
 *  28.01.24    JM
 *
 *  $userIdDelete   User dessen Antworten gelöscht werden
 */
function userAnswersDelete($db, $userIdDelete)
{

    if ($userIdDelete > 0) {
        $cols = array();
        $cols['userId'] = $userIdDelete;
        $query = "UPDATE useranswers SET active = 0 WHERE userId = :userId";
        dbQuery($db, $query, $cols);
    }
}


/*******************************************************************************
 *  Users löschen
 * 
 *  15.03.24    JM
 *
 *  $userId   User der gelöscht wird
 */
function userDelete($db, $userId)
{
    if ($userId > 0) {
        $cols = array();                                                                // Antworten löschen
        $cols['userId'] = $userId;
        $query = "UPDATE useranswers SET active = 0 WHERE userId = :userId";
        dbQuery($db, $query, $cols);

        $cols = array();                                                                // User löschen
        $cols['userId'] = $userId;
        $query = "UPDATE user SET active = 0 WHERE id = :userId";
        dbQuery($db, $query, $cols);

        $cols = array();                                                                // weitere Userdaten in der userSub löschen
        $cols['userId'] = $userId;
        $query = "UPDATE usersub SET active = 0 WHERE userId = :userId";
        dbQuery($db, $query, $cols);
    }
}


// alter Code aus dem privaten Fundus von Jürgen, könnte mal überarbeitet werden - ist aber immer noch nutzbar
/**********************/
// hier muss noch eine inteligente Zeitsteuerung rein
/*
* 	@param	zeitsteuerung		0 - Datum + Zeit
*					1 - nur Datum
*					2 - nur Zeit (bei aktuellem Tag)
*					3 - Datum + Zeit (kurz - 07 statt 2007)
*					4 - nur Datum (kurz - 07 statt 2007)
*/
function datum($datum, $zeitsteuerung = 0)
{

    $data = explode("-", substr($datum, 0, 10));
    if (strftime("%Y", time()) == $data[0])
        $dat = $data[2] . "." . $data[1] . ".";
    else
        $dat = $data[2] . "." . $data[1] . "." . $data[0];

    // wg. Jahreswechselproblem - muss noch besser durchdacht werden  		02.01.2007	JM		xxx

    $dat = $data[2] . "." . $data[1] . "." . $data[0];

    switch ($zeitsteuerung) {
        case 0:
            $zeit = substr($datum, 11, 8);
            $lcstring = $dat . " " . $zeit;
            break;

        case 1:
            $lcstring = $dat;
            break;

        case 2:
            if (strftime("%Y", time()) == $data[0] and strftime("%m", time()) == $data[1] and strftime("%d", time()) == $data[2])
                $lcstring = substr($datum, 11, 8);
            else
                $lcstring = substr($dat, 0, 6)  . " " . substr($datum, 11, 8);
            //	     			$lcstring = $dat;
            break;

        case 3:
            $dat = substr($dat, 0, 6) . substr($dat, 8, 2);
            $zeit = substr($datum, 11, 5);
            $lcstring = $dat . " " . $zeit;
            break;

        case 4:
            $lcstring = substr($dat, 0, 6) . substr($dat, 8, 2);
            break;
    }
    return ($lcstring);
}


function groupName($db, $groupId)
{
    $row = dbSelectId($db, 'groups', $groupId);
    return ($row['text']);
}

function groupTag($db, $groupId)
{
    $row = dbSelectId($db, 'groups', $groupId);
    return ($row['tag']);
}

function federalstate($db, $id)
{
    $row = dbSelectId($db, 'federalstate', $id);
    return ($row['text']);
}

/*********************************************************************************************************************************
 *  ECO-Wert berechnen
 * 
 *  09.04.24    JM
 */
function ecoValue($db, $mUserId)
{

    $cols = array();
    $query = 'SELECT * FROM `groups` ORDER BY `sort` ASC';
    $groups = dbSelect($db, $query, $cols);

    $sum = 0;
    foreach ($groups as $group) {
        $sum += answersRating($db, $mUserId, $group['id']);
    }
    $value = $sum / count($groups);
    return ($value);
}
