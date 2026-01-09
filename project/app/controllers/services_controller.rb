class ServicesController < ApplicationController
    before_action :set_service, only: %i[show update destroy]

    def index
        render json: Service.all
    end

    def show
        render json: @service
    end

    def create
        service = Service.new(service_params)

        if service.save
            render json: service, status: :created
        else
            render json: { errors: service.errors }, status: :unprocessable_entity
        end
    end

    def update
        if @service.update(service_params)
            render json: @service
        else
            render json: { errors: @service.errors }, status: :unprocessable_entity
        end
    end

    def destroy
        @service.destroy
        head :no_content
    end

    private

    def set_service
        @service = Service.find(params[:id])
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
