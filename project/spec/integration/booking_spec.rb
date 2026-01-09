require 'swagger_helper'

RSpec.describe 'Booking API', type: :request do
  path '/bookings' do

    get 'Retrieve all bookings' do
      tags 'Booking'
      produces 'application/json'

      response '200', 'bookings found' do
        run_test!
      end
    end

    post 'Create a booking' do
      tags 'Booking'
      consumes 'application/json'
      parameter name: :booking, in: :body, schema: {
        type: :object,
        properties: {
          client_id: { type: :integer },
          service_id: { type: :integer },
          master_id: { type: :integer },
          date: { type: :string, format: 'date-time' }
        },
        required: [ 'client_id', 'service_id', 'master_id', 'date' ]
      }

      response '201', 'booking created' do
        run_test!
      end

      response '422', 'invalid request' do
        run_test!
      end
    end
  end

  path '/bookings/{id}' do
    parameter name: :id, in: :path, type: :integer

    get 'Retrieve a booking' do
      tags 'Booking'
      produces 'application/json'

      response '200', 'booking found' do
        run_test!
      end

      response '404', 'booking not found' do
        run_test!
      end
    end

    put 'Update a booking' do
      tags 'Booking'
      consumes 'application/json'
      parameter name: :booking, in: :body, schema: {
        type: :object,
        properties: {
          date: { type: :string, format: 'date-time' }
        }
      }

      response '200', 'booking updated' do
        run_test!
      end

      response '404', 'booking not found' do
        run_test!
      end
    end

    delete 'Delete a booking' do
      tags 'Booking'

      response '204', 'booking deleted' do
        run_test!
      end

      response '404', 'booking not found' do
        run_test!
      end
    end
  end
end
