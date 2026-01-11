require 'swagger_helper'

RSpec.describe 'Bookings API', type: :request do
  path '/bookings' do
    get 'Get all bookings' do
      tags 'Bookings'
      produces 'application/json'

      response '200', 'bookings found' do
        schema type: :array,
          items: {
            type: :object,
            properties: {
              booking_id: { type: :integer, example: 1 },
              client_id: { type: :integer, example: 1 },
              master_id: { type: :integer, example: 1 },
              service_id: { type: :integer, example: 1 },
              date_service: { type: :string, format: 'date-time', example: '2024-01-15T10:00:00Z' },
              price: { type: :integer, example: 1000 },
              status: { 
                type: :string, 
                enum: ['Подтверждена', 'Выполнена', 'Отменена', 'Неявка'],
                example: 'Подтверждена'
              },
              created_at: { type: :string, format: 'date-time', example: '2024-01-09T09:00:00Z' },
              notes: { type: :string, example: 'Дополнительные пожелания' }
            }
          }

        run_test!
      end
    end

    post 'Create booking' do
      tags 'Bookings'
      consumes 'application/json'
      parameter name: :booking, in: :body, schema: {
        type: :object,
        properties: {
          client_id: { type: :integer },
          master_id: { type: :integer },
          service_id: { type: :integer },
          date_service: { type: :string, format: 'date-time' },
          price: { type: :integer },
          status: { 
            type: :string,
            enum: ['Подтверждена', 'Выполнена', 'Отменена', 'Неявка']
          },
          notes: { type: :string }
        },
        required: ['client_id', 'master_id', 'service_id', 'date_service', 'price']
      }

      response '201', 'booking created' do
        let(:booking) { {
          client_id: @client.id,
          master_id: @master.id,
          service_id: @service.id,
          date_service: '2024-01-15T10:00:00Z',
          price: 1000,
          status: 'Подтверждена',
          notes: 'Дополнительные пожелания'
        } }
        
        run_test!
      end

      response '422', 'invalid request - missing required fields' do
        let(:booking) { { client_id: @client.id } }
        run_test!
      end

      response '422', 'invalid request - duplicate booking time' do
        before do
          Booking.create!(
            client_id: @client.id,
            master_id: @master.id,
            service_id: @service.id,
            date_service: '2024-01-15T11:00:00Z',
            price: 1000
          )
        end
        
        let(:booking) { {
          client_id: @client.id,
          master_id: @master.id,
          service_id: @service.id,
          date_service: '2024-01-15T11:00:00Z', # Такое же время
          price: 1000
        } }
        
        run_test!
      end
    end
  end

  path '/bookings/{id}' do
    parameter name: :id, in: :path, type: :integer

    get 'Get booking' do
      tags 'Bookings'
      produces 'application/json'

      response '200', 'booking found' do
        let(:id) { 
          Booking.create!(
            client_id: @client.id,
            master_id: @master.id,
            service_id: @service.id,
            date_service: '2024-01-15T12:00:00Z',
            price: 1000
          ).id 
        }
        run_test!
      end

      response '404', 'booking not found' do
        let(:id) { 99999 }
        run_test!
      end
    end

    put 'Update booking' do
      tags 'Bookings'
      consumes 'application/json'
      parameter name: :booking, in: :body, schema: {
        type: :object,
        properties: {
          client_id: { type: :integer },
          master_id: { type: :integer },
          service_id: { type: :integer },
          date_service: { type: :string, format: 'date-time' },
          price: { type: :integer },
          status: { 
            type: :string,
            enum: ['Подтверждена', 'Выполнена', 'Отменена', 'Неявка']
          },
          notes: { type: :string }
        }
      }

      response '200', 'booking updated' do
        let(:id) { 
          Booking.create!(
            client_id: @client.id,
            master_id: @master.id,
            service_id: @service.id,
            date_service: '2024-01-15T13:00:00Z',
            price: 1000
          ).id 
        }
        let(:booking) { { 
          price: 1200,
          status: 'Выполнена',
          notes: 'Обновленные заметки'
        } }
        run_test!
      end

      response '404', 'booking not found' do
        let(:id) { 99999 }
        let(:booking) { { status: 'Отменена' } }
        run_test!
      end

      response '422', 'invalid request' do
        let(:id) { 
          Booking.create!(
            client_id: @client.id,
            master_id: @master.id,
            service_id: @service.id,
            date_service: '2024-01-15T14:00:00Z',
            price: 1000
          ).id 
        }
        let(:booking) { { price: -100 } }
        run_test!
      end
    end

    delete 'Delete booking' do
      tags 'Bookings'

      response '204', 'booking deleted' do
        let(:id) { 
          Booking.create!(
            client_id: @client.id,
            master_id: @master.id,
            service_id: @service.id,
            date_service: '2024-01-15T15:00:00Z',
            price: 1000
          ).id 
        }
        run_test!
      end

      response '404', 'booking not found' do
        let(:id) { 99999 }
        run_test!
      end
    end
  end
end