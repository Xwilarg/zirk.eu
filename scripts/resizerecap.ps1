$ErrorActionPreference = "Stop"

Write-Output "Recaps images"
New-Item -ItemType Directory -Force -Path ../public/data/previews/recap
Push-Location -Path  ../data/img/recap

magick mogrify -resize "483x350^" -path "../../../public/data/previews/recap" *.png