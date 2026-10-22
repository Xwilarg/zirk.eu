#!/bin/bash
set -e
shopt -s nullglob

echo "Gamejam GIFs"
mkdir -p ../public/data/img/gamejam
out_root="$(cd ../public/data/img/gamejam && pwd)"

cd ../../data/img/gamejam

for gif in *.gif; do
    base="${gif%.gif}"
    tmp="$out_root/$gif"
 
    gifsicle -i "$gif" --resize-height 250 --lossy=80 -O3 --colors 128 -o "$tmp"
    convert "$tmp" -coalesce "$out_root/$base.webp"
    rm "$tmp"
done