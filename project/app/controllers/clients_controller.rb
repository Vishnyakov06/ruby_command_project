require_relative '../models/StrategyDb'

class ClientsController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :set_client, only: %i[show update destroy]

    def index
        render json: StrategyDb.Client.all
    end

    def show
        render json: @client.to_h
    end

    def create
        begin
            client = CreateService.new(model: Client , params: client_params,session: session).call
            render json: client, status: :created
        rescue ActiveRecord::RecordInvalid => e
            render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def update
        begin 
            @client = UpdateService.new(entity:@client,params: client_params,session: session).call
            render json: @client
        rescue ActiveRecord::RecordInvalid => e
            render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def destroy
        DeleteService.new(entity:@client,session: session).call
        head :no_content
    end

    private

    def set_client
        @client = StrategyDb.Client.find(params[:id])
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
