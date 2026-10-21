<?php

$db = new SQLite3('lifeline.db');

$lifelines = [];
$results = $db->query("SELECT name, id, lastInsert, data FROM lifelines");
while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
    array_push($lifelines, $row);
}

header('Content-type: application/json');
echo json_encode($lifelines);