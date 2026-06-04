$ErrorActionPreference = "Stop"

Write-Output "OCs images"
New-Item -ItemType Directory -Force -Path ../public/data/previews/ocs
Push-Location -Path  ../data/img/ocs

Get-ChildItem * |
Foreach-Object {
    Push-Location $_
    New-Item -ItemType Directory -Force -Path ../../public/data/previews/ocs/$_

    magick mogrify -resize "315x400^" -path "../../../public/data/previews/ocs/$_" *.png;
    magick mogrify -resize "315x400^" -path "../../../public/data/previews/ocs/$_" *.jpg;

    Pop-Location
}

Pop-Location