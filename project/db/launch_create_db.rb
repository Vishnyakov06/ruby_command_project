require_relative 'migration_installer'
require_relative '../config/DB_CONFIG'
MigrationInstaller.setup_database(**DB_CONFIG)