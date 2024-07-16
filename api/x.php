<?php

error_reporting(E_ALL);

// Fehler auf dem Bildschirm anzeigen
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

/*
$servername = "192.168.20.61";
$username = "admin";
$password = "georg";
$database = "device-manager";
*/

$servername = "192.168.20.53";
$username = "root";
$password = "dl3sdn";
$database = "quickcheck";


// Verbindung herstellen
$conn = new mysqli($servername, $username, $password, $database);

// Verbindung überprüfen
if ($conn->connect_error) {
    die("Verbindung fehlgeschlagen: " . $conn->connect_error);
}
echo "Verbindung erfolgreich";

// Verbindung schließen (optional)
$conn->close();


?>


xxx