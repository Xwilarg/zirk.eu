<?php

require_once "vendor/autoload.php";

use Twig\Loader\FilesystemLoader;
use Twig\Environment;

$loader = new FilesystemLoader(["templates"]);
$twig = new Environment($loader);

# Display page
echo $twig->render("index.html.twig", [
    "header" => [
        "name" => "Zirk"
    ]
]);