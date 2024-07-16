<?php

try {
    $db = new PDO("mysql:host=$db_server;dbname=$db_name", $db_benutzer, $db_passwort);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(pdoError($e->getMessage(), '', ''));
}

/******************************************************************************
 *  Update
 * 
 *  $db         Datenbankhandle
 *  $table      Tabelle
 *  $id         Id des Datensatzes
 *  $cols       Array mit Parameter für den Update
 * 
 *  return:     Anzahl der geänderten Datensätze
 *
 *  10.01.2024  JM
 */
function dbUpdate($db, $table, $id, $cols)
{
    try {
        $anzahl = count($cols);

        $query = "UPDATE `" . $table . "` SET ";
        for ($i = 0; $i < $anzahl; $i++) {
            $query .= array_keys($cols)[$i] . ' = :' . array_keys($cols)[$i];
            if ($i < ($anzahl - 1))
                $query .= ', ';
        }
        $query .= " WHERE id = :id";

        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        for ($i = 0; $i < $anzahl; $i++) {
            $stmt->bindParam(':' . array_keys($cols)[$i], $cols[array_keys($cols)[$i]]);
        }
        $stmt->execute();
        return ($stmt->rowCount());
    } catch (Exception $e) {
        pdoError($e->getMessage(), $query, $cols);
    }
}


/******************************************************************************
 *  Delete ( einzelner Datensatz )
 * 
 *  $db         Datenbankhandle
 *  $table      Tabelle
 *  $id         ID
 * 
 *  return:     Datensatz gelöscht: 1 - Datensatz war schon gelöscht bzw. ist nicht vorhanden: 0
 * 
 * Datensatz wird physikalisch nicht gelöscht. Es wird das Active-Flag im Feld "active" auf 0 gesetzt
 * 
 *  11.01.2024  JM
 */
function dbDelete($db, $table, $id)
{

    try {
        $query = 'UPDATE ' . $table . ' SET active = 0 WHERE id = ' . $id;
        $stmt = $db->prepare($query);
        $stmt->execute();
        return ($stmt->rowCount());
    } catch (Exception $e) {
        pdoError($e->getMessage(), $query, $id);
    }
}

/******************************************************************************
 *  Insert
 * 
 *  $db         Datenbankhandle
 *  $table      Tabelle
 *  $cols       Array mit Parameter für den Insert
 * 
 *  Rückgabe:   ID des angelegten Datensatzs
 * 
 *  10.01.2024  JM
 */
function dbInsert($db, $table, $cols)
{
    try {
        $query = 'INSERT INTO ' . $table . '( ';
        $anzahl = count($cols);
        for ($i = 0; $i < $anzahl; $i++) {
            $query .= array_keys($cols)[$i];
            if ($i < ($anzahl - 1))
                $query .= ', ';
        }
        $query .= ") VALUES ( ";
        for ($i = 0; $i < $anzahl; $i++) {
            $query .= ':' . array_keys($cols)[$i];
            if ($i < ($anzahl - 1))
                $query .= ', ';
        }
        $query .= ' )';
        $stmt = $db->prepare($query);
        $stmt->execute($cols);
    } catch (Exception $e) {
        pdoError($e->getMessage(), $query, $cols);
    }
    return ($db->lastInsertId());
}


/******************************************************************************
 *  Select
 * 
 *  $db         Datenbankhandle
 *  $table      Tabelle
 *  $query      Select-Query
 *  $cols       Array mit Parameter für bindParam
 * 
 *  08.01.2024  JM
 */
function dbSelect($db, $query, $cols)
{

    try {
        $stmt = $db->prepare($query);
        $stmt->execute($cols);
        $row = $stmt->fetchAll();
        return ($row);
    } catch (Exception $e) {
        pdoError($e->getMessage(), $query, $cols);
    }
}

/******************************************************************************
 *  Query 
 * 
 *  $db         Datenbankhandle
 *  $table      Tabelle
 *  $query      Select-Query
 *  $cols       Array mit Parameter für bindParam
 * 
 *  08.01.2024  JM
 */
function dbQuery($db, $query, $cols)
{
    try {
        $stmt = $db->prepare($query);
        $stmt->execute($cols);
        $row = $stmt->fetchAll();
        return ($row);
    } catch (Exception $e) {
        pdoError($e->getMessage(), $query, $cols);
    }
}

/******************************************************************************
 *  Select nach id
 * 
 *  $db         Datenbankhandle
 *  $table      Tabelle
 *  $id         ID des gesuchten Datensatzes
 * 
 *  08.01.2024  JM
 */
function dbSelectId($db, $table, $id, $active = 1)
{
    try {
        if ($active == 1)
            $query = 'SELECT * FROM `' . $table . '` WHERE `active` = 1 AND `id` = :id';
        else
            $query = 'SELECT * FROM `' . $table . '` WHERE `id` = :id';
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_LAZY);
        if( $stmt->rowCount() == 0 )
            return( false );
        else
            return( $row );
    }
    catch(Exception $e) {
        pdoError( $e->getMessage(), $query, $cols );
    }
}


/******************************************************************************
 *  PDO-Fehlermeldung ausgeben (nur während der Entwicklung!)
 *  wird mit $debug = 1 eingeschaltet
 * 
 *  $debug  global      1 = Fehlermeldungen einschalten
 * 
 *  $text       
 *  $query      falls vorhanden
 *  $cols       Array mit Parameter (falls vorhanden)
 * 
 *  10.01.2024  JM
 */
function pdoError($text, $query, $cols)
{

    global $debug;

    echo '<table border="1" cellpadding = "10"><tr><td>';
    if ($debug) {
        echo $text;
        echo "<p>";
        echo '<strong>' . $query . '</strong>';
        echo "<p>";
        echo "<pre>";
        print_r($cols);
        echo "</pre>";
        echo "in: " . $_SERVER['PHP_SELF'];
    } else {
        echo "Fehler in " . $_SERVER['PHP_SELF'];
    }
    echo "</td></tr></table>";
}



/***************************************************************************************************************
 *  Loggen
 * 
 *  28.01.2024  JM
 */
function loggen( $db, $userId )
{

    $marker[] = "loggen anfang";
    $zeitstempel[] = hrtime(true); 

    $client = gethostbyaddr($_SERVER["REMOTE_ADDR"]);

    if (isset($_SERVER['HTTP_REFERER']))
        $lcHttpReferer = $_SERVER['HTTP_REFERER'];
    else
        $lcHttpReferer = "";

    $lcHttpReferer = str_replace( 'https://servicehub.e-infra.com', ' ',  $lcHttpReferer );                     // Kosmetik
    $lcHttpReferer = str_replace( 'http://localhost', ' ',  $lcHttpReferer );

    $cols = array(
        "zeit" => date( 'Y-m-d H:i:s' ),
        "ip" => getip(),
        "ip2" => $_SERVER["REMOTE_ADDR"],
        "client" => gethostbyaddr($_SERVER["REMOTE_ADDR"]),
        "userid" => $userId,
        "script" => $_SERVER['PHP_SELF'],
        "referer" => $lcHttpReferer,
        "urlParameter" => $_SERVER['QUERY_STRING'],
    );

    $logid = dbInsert( $db, 'log', $cols);

    return ($logid);
}



//IP ermitteln
function getip()
{
    if (getenv("HTTP_X_FORWARDED_FOR")) {
        $realip   = getenv("HTTP_X_FORWARDED_FOR");
    } else {
        $realip   = getenv("REMOTE_ADDR");
    }
    return $realip;
}
