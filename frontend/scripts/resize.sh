#!/usr/bin/env bash

set -e

echo "Gamejam images"
mkdir -p ../img/gamejam
cd ../data/img/gamejam
magick mogrify -resize "500x400>" -path "../../../img/gamejam/" *.png;
magick mogrify -resize "500x400>" -path "../../../img/gamejam/" *.jpg;
cd -

echo "Home images"
mkdir -p ../img/home
cd ../data/img/home
magick mogrify -resize "445x250>" -path "../../../img/home/" *.png;
cd -

echo "Projects images"
mkdir -p ../img/projects
cd ../data/img/projects
magick mogrify -resize "376x270>" -path "../../../img/projects/" *.png;
cd -

echo "Projects (old) images"
mkdir -p ../img/projects-old
cd ../data/img/projects-old
magick mogrify -resize "376x270>" -path "../../../img/projects-old/" *.png;
cd -