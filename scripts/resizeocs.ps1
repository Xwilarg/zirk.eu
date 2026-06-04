$ErrorActionPreference = "Stop"

Write-Output "OCs images"
New-Item -ItemType Directory -Force -Path ../public/data/previews/ocs
Push-Location -Path  ../data/img/ocs

Get-ChildItem * |
Foreach-Object {
    Push-Location $($_.Name)
    New-Item -ItemType Directory -Force -Path ../../../../public/data/previews/ocs/$($_.Name)

    magick mogrify -resize "315x400^" -path "../../../../public/data/previews/ocs/$($_.Name)" *.png;
    magick mogrify -resize "315x400^" -path "../../../../public/data/previews/ocs/$($_.Name)" *.jpg;
    Copy-Item *.gif -Destination "../../../../public/data/previews/ocs/$($_.Name)"
    Copy-Item *.mp4 -Destination "../../../../public/data/previews/ocs/$($_.Name)"

    Pop-Location
}

Pop-Location