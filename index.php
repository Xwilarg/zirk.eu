<?php
require_once "vendor/autoload.php";

use Twig\Loader\FilesystemLoader;
use Twig\Environment;

$loader = new FilesystemLoader(["templates"]);
$twig = new Environment($loader);

$nsfw = isset($_GET["s"]) && $_GET["s"] === "0";
$fullSfw = isset($_GET["s"]) && $_GET["s"] === "2";

// Gamejams
$jamData = array();
$locations = array();
$engines = array();
$events = array();
$languages = array();
$people = array();
$data = json_decode(file_get_contents("data/json/gamejam.json"), true);
$jamParticipants = $data["people"];
foreach ($data["jams"] as $jam) {
    $tmp = explode(",", $jam["location"]);
    $location = trim(end($tmp));
    if (isset($locations[$location])) {
        $locations[$location]++;
    } else {
        $locations[$location] = 1;
    }
    if (isset($engines[$jam["engine"]])) {
        $engines[$jam["engine"]]++;
    } else {
        $engines[$jam["engine"]] = 1;
    }
    if (!$jam["nsfw"] || ($nsfw && $jam["nsfw"])) {
        if (isset($events[$jam["shortEvent"]])) {
            $events[$jam["shortEvent"]]++;
        } else {
            $events[$jam["shortEvent"]] = 1;
        }
    }
    foreach ($jam["language"] as $l) {
        if (isset($languages[$l])) {
            $languages[$l]++;
        } else {
            $languages[$l] = 1;
        }
    }

    // Replace team people by their name
    $currTeam = [];
    foreach ($jam["team"] as $t) {
        if ($t === "D35298FE0A5D34C1A0DB4D02E00BD1F1") {
            continue;
        }
        if (isset($jamParticipants[$t])) {
            $t = $jamParticipants[$t]["name"];
        }
        array_push($currTeam, $t);
    }

    // Add team people at the list of people
    foreach ($currTeam as $t) {
        if (isset($people[$t])) {
            $people[$t]++;
        } else {
            $people[$t] = 1;
        }
    }
    $overall = 0;
    $entries = 0;
    if ($jam["rating"] !== null && $jam["rating"]["scores"] !== null && array_key_exists("Overall", $jam["rating"]["scores"]) && $jam["rating"]["scores"]["Overall"]["rank"] !== null) {
        $overall = $jam["rating"]["scores"]["Overall"]["rank"];
        $entries = $jam["rating"]["entriesRated"] === null ? $jam["rating"]["entries"] : $jam["rating"]["entriesRated"];
    }

    $imagePath = "data/img/gamejam/" . $jam["name"] . "." . (array_key_exists("format", $jam) ? $jam["format"] : "jpg");
    $gifPath = "data/img/gamejam/" . $jam["name"] . ".gif";
    array_push($jamData, [
        "name" => $jam["fullName"],
        "image" => file_exists($imagePath) ? $imagePath : null,
        "gif" => file_exists($gifPath) && ($nsfw || !$jam["nsfw"]) ? $gifPath : null,
        "event" => $jam["event"],
        "shortEvent" => $jam["shortEvent"],
        "eventCategory" => $jam["eventCategory"],
        "date" => $jam["date"],
        "duration" => $jam["duration"],
        "location" => $location,
        "engine" => $jam["engine"],
        "theme" => count($jam["theme"]) > 0 ? $jam["theme"][0] : null,
        "overall" => $overall,
        "team" => $currTeam,
        "entries" => $entries,
        "website" => (!$nsfw && $jam["nsfw"]) ? null : $jam["website"],
        "source" => (!$nsfw && $jam["nsfw"])? null : $jam["github"],
        "webgl" => (!$nsfw && $jam["nsfw"]) || count($jam["webgl"]) == 0 ? null : $jam["webgl"][0],
        "entriesTotal" => ($jam["rating"] === null || $jam["rating"]["entries"] === null) ? -1 : $jam["rating"]["entries"],
        "score" => $overall === 0 || $entries == 0 ? 1
            : ($overall / $entries),
        "gifPosOverrides" => isset($jam["gifPosOverrides"]) ? $jam["gifPosOverrides"] : null,
        "imagePosOverrides" => isset($jam["imagePosOverrides"]) ? $jam["imagePosOverrides"] : null,
        "nsfw" => $jam["nsfw"]
    ]);
}
arsort($locations);
arsort($engines);
arsort($events);
arsort($languages);
arsort($people);

$db = new SQLite3('lifeline/lifeline.db');

$lifelines = [];
$results = $db->query("SELECT name, id, lastInsert FROM lifelines");
while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
    array_push($lifelines, $row);
}

echo $twig->render("index.html.twig", [
    "jams" => [
        "data" => $jamData,
        "locations" => $locations,
        "engines" => $engines,
        "events" => $events,
        "languages" => $languages,
        "people" => $people
    ],
    "nsfw" => $nsfw,
    "fullSfw" => $fullSfw,
    "home" => json_decode(file_get_contents("data/json/home.json"), true),
    "projects" => json_decode(file_get_contents("data/json/projects.json"), true),
    "analyticsKey" => json_decode(file_get_contents("data/json/analytics.json"), true)["key"],
    "lifelines" => $lifelines
]);