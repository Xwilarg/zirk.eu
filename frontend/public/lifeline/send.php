<?php
$db = new SQLite3('lifeline.db');

$results = $db->query("SELECT target, token, name, path from lifelines");

$rows = [];
while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
    array_push($rows, [
        'token' => $row["token"],
        'target' => $row["target"],
        'name' => $row["name"],
        'path' => $row["path"]
    ]);
}

$finalRes = array();
foreach ($rows as $row) {
    $id = uniqid(rand(), true);

    $post = [
        'token' => $row["token"],
        'id' => $id,
        'data' => $row["path"] == NULL ? NULL : file_get_contents($row["path"])
    ];
    
    $ch = curl_init($row["target"]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
    curl_setopt($ch, CURLOPT_HEADER, true);  
    
    $res = curl_exec($ch);
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);

    if ($httpcode === 200) {
        $body = substr($res, $header_size);
        $answerId = $id;
    } else if ($httpcode === 204) {
        $body = NULL;
        $answerId = $id;
    } else {
        $body = NULL;
        $answerId = NULL;
    }

    $q = $db->prepare("UPDATE lifelines set id = ?, lastInsert = CURRENT_TIMESTAMP, data = ? where token = ?");
    $q->bindValue(1, $answerId);
    $q->bindValue(2, $body);
    $q->bindValue(3, $row["token"]);
    $results = $q->execute();
    
    curl_close($ch);

    $finalRes[$row["name"]] = [
        "id" => $answerId,
        "data" => $body === NULL ? NULL : json_decode($body)
    ];
}

header('Content-type: application/json');
echo json_encode($finalRes);