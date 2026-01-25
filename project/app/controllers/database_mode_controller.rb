class DatabaseModeController < ApplicationController
    skip_before_action :verify_authenticity_token
    
    def update
        StrategyDb.toggle
        puts("🍋‍🟩 Alles gut")
        render json: { 
            success: true, 
            mode: StrategyDb.instance_variable_get(:@instance).to_s 
        }
    end

    def set_file_name
        if params[:filename].present?
            StrategyDb.set_specific_backup(params[:filename])
            puts("🍋‍🟩🍋‍🟩🍋‍🟩🍋‍🟩 Alles gut")
            render json: { 
                success: true, 
                message: "Выбран файл бэкапа: #{params[:filename]}" 
            }
        else
            render json: { 
                success: false, 
                error: "Не указано имя файла бэкапа" 
            }, status: :unprocessable_entity
        end
    end
end