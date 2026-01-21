class ClientsController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :set_client, only: %i[show update destroy]

    def index
        render json: Client.all
    end

    def show
        render json: @client
    end

    def create
        begin
            client = EventMediator.execute_command(action: :create,model:Client,params: client_params,session: session)
            render json: client, status: :created
        rescue ActiveRecord::RecordInvalid => e
            render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def update
        begin 
            @client = EventMediator.execute_command(action: :update,entity:@client,params: client_params,session: session)
            render json: @client
        rescue ActiveRecord::RecordInvalid => e
            render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def destroy
        EventMediator.execute_command(action: :delete,entity:@client,params: {},session: session)
        head :no_content
    end

    private

    def set_client
        @client = Client.find(params[:id])
    end

    def client_params
        params.require(:client).permit(
            :first_name,
            :last_name,
            :phone_number,
            :patronymic
        )
    end
end
