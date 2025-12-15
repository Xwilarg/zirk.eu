#!/usr/bin/env bash

set -e

echo "Gamejam images"
mkdir -p ../public/data/img/gamejam
cd ../data/img/gamejam
mogrify -resize "315x250^" -path "../../../public/data/img/gamejam/" *.png;
mogrify -resize "315x250^" -path "../../../public/data/img/gamejam/" *.jpg;
for f in *.gif; do
    gifsicle -i "$f" -O3 --colors 256 -o "../../../public/data/img/gamejam/$f"
done
cd -