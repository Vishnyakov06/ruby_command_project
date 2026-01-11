class BookingsController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :set_booking, only: %i[show update destroy]

    def index
        bookings = Booking.includes(:client, :master, :service)

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
        booking = Booking.new(booking_params)

        if booking.save
            render json: booking, status: :created
        else
            render json: { errors: booking.errors }, status: :unprocessable_entity
        end
    end

    def update
        if @booking.update(booking_params)
            render json: @booking
        else
            render json: { errors: @booking.errors }, status: :unprocessable_entity
        end
    end

    def destroy
        @booking.destroy
        head :no_content
    end

    private

    def set_booking
        @booking = Booking.find(params[:id])
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
