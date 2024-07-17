<?php

/**
 * Escape
 * Convert special characters to HTML entities
 */
function e($html)
{
    return htmlspecialchars($html, ENT_QUOTES, 'UTF-8', true);
}


/**
 * Adjusted the current file path to load correctly
 */
function actPath(): string
{
    // TODO JM  Achtung: an dieser Stelle unterscheidet sich der Code auf dem Weberserver zu dem auf den WAMP-Entwicklungsrechnern!
    global $path;
    $path = "/wa/";
    //   $path = '/nachhaltigkeit/';
    return ($path);
}


//* nur ein Werkzeug:
function ar($ar)
{
    echo "<pre>";
    print_r($ar);
    echo "</pre>";
}

/**
 * Gibt mir das aktuelle Datum im deutschen format zurück
 */
function getCurrentDate(): string
{    // Das Format für das Datum festlegen
    $format = 'd.m.Y';
    $aktuellesDatum = date($format);
    return $aktuellesDatum;
}
