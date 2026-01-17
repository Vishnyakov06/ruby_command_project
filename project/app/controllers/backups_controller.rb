class BackupsController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :set_backup_obj
    
    def index
        backups = backup_service.list_backups
        
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
        filename = backup_service.create_backup
        
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
        success = backup_service.restore_backup
        
        if success
            render json: {
                success: true,
                message: "База данных успешно восстановлена из последнего бэкапа"
            }
        else
            render json: {
                success: false,
                error: "Не удалось восстановить базу данных"
            }, status: :unprocessable_entity
        end
    end
    
    # POST /backups/:filename/restore - восстановить из конкретного бэкапа
    def restore_specific
        success = backup_service.restore_backup(params[:filename])
        
        if success
            render json: {
                success: true,
                message: "База данных восстановлена из бэкапа #{params[:filename]}"
            }
        else
            render json: {
                success: false,
                error: "Не удалось восстановить из бэкапа #{params[:filename]}"
            }, status: :unprocessable_entity
        end
    end
    

    private
    
    def set_backup_obj
        backup_service = BeautySalonJsonBackup.new
    end
end