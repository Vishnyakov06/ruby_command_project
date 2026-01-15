require 'json'

class BeautySalonJsonBackup
    
    def initialize(database)
        @database = database
        @path_to_migrations_dir = '../db/migrations/*.sql'
        @path_to_jsons_dir = 'jsons/'
        @tables = {}
    end

    def create_backup()
        extract_tables_name()
        @tables.each do |migration_number, table_name|
            filename = create_file_name(migration_number, table_name)
            data = get_data(table_name)
            write_into_json(filename, data)
        end
    end

    def extract_tables_name() 
        sql_files = Dir.glob(@path_to_migrations_dir)
        sql_files.each do |file_path|
            filename = File.basename(file_path, '.sql')
            
            if match = filename.match(/^(\d+)_create_(.+)$/)
                migration_number = match[1]
                table_name = match[2]
                next if migration_number == '000'
                
                @tables[migration_number] = table_name
            end
        end
    end

    def get_data(table_name)
        data = @database.execute("SELECT * FROM #{table_name}")
    end

    def write_into_json(filepath, data)
        File.write(filepath, JSON.pretty_generate(data))
    end

     def create_file_name(migration_number, table_name)
        filename = "#{migration_number}_backup_#{table_name}.json"
        filepath = File.join(@path_to_jsons_dir, filename)
     end
        
end