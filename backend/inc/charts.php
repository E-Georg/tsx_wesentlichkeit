<?php
// Gruppen TAG 
(array) $labelArray = dataForChart($db, $userId, 1);
// Gruppen NAME
(array) $labelNameArray = dataForChart($db, $userId, 2);
// GruppeSumme
(array) $dataArray = dataForChart($db, $userId, 3);


/**************************************************************************
 *  
 *  type        1 = Gruppen Tag
 *              2 = Gruppen Tag + Name
 *              3 = Gruppensumme
 */
function dataForChart($db, $userId, $type = 0)
{
    $labelArray = array();
    $dataArray = array();

    $stmtCategories = $db->prepare('SELECT * FROM `categories` ORDER BY `id` ASC');
    $stmtCategories->execute();
    $allCategories = $stmtCategories->fetchAll(PDO::FETCH_ASSOC);

    $stmtGroups = $db->prepare('SELECT * FROM `groups` ORDER BY `id` ASC');
    $stmtGroups->execute();
    $allGroups = $stmtGroups->fetchAll(PDO::FETCH_ASSOC);

    $cols = array();
    $query = 'SELECT * FROM `categories` ORDER BY `sort` ASC';
    $categories = dbSelect($db, $query, $cols);

    foreach ($categories as $category) {

        $cols = array();
        $cols['categoryId'] = $category['id'];
        $query = 'SELECT * FROM `groups` where categoryId = :categoryId ORDER BY `id` ASC';
        $groups = dbSelect($db, $query, $cols);

        foreach ($groups as $group) {
            $countQuestions = countQuestions($db, $group['id']);
            $countAnswers  = countAnswers($db, $userId, $group['id']);
            $rating = answersRating($db, $userId, $group['id']);
            $dataArray[] = $rating * 1;
            if ($type == 1)
                $labelArray[] = $group['tag'];
            if ($type == 2)
                $labelArray[] = $group['tag'] . " " . $group['text'];
        }
    }
    if ($type == 1 or $type == 2)
        return ($labelArray);

    if ($type == 3)
        return ($dataArray);
}
?>
