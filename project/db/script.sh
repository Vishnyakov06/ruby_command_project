
#создания пользователя и бд
sudo -u postgres psql <<EOF
CREATE USER salon_user WITH PASSWORD 'salon_password';
ALTER USER salon_user CREATEDB;
EOF

sudo -u postgres createdb -O salon_user beauty_salon_db


#для входа в бд и проверки наличия содержимого
sudo -u postgres psql
psql -U salon_user -d beauty_salon_db -h localhost
\c beauty_salon_db
\dt