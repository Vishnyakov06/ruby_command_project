require 'swagger_helper'

RSpec.describe 'Client API', type: :request do
  path '/clients' do
    get 'Retrieves all clients' do
      tags 'Client'
      produces 'application/json'

      response '200', 'clients found' do
        run_test!
      end
    end

    post 'Creates a client' do
      tags 'Client'
      consumes 'application/json'
      parameter name: :client, in: :body, schema: {
        type: :object,
        properties: {
          name: { type: :string },
          phone: { type: :string }
        },
        required: [ 'name', 'phone' ]
      }

      response '201', 'client created' do
        run_test!
      end

      response '422', 'invalid request' do
        run_test!
      end
    end
  end

  path '/clients/{id}' do
    parameter name: :id, in: :path, type: :integer

    get 'Retrieves a client' do
      tags 'Client'
      produces 'application/json'

      response '200', 'client found' do
        run_test!
      end

      response '404', 'client not found' do
        run_test!
      end
    end

    put 'Updates a client' do
      tags 'Client'
      consumes 'application/json'
      parameter name: :client, in: :body, schema: {
        type: :object,
        properties: {
          name: { type: :string },
          phone: { type: :string }
        }
      }

      response '200', 'client updated' do
        run_test!
      end

      response '404', 'client not found' do
        run_test!
      end
    end

    delete 'Deletes a client' do
      tags 'Client'

      response '204', 'client deleted' do
        run_test!
      end

      response '404', 'client not found' do
        run_test!
      end
    end
  end
end
