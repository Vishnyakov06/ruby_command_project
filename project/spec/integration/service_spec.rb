require 'swagger_helper'

RSpec.describe 'Service API', type: :request do
  path '/services' do
    get 'Retrieves all services' do
      tags 'Service'
      produces 'application/json'

      response '200', 'services found' do
        run_test!
      end
    end

    post 'Creates a service' do
      tags 'Service'
      consumes 'application/json'
      parameter name: :service, in: :body, schema: {
        type: :object,
        properties: {
          name: { type: :string },
          price: { type: :number }
        },
        required: [ 'name', 'price' ]
      }

      response '201', 'service created' do
        run_test!
      end

      response '422', 'invalid request' do
        run_test!
      end
    end
  end

  path '/services/{id}' do
    parameter name: :id, in: :path, type: :integer

    get 'Retrieves a service' do
      tags 'Service'
      produces 'application/json'

      response '200', 'service found' do
        run_test!
      end

      response '404', 'service not found' do
        run_test!
      end
    end

    put 'Updates a service' do
      tags 'Service'
      consumes 'application/json'
      parameter name: :service, in: :body, schema: {
        type: :object,
        properties: {
          name: { type: :string },
          price: { type: :number }
        }
      }

      response '200', 'service updated' do
        run_test!
      end

      response '404', 'service not found' do
        run_test!
      end
    end

    delete 'Deletes a service' do
      tags 'Service'

      response '204', 'service deleted' do
        run_test!
      end

      response '404', 'service not found' do
        run_test!
      end
    end
  end
end
