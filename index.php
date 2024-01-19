<?php

require_once "vendor/autoload.php";

use Twig\Loader\FilesystemLoader;
use Twig\Environment;
use Twig\TwigFilter;

$loader = new FilesystemLoader(["templates"]);
$twig = new Environment($loader);

# Display page
echo $twig->render("index.html.twig", []);