My website

## Local installation

This repo doesn't really have vocation to be cloned, especially because of lore/ submodule being private

If you still want to do so you need to first install PHP dependencies `composer i` and javascript ones `npm i`, and then build `npm run build`

You can then move everything to your backend, here is an example of config under nginx
```nginx
server {
	root /home/example/main;

	index index.php;

	server_name example.org;

	location / {
		try_files $uri $uri/ =404;
	}

	location ~ \.php$ {
		include snippets/fastcgi-php.conf;
		fastcgi_pass unix:/run/php/php8.3-fpm.sock;
	}

	location ~ /vendor/ {
		deny all;
	}
	location ~ \.json$ {
		deny all;
	}
	location ~ \.db$ {
		deny all;
	}
}
```