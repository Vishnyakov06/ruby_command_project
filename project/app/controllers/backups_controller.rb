require_relative '../../backup/beauty_salon_json_backup'

class BackupsController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :set_backup_obj
    
    def index
        backups = @backup_service.list_backups
        
        if backups
            render json: {
                success: true,
                backups: backups,
                count: backups.count
            }
        else
            render json: {
                success: false,
                message: "Нет доступных бэкапов",
                backups: []
            }
        end
    end
    
    def create
        filename = @backup_service.create_backup
        
        if filename            
            render json: {
                success: true,
                message: "Бэкап успешно создан",
                backup: filename
            }, status: :created
        else
            render json: {
                success: false,
                error: "Не удалось создать бэкап"
            }, status: :unprocessable_entity
        end
    end
    
    def restore
        success = @backup_service.restore_backup
        
        make_json_response(success)
    end
    
    def restore_specific
        success = @backup_service.restore_backup(params[:filename])
        
        make_json_response(success, params[:filename])
    end
    

    private
    
    def set_backup_obj
        @backup_service = BeautySalonJsonBackup.new
    end

    def make_json_response(success, backup_name = '')
        if success
            render json: {
                success: true,
                message: "База данных восстановлена из #{"последнего" if backup_name == ''} бэкапа #{backup_name}"
            }
        else
            render json: {
                success: false,
                error: "Не удалось восстановить базу данных из бэкапа #{backup_name}"
            }, status: :unprocessable_entity
        end
    end
end