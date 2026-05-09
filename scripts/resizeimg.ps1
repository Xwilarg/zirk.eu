$ErrorActionPreference = "Stop"

Write-Output "Gamejam images"
New-Item -ItemType Directory -Force -Path ../public/data/img/gamejam
Push-Location -Path  ../data/img/gamejam
magick mogrify -resize "315x250^" -path "../../../public/data/img/gamejam/" *.png;
magick mogrify -resize "315x250^" -path "../../../public/data/img/gamejam/" *.jpg;
Pop-Location