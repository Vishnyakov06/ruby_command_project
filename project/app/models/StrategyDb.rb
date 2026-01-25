require_relative 'backup_model/Booking_json'
require_relative 'backup_model/Client_json'
require_relative 'backup_model/Master_json'
require_relative 'backup_model/Service_json'
require_relative 'Booking'
require_relative 'Client'
require_relative 'Master'
require_relative 'Service'

class StrategyDb
    private_class_method :new
    @instance = :postgre
    @backup_filename = nil
    @path_to_backup_dir = Rails.root.join('backup', 'backup_jsons')

    class << self
        

        def toggle
            if @instance == :postgre
                @instance = :backup
            else 
                @instance = :postgre
            end
            puts("✅ instance: #{@instance}")
        end

        def Booking
            ensure_backup_loaded()
            case @instance
            when :postgre then ::Booking
            when :backup
                BookingJson.file_path = @backup_filename
                BookingJson
            end
        end

        def Client
            ensure_backup_loaded()
            case @instance
            when :postgre then ::Client
            when :backup
                ClientJson.file_path = @backup_filename
                ClientJson
            end
        end

        def Master
            ensure_backup_loaded()
            case @instance
            when :postgre then ::Master
            when :backup
                MasterJson.file_path = @backup_filename
                MasterJson
            end
        end

        def Service
            ensure_backup_loaded()
            case @instance
            when :postgre then ::Service
            when :backup
                ServiceJson.file_path = @backup_filename
                ServiceJson
            end
        end

        def set_specific_backup(filename)
            @backup_filename = filename
        end

        def set_last_backup
            backup_files = Dir.glob(File.join(@path_to_backup_dir, "*.json"))

            if backup_files.empty?
                @backup_filename = BeautySalonJsonBackup.new().create_backup()
                return 
            end

            filepath = backup_files.sort.last
            @backup_filename = File.basename(filepath, ".json")
        end

        def get_class_by_marker(marker)
            case marker
            when :booking then BookingJson
            when :master then MasterJson
            when :client then ClientJson
            when :service then ServiceJson
            end
        end

        def ensure_backup_loaded
            set_last_backup if @instance == :backup && @backup_filename.nil?
        end
    end
end