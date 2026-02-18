$ErrorActionPreference = "Stop"

New-Item -ItemType Directory -Force -Path ../public/data/img/
New-Item -ItemType Directory -Force -Path ../public/data/old/projects-old/
New-Item -ItemType Directory -Force -Path ../public/gamejam/
Copy-Item -Path ../data/img/about/ -Destination ../public/data/img/ -Recurse -Force
Copy-Item -Path ../data/img/boxes/ -Destination ../public/data/img/ -Recurse -Force
Copy-Item -Path ../data/img/projects/ -Destination ../public/data/img/ -Recurse -Force
Copy-Item -Path ../data/img/sheep/ -Destination ../public/data/img/ -Recurse -Force
Copy-Item -Path ../data/img/steam/ -Destination ../public/data/img/ -Recurse -Force
Copy-Item -Path ../data/img/website/ -Destination ../public/data/img/ -Recurse -Force
Copy-Item -Path ../gamejam -Destination ../public/ -Recurse -Force
Copy-Item -Path ../data/old/projects-old/ -Destination ../public/data/old/projects-old/ -Recurse -Force