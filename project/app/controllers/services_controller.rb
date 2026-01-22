require_relative '../models/StrategyDb'

class ServicesController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :set_service, only: %i[show update destroy]

    def index
        render json: StrategyDb.Service.all
    end

    def show
        render json: @service.to_h
    end

    def create
        begin
            service = CreateService.new(model: StrategyDb.Service , params: service_params,session: session).call
            render json: service, status: :created
        rescue ActiveRecord::RecordInvalid => e
            render json: { errors: e.errors }, status: :unprocessable_entity
        end
    end

    def update
        begin
            service = UpdateService.new(entity:@service,params: service_params,session: session).call
            render json: service
            
        rescue ActiveRecord::RecordInvalid => e
            render json: { errors: e.errors }, status: :unprocessable_entity
        end
    end

    def destroy
        DeleteService.new(entity:@service,session: session).call
        head :no_content
    end

    private

    def set_service
        @service = StrategyDb.Service.find(params[:id])
    end

    def service_params
        params.require(:service).permit(
            :title,
            :duration,
            :base_price,
            :category
        )
    end
end
