<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $key = strtolower(file_get_contents('php://input'));
    $data = json_decode(file_get_contents("../lore/data.json"), true);
    if (array_key_exists($key, $data)) {
        echo implode("\n", $data[$key]["data"]);
    }
    else header("HTTP/1.1 400");
}
else header("HTTP/1.1 405");