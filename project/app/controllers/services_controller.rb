class ServicesController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :set_service, only: %i[show update destroy]

    def index
        render json: Service.all
    end

    def show
        render json: @service
    end

    def create
        command = CreateCommand.new(Service, service_params)

        begin
            service = Event.execute_command(command)
            render json: service, status: :created
        rescue ActiveRecord::RecordInvalid => e
            render json: { errors: e.errors }, status: :unprocessable_entity
        end
    end

    def update
        command = UpdateCommand.new(@service, service_params)
        begin
            service = Event.execute_command(command)
            render json: service
            
        rescue ActiveRecord::RecordInvalid => e
            render json: { errors: e.errors }, status: :unprocessable_entity
        end
    end

    def destroy
        command = DeleteCommand.new(@service)
        Event.execute_command(command)
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
