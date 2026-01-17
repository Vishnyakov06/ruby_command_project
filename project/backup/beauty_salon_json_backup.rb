require_relative '../db/migration_installer'
require_relative '../config/DB_CONFIG'
require 'json'

class BeautySalonJsonBackup
    
    def initialize
        @path_to_backup_dir = Rails.root.join('backup', 'backup_jsons')
        @backup_data = {}

    end

    def create_backup()
        
        backup_data = {
            clients: Client.all.map(&:attributes),
            masters: Master.all.map(&:attributes),
            services: Service.all.map do |service|
                attrs = service.attributes
                attrs['duration'] = service.duration.to_i if service.duration
                attrs
            end,
            bookings: Booking.all.map(&:attributes)
        }

        timestamp = Time.now.strftime("%Y-%m-%d_%H-%M-%S")
        filename = "backup_#{timestamp}.json"
        filepath = File.join(@path_to_backup_dir, filename)

        File.write(filepath, JSON.pretty_generate(backup_data))

        filepath
    end

    def restore_backup(filename = nil)

        if filename
            filepath = File.join(@path_to_backup_dir, filename.to_s)
        
            unless File.exist?(full_path)
                raise ArgumentError, "Файл '#{filename}' не найден в директории '#{@path_to_backup_dir}'"
            end
        else
            backup_files = Dir.glob(File.join(@path_to_backup_dir, "*.json"))

            if backup_files.empty?
                puts "Нет файлов бэкапа!"
                return
            end

            filepath = backup_files.sort.last
        end

        backup_data = JSON.parse(File.read(filepath))

        begin
            Booking.delete_all
            Client.delete_all
            Master.delete_all
            Service.delete_all

            {
                clients: Client,
                masters: Master,
                services: Service,
                bookings: Booking
            }.each do |key, model|
                backup_data[key.to_s].each do |record_data|
                    model.create!(record_data)
                end
            end

            puts "Восстановление завершено"
            true
        rescue => error
            puts "Ошибка при восстановлении: #{error.message}"
            false
        end
    end

    def list_backups
        backup_files = Dir.glob(File.join(@path_to_backup_dir, "*.json"))
    
        if backup_files.empty?
            puts "Нет бэкапов."
        else
            puts "Доступные бэкапы:"
            backup_files.sort.reverse.each do |file|
                puts "  #{File.basename(file)} (создан: #{File.mtime(file)})"
            end
        end
    end

end