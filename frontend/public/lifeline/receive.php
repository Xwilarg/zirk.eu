<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (isset($_POST["id"]) && isset($_POST["token"])) {
        $db = new SQLite3('lifeline.db');
    
        $q = $db->prepare("UPDATE lifelines set id = ?, lastInsert = CURRENT_TIMESTAMP, data = ? where token = ?");
        $q->bindValue(1, $_POST["id"]);
        $q->bindValue(2, isset($_POST["data"]) ? $_POST["data"] : NULL);
        $q->bindValue(3, $_POST["token"]);
        $results = $q->execute();
        if (!$results) {
            header("HTTP/1.1 400");
        } else {
            if ($db->changes() > 0) {
                $q = $db->prepare("SELECT path FROM lifelines WHERE token = ?");
                $q->bindValue(1, $_POST["token"]);
                $results = $q->execute();
                $path = $results->fetchArray(SQLITE3_ASSOC)["path"];
                if ($path === NULL) header("HTTP/1.1 204");
                else echo file_get_contents($path);
            } else {
                header("HTTP/1.1 403");
            }
        }

    } else header("HTTP/1.1 400");
}
else header("HTTP/1.1 405");