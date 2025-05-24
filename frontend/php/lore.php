<?php

function array_in_array($a1, $a2) {
    foreach ($a1 as $a) {
        if (in_array($a, $a2)) return true;
    }
    return false;
}

$files = [
    "katsis"    => "katsis.json",
    "energy"    => "energy.json",
    "god"       => "god.json",
    "time"      => "time.json"
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = explode(",", strtolower(file_get_contents('php://input')));
    $result = [];

    foreach ($files as $fName => $fPath) {
        $data = json_decode(file_get_contents("../lore/$fPath"), true);
        foreach ($data as $key => $value) {
            if (in_array($key, $input) || array_in_array($input, $value["aliases"])) {
                $d = $data[$key];
                $d["key"] = $key;
                $d["hash"] = sha1($key);
                $d["category"] = $fName;

                $links = [];
                foreach ($d["links"] as $l) {
                    array_push($links, sha1($l));
                }
                $d["links"] = $links;
                unset($d["aliases"]);

                array_push($result, $d);
            }
        }
    }

    if (count($result) === 0) {
        header("HTTP/1.1 400");
    } else {
        header('Content-type: application/json');
        echo json_encode($result);
    }
}
else header("HTTP/1.1 405");