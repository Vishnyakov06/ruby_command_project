require_relative '../db/migration_installer'
require_relative '../config/DB_CONFIG'
require 'json'

class BeautySalonJsonBackup
    
    def initialize
        @path_to_backup_dir = Rails.root.join('backup', 'backup_jsons')
        @backup_data = {}

    end

    def create_backup()
        begin
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
            
            filename
        rescue => error
            puts "Ошибка при восстановлении: #{error.message}"
            false
        end
    end

    def restore_backup(filename = nil)

        if filename
            filepath = File.join(@path_to_backup_dir, filename.to_s + '.json')

            puts("======> #{filepath}")
        
            unless File.exist?(filepath)
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
            ActiveRecord::Base.transaction do
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
                        record = model.new(record_data)
                        record.save!(validate: false)
                    end
                end
                puts "Восстановление завершено"
                true
            end 
        rescue => error
            puts "Ошибка при восстановлении: #{error.message}"
            false
        end
    end

    def list_backups
        backup_files = Dir.glob(File.join(@path_to_backup_dir, "*.json"))
    
        if backup_files.empty?
            false
        else
            return backup_files.sort.reverse.map do |file|
                {
                    filename: File.basename(file),
                    size: File.size(file)
                }
            end
        end
    end

end