# Autopark web app
### Functions:
- personal account (authorization, checklist of driver)
- auto-send email to manager
- control of drivers

## Create MySQL database:
`
CREATE TABLE users (
id int(10) unsigned NOT NULL AUTO_INCREMENT,
name varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
email varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
password varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
admin tinyint(1) default 0,
PRIMARY KEY (id),
UNIQUE KEY email (email)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`
