My website

## Local installation

This repo doesn't really have vocation to be cloned, especially because of lore/ submodule being private

### Frontend

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

### Backend

Add the link to websockets
```nginx
location /ws {
	proxy_pass http://localhost:5165;
	proxy_http_version          1.1;
	proxy_set_header Upgrade    $http_upgrade;
	proxy_set_header Connection "upgrade";
}
```