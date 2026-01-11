set -e

DB_USER="salon_user"
DB_PASSWORD="salon_password"
DB_DEV="beauty_salon_db"
DB_TEST="beauty_salon_test"

echo "Создание пользователя и прав..."
sudo -u postgres psql <<EOF
DO \$\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${DB_USER}') THEN
      CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';
   END IF;
END
\$\$;

ALTER USER ${DB_USER} CREATEDB;
EOF

echo "Создание базы development..."
if ! sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw "${DB_DEV}"; then
  sudo -u postgres createdb -O ${DB_USER} ${DB_DEV}
else
  echo "База ${DB_DEV} уже существует, пропускаем"
fi

echo "Создание базы test..."
if ! sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw "${DB_TEST}"; then
  sudo -u postgres createdb -O ${DB_USER} ${DB_TEST}
else
  echo "База ${DB_TEST} уже существует, пропускаем"
fi

echo "PostgreSQL пользователь и базы готовы"