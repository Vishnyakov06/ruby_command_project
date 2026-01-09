# Правила для названий файлов, методов, классов, веток

**Файлы:** Называем в виде *snake_case*, никаких заглавных букв. Например: migration_installer_postgres.rb

**Методы:** Называем в виде *snake_case*, никаких заглавных букв. Например: def migration_installer_postgres(params) {...} end

**Классы:** Называем в виде *CamelCase*. Например, class MigrationInstallerPostgres

**Модуль:** Называем в виде *CamelCase*. Например, module MigrationInstallerPostgres

**Ветки:** Называем в виде *kebab-case*. Например, migration-installer-postgres

**Уточнения:**
- классы необходимо именовать в соответствии с названием файла: файл: migration_installer_postgres.rb $\Leftrightarrow$ класс: class MigrationInstallerPostgres

# Инструкция по запуску Swagger
1. Запускаем команду bin/rails s из корня, то есть из ruby_command_project/project
2. Открываем именно "http://localhost:3000" НЕ "http://127.0.0.1:3000", а тот, которые написан
3. Дописываем к адресу "/api-docs"
