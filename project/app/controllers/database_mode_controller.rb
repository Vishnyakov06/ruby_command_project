class DatabaseModeController < ApplicationController
    skip_before_action :verify_authenticity_token
    
    def update
        StrategyDb.toggle
        
        render json: { 
            success: true, 
            mode: StrategyDb.instance_variable_get(:@instance).to_s 
        }
    end

    def set_file_name
        if params[:backup_file].present?
            StrategyDb.set_specific_backup(params[:backup_file])
            render json: { 
                success: true, 
                message: "Выбран файл бэкапа: #{params[:backup_file]}" 
            }
        else
            render json: { 
                success: false, 
                error: "Не указано имя файла бэкапа" 
            }, status: :unprocessable_entity
        end
    end
end