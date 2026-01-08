class ClientsController < ApplicationController
    before_action :set_client, only: %i[show update destroy]

    def index
        render json: Client.all
    end

    def show
        render json: @client
    end

    def create
        client = Client.new(client_params)

        if client.save
            render json: client, status: :created
        else
            render json: { errors: client.errors }, status: :unprocessable_entity
        end
    end

    def update
        if @client.update(client_params)
            render json: @client
        else
            render json: { errors: @client.errors }, status: :unprocessable_entity
        end
    end

    def destroy
        @client.destroy
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
            :phone_number
        )
    end
end
