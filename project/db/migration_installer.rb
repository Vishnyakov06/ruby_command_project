class MigrationInstaller
    MIGRATIONS_DIR = File.join(__dir__, "../db/migrations")
    SEEDS_DIR = File.join(__dir__, "../db/seeds")

    def self.setup_database(db)
        ensure_schema_migrations_table(db)
        run_migrations(db)
        run_seeds(db)
    end

    def self.ensure_schema_migrations_table(db)
        db.exec(
            "CREATE TABLE IF NOT EXISTS schema_migrations (
                version TEXT PRIMARY KEY
            );"
        )
    end

    def self.run_migrations(db)
        applied_versions = fetch_applied_versions(db)
        migration_files.each do |file|
            version = File.basename(file, ".sql")
            next if applied_versions.include?(version)
            db.transaction do |connection|
                connection.exec(File.read(file))
                connection.exec(
                    "INSERT INTO schema_migrations (version) VALUES ($1)",
                    [version]
                )
            end
        end
    end

    def self.fetch_applied_versions(db)
        result = db.exec("SELECT version FROM schema_migrations")
        result.map { |row| row["version"] }
    end

    def self.run_seeds(db)
        seed_files.each do |file|
            db.transaction do |connection|
                connection.exec(File.read(file))
            end
        end
    end

    def self.migration_files
        Dir[File.join(MIGRATIONS_DIR, "*.sql")].sort
    end

    def self.seed_files
        Dir[File.join(SEEDS_DIR, "*.sql")].sort
    end
end