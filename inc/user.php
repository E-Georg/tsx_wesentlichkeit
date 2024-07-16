<?php

/*******************************************************
 *  Userverwaltung
 * 
 *  23.01.2024  JM
 */
$keyStringLength = 30;
$keyStringLengthDoptin = 15;
$cookieName = 'quickcheck';
$cookieLiveTime = 60 * 60 * 24;            // 24h Lebensdauer des Cookies

$userKeyString = substr(getMyCookie($cookieName), 0,  $keyStringLength);
$query = "SELECT * FROM user where active = 1 and keyString = :keyString";
$cols = array('keyString' => $userKeyString);
$row = dbSelect($db, $query, $cols);

if (count($row) != 0)
    $userId = $row[0]['id'];
else
    $userId = 0;


function getMyCookie($name = '')
{
    if (!isset($_COOKIE[$name])) {
        return "";
    } else {
        return ($_COOKIE[$name]);
    }
}

/***********************************************************************************************************
 * zufälliger String erzeugen
 *  
 *  xx.01.24    JM
 */
function generateRandomString($length = 20)
{
//    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+-#_';

    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';                     // einfacher um als GET-Paramter nutzbar zu sein 

    $randomString = '';

    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, strlen($characters) - 1)];
    }

    return $randomString;
}

/***********************************************************************************************************
 * zufälliger Zahlencode erzeugen
 *  
 *  28.02.24    JM
 */
function generateRandomCode( $length = 6 )
{
    $characters = '123456789';                      
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $randomString;
}


function passwordHash($password)
{
    $algorithm = PASSWORD_BCRYPT;
    $options = ['cost' => 12];                                             // Wert 12 ist aktuell noch akzeptabel. > 12 verlangsamt die Funktion deutlich
    $hash = password_hash($password, $algorithm, $options);

    return ($hash);
}


/**************************************************************************
 *  na ja, ev. mal auf objektorientiert umstellen - ist eleganter
 * 
 *  09.04.24 JM
 */
function userProperty( $db, $id, $field, $table = 0 ): string
{
    $row = dbSelectId( $db, 'user', $id, $active = 1);                                              // User holen
    if ($row != false) {
        $userSubId = $row[ 'id' ];
    } else {
        return "";
    }   
    $row = dbSelectId( $db, 'usersub', $userSubId, $active = 1);                                    //zugehörige userSub holen

    $query = "SELECT id, $field,active FROM usersub WHERE active = 1 AND userid = :userSubId";      // gewünschtes Feld aus der UserSub holen
    $cols = array('userSubId' => $userSubId );
    $row = dbSelect($db, $query, $cols);
    if ($row != false) { 
        if( $table == 0 ) {                                                                         // falls einfaches Feld ( String, Zahl usw.)
            $string = $row[ 0 ][ $field ];                                                          // Inhalt erhalten 

            switch ( $field ) {
                case 'region':
                    $string = federalstate( $db, $row[ 0 ][ $field ] );
                    break;                
            }

        }
        else {                                                                                      // falls Feld auf Hilfstabelle zeigt
            $row = dbSelectId( $db, $table, $row[ 0 ][ $field ] );                                  // Feldinhalt aus Hilfstabelle holen
            if ($row != false) {                                                                    
                $string = $row[ 'text' ];                                                           // Feldinhalt zurückgeben
            } else {
                return "";
            }
        }
    } else {
        $string = "";
    }
    return( $string );
}

function userName($db, $id): string
{
    $row = dbSelectId( $db, 'user', $id, $active = 1);                      // TODO jm - könnte man noch eleganter machen - mit join
    if ($row != false) {
        $userSubId = $row[ 'id' ];
    } else {
        return "";
    }
    $row = dbSelectId( $db, 'usersub', $userSubId, $active = 1);

    $query = "SELECT id, firstName, lastName, active FROM usersub WHERE active = 1 AND userid = :userSubId";
    $cols = array('userSubId' => $userSubId );
    $row = dbSelect($db, $query, $cols);

    if ($row != false) { 
        $name = $row[ 0 ]['firstName'] . " " . $row[ 0 ]['lastName'];
    } else {
        $name = "";
    }


    return( $name );
}

function userMail($db, $id): string
{
    $row = dbSelectId( $db, 'user', $id, $active = 1);                      // TODO jm - könnte man noch eleganter machen - mit join
    if ($row != false) {
        $userMail = $row[ 'mail' ];
    } else {
        return "";
    }
    return( $userMail );
}

function userIdByKey( $db, $userKey ) {

    $query = "SELECT id FROM user WHERE active = 1 AND keyString = :userKey";
    $cols = array('userKey' => $userKey );
    $row = dbSelect($db, $query, $cols);

    if ($row != false ) {
        return $row[ 0 ][ 'id' ];
    } else {
        return 0;
    }
}


function userRoll( $db, $id ) {
    $row = dbSelectId($db, 'userroll', $id, $active = 1);
    if ($row != false) {
        return $row['text'];
    } else {
        return "";
    }
}



/***********************************************************************************************************
 * rollenbasierende Rechteverwaltung
 * 
 *  25.01.24    JM
 * 
 *  $userId             User-Id
 *  $userSpace          Id des Userspace
 *  
 *  0   keine Rechte
 *  1   Userrecht erteilt
 *  -1  kein Eintrag für diesen Userspace => Rechte unbestimmt
 * 
 */
function userRights($db, $userId, $userSpace)
{
    // TODO  JM Debugausgaben entfernen

//echo $userId . "<p>";

 //echo "Userspace: " . $userSpace;
 //echo "<p>";

    $userRight = 0;                                                                                        // mit "keine Rechte vorbelegt 

    $row = dbSelectId($db, 'user', $userId);
    if ($row == FALSE)
        $userRollId = 0;
    else
        $userRollId = $row['userRollId'];

//     echo "Nutzerrolle: " . $userRollId;
//     echo "<p>";

    $cols = array();
    $cols['userItem'] = $userSpace;

    $query = 'SELECT * FROM `userspace` WHERE active = 1 AND userItem = :userItem';
    $row = dbSelect($db, $query, $cols);

//ar( $row );

    if (count($row) > 0)
        $userSpaceId = $row[0]['id'];
    else {
        return (-1);                                                                                        // kein Eintrag für diesen Userspace => Rechte unbestimmt
    }
    $cols = array();
    $cols['userRollId'] = $userRollId;
    $cols['userSpaceId'] = $userSpaceId;
    $query = 'SELECT * FROM `userrollspace` WHERE active = 1 AND userRollId = :userRollId AND userSpaceId = :userSpaceId';

    $row = dbSelect($db, $query, $cols);

    if( count($row) > 0 )
        $userRight = 1;                                                                                        // Rechte erteilt

    return ( $userRight ); //0 oder 1
}




/***********************************************************************************************************
 * Passwort neu setzen
 * 
 *  28.02.24    JM
 * 
 *  $userId             User-Id
 * 
 */
function userLastAktivity( $db, $id ) {

    $cols = array();
    $cols['userId'] = $id;
    $query = 'SELECT * FROM `log` WHERE userid = :userId ORDER BY id DESC LIMIT 0,1';
    $row = dbSelect($db, $query, $cols);

    if( isset( $row[ 0 ][ "zeit" ] ) )
        $date = datum( $row[ 0 ][ "zeit" ], 3 );
    else
        $date = "";

return( $date );

}


/***********************************************************************************************************
 * Mail für Passwort setzen
 * 
 *  28.02.24    JM
 * 
 *  $email      Zielmail
 *  $code       Code
 */
function passwordNewMail( $db, $email ) {

    $query = "SELECT * FROM user WHERE active = 1 AND mail = :mail";
    $cols = array();
    $cols['mail'] = $email;
    $row = dbSelect($db, $query, $cols);
    if (count($row) > 0)
        $row = $row[0];
    if (count($row) >= 1) {
        $pwRecoveryUserId = $row[ 'id' ];

        $email = $row[ "mail" ];
        $name = userName( $db, $row[ "id" ] );

        $code = generateRandomCode( 6 );

        $cols = array(); 
        $cols['pwRecoveryCode'] = $code;
        $cols['pwRecoveryTimestamp'] = time();
        dbUpdate($db, 'user',  $pwRecoveryUserId, $cols);
        
        include('mail.php');

        $vonMail = $mailServer[ $mailServerZeiger ][ 'vonMail' ];
        $vonName = $mailServer[ $mailServerZeiger ][ 'vonName' ];

        $replyMail = $mailServer[ $mailServerZeiger ][ 'replyMail' ];
        $replyName = $mailServer[ $mailServerZeiger ][ 'replyName' ];

        $anName = $name;
        $anMail = $email;

        $row = dbSelectId($db, 'mail', 2, $active = 1);

        $betreff = $row["subject"];
        $text = $row["text"];

        $text = str_replace('[code]', $code, $text);

        $ergebnis = mailSend($anMail, $anName, $vonMail, $vonName, $replyMail, $replyName, $betreff, $text, $mailServer[$mailServerZeiger]);
        $flag = 1;
    }
    else
        $flag = 0;

    return( $flag );
}