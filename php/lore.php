<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $key = strtolower(file_get_contents('php://input'));
    $data = json_decode(file_get_contents("../lore/data.json"), true);
    if (array_key_exists($key, $data)) {
        header('Content-type: application/json');
        $d = $data[$key];
        $d["hash"] = sha1($key);

        $links = [];
        foreach ($d["links"] as $l) {
            array_push($links, sha1($l));
        }
        $d["links"] = $links;

        echo json_encode($d);
    }
    else header("HTTP/1.1 400");
}
else header("HTTP/1.1 405");