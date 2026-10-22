#!/bin/bash
set -e
shopt -s nullglob

echo "Gamejam images"
mkdir -p ../public/data/img/gamejam
out_root="$(cd ../public/data/img/gamejam && pwd)"

cd ../../data/img/gamejam
images=(*.png *.jpg)
if (( ${#images[@]} )); then
    mogrify -resize "315x250^" -path "$out_root/" "${images[@]}"
fi