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
            client = EventMediator.execute_command(action: :create, model: StrategyDb.Client, params: client_params,session: session)
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
        #TODO: handle errors
        EventMediator.execute_command(action: :delete,entity:@client,params: {},session: session)
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
