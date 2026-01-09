class MastersController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :set_master, only: %i[show update destroy]

    def index
        masters =
        if params[:active] == 'true'
            Master.active
        elsif params[:active] == 'false'
            Master.inactive
        else
            Master.all
        end

        render json: masters
    end

    def show
        render json: @master
    end

    def create
        master = Master.new(master_params)

        if master.save
            render json: master, status: :created
        else
            render json: { errors: master.errors }, status: :unprocessable_entity
        end
    end

    def update
        if @master.update(master_params)
            render json: @master
        else
            render json: { errors: @master.errors }, status: :unprocessable_entity
        end
    end

    def destroy
        @master.destroy
        head :no_content
    end

    private

    def set_master
        @master = Master.find(params[:id])
    end

    def master_params
        params.require(:master).permit(
            :last_name,
            :first_name,
            :patronymic,
            :phone_number,
            :is_active
        )
    end
end
