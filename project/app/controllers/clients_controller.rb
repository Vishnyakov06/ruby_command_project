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
        command = CreateCommand.new(Client, client_params)

        begin
            client = Event.execute_command(command)
            render json: client, status: :created

        rescue ActiveRecord::RecordInvalid => e
            render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def update
        command = UpdateCommand.new(@client, client_params)
        begin 
            @client = Event.execute_command(command)
            render json: @client
            Event.undo_last_command
        rescue ActiveRecord::RecordInvalid => e
            render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def destroy
        #TODO: handle errors
        command = DeleteCommand.new(@client)
        Event.execute_command(command)
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
