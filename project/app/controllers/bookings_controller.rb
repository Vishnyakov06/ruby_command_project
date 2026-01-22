require_relative '../models/StrategyDb'

class BookingsController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :set_booking, only: %i[show update destroy]

    def index
        bookings = StrategyDb.Booking.includes(:client, :master, :service)

        bookings = bookings.where(status: params[:status]) if params[:status]

        render json: bookings.as_json(include: {
            client:  { only: %i[client_id first_name last_name phone_number] },
            master:  { only: %i[master_id first_name last_name phone_number] },
            service: { only: %i[service_id title duration base_price] }
        })
    end

    def show
        render json: @booking.as_json(include: %i[client master service])
    end

    def create
        begin
            booking = EventMediator.execute_command(action: :create,model:StrategyDb.Booking,params: booking_params,session: session)
            render json: booking, status: :created
        rescue ActiveRecord::RecordInvalid => e
            render json: { errors: e.errors }, status: :unprocessable_entity
        end
    end

    def update
        begin
            booking = EventMediator.execute_command(action: :update,entity:@booking,params: booking_params,session: session)
            render json: booking
        rescue ActiveRecord::RecordInvalid => e
            render json: { errors: e.errors }, status: :unprocessable_entity
        end
    end

    def destroy
        EventMediator.execute_command(action: :delete,entity:@booking,params: {},session: session)
        head :no_content
    end

    private

    def set_booking
        @booking = StrategyDb.Booking.find(params[:id])
    end

    def booking_params
        params.require(:booking).permit(
            :client_id,
            :master_id,
            :service_id,
            :date_service,
            :price,
            :status,
            :notes
        )
    end
end
