#!/bin/bash
set -e
shopt -s nullglob

echo "OCs images"
mkdir -p ../public/data/previews/ocs
out_root="$(cd ../public/data/previews/ocs && pwd)"

cd ../../data/img/ocs

for dir in */; do
    name="${dir%/}"
    out="$out_root/$name"
    mkdir -p "$out"

    if [[ "$name" == "fish" ]]; then
        cp "$dir"* "$out"
    else
        images=("$dir"*.png "$dir"*.jpg)
        if (( ${#images[@]} )); then
            mogrify -resize "315x400^" -path "$out" "${images[@]}"
        fi
 
        media=("$dir"*.gif "$dir"*.mp4)
        if (( ${#media[@]} )); then
            cp "${media[@]}" "$out/"
        fi
    fi
done
