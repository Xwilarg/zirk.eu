<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = strtolower(file_get_contents('php://input'));
    $data = json_decode(file_get_contents("../lore/data.json"), true);

    $ok = false;
    foreach ($data as $key => $value) {
        if ($key === $input || in_array($input, $value["aliases"])) {
        header('Content-type: application/json');
        $d = $data[$key];
        $d["hash"] = sha1($key);

        $links = [];
        foreach ($d["links"] as $l) {
            array_push($links, sha1($l));
        }
        $d["links"] = $links;
        unset($d["aliases"]);

        echo json_encode($d);

            $ok = true;
            break;
        }
    }

    if (!$ok) {
        header("HTTP/1.1 400");
    }
}
else header("HTTP/1.1 405");