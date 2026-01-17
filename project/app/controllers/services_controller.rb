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
        begin
            service = EventMediator.execute_command(action: :create,model:Service,params: service_params,session: session)
            render json: service, status: :created
        rescue ActiveRecord::RecordInvalid => e
            render json: { errors: e.errors }, status: :unprocessable_entity
        end
    end

    def update
        begin
            service = EventMediator.execute_command(action: :update,entity:@service,params: service_params,session: session)
            render json: service
            
        rescue ActiveRecord::RecordInvalid => e
            render json: { errors: e.errors }, status: :unprocessable_entity
        end
    end

    def destroy
        EventMediator.execute_command(action: :delete,entity:@service,params: {},session: session)
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
