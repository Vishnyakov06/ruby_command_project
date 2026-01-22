require_relative '../models/StrategyDb'

class MastersController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :set_master, only: %i[show update destroy]

    def index
        masters =
        if params[:active] == 'true'
            StrategyDb.Master.active
        elsif params[:active] == 'false'
            StrategyDb.Master.inactive
        else
            StrategyDb.Master.all
        end

        render json: masters
    end

    def show
        render json: @master.to_h
    end

    def create
        begin
            master = EventMediator.execute_command(action: :create, model: StrategyDb.Master, params: master_params, session: session)
            render json: master, status: :created
        rescue ActiveRecord::RecordInvalid => e
            render json: { errors: e.errors }, status: :unprocessable_entity
        end
    end

    def update
        begin
            master = EventMediator.execute_command(action: :update, entity: @master, params: master_params, session: session)
            render json: master
        rescue ActiveRecord::RecordInvalid => e
            render json: { errors: e.errors }, status: :unprocessable_entity
        end
    end

    def destroy
        EventMediator.execute_command(action: :delete,entity:@master,params: {},session: session)
        head :no_content
    end

    private

    def set_master
        @master = StrategyDb.Master.find(params[:id])
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
