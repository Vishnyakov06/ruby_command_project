require 'swagger_helper'

RSpec.describe 'Master API', type: :request do
  path '/masters' do
    get 'Retrieves all masters' do
      tags 'Master'
      produces 'application/json'

      response '200', 'masters found' do
        run_test!
      end
    end

    post 'Creates a master' do
      tags 'Master'
      consumes 'application/json'
      parameter name: :master, in: :body, schema: {
        type: :object,
        properties: {
          name: { type: :string },
          specialty: { type: :string }
        },
        required: [ 'name', 'specialty' ]
      }

      response '201', 'master created' do
        run_test!
      end

      response '422', 'invalid request' do
        run_test!
      end
    end
  end

  path '/masters/{id}' do
    parameter name: :id, in: :path, type: :integer

    get 'Retrieves a master' do
      tags 'Master'
      produces 'application/json'

      response '200', 'master found' do
        run_test!
      end

      response '404', 'master not found' do
        run_test!
      end
    end

    put 'Updates a master' do
      tags 'Master'
      consumes 'application/json'
      parameter name: :master, in: :body, schema: {
        type: :object,
        properties: {
          name: { type: :string },
          specialty: { type: :string }
        }
      }

      response '200', 'master updated' do
        run_test!
      end

      response '404', 'master not found' do
        run_test!
      end
    end

    delete 'Deletes a master' do
      tags 'Master'

      response '204', 'master deleted' do
        run_test!
      end

      response '404', 'master not found' do
        run_test!
      end
    end
  end
end
