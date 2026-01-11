require 'swagger_helper'

RSpec.describe 'Masters API', type: :request do
  path '/masters' do
    get 'Get all masters' do
      tags 'Masters'
      produces 'application/json'

      response '200', 'masters found' do
        schema type: :array,
          items: {
            type: :object,
            properties: {
              master_id: { type: :integer, example: 1 },
              last_name: { type: :string, example: 'Петров' },
              first_name: { type: :string, example: 'Иван' },
              patronymic: { type: :string, example: 'Сергеевич' },
              phone_number: { type: :string, example: '+79161234567' },
              is_active: { type: :boolean, example: true }
            }
          }

        run_test!
      end
    end

    post 'Create master' do
      tags 'Masters'
      consumes 'application/json'
      parameter name: :master, in: :body, schema: {
        type: :object,
        properties: {
          last_name: { type: :string },
          first_name: { type: :string },
          patronymic: { type: :string },
          phone_number: { type: :string },
          is_active: { type: :boolean }
        },
        required: ['last_name', 'first_name', 'phone_number']
      }

      response '201', 'master created' do
        let(:master) { {
          last_name: 'Петров',
          first_name: 'Иван',
          patronymic: 'Сергеевич',
          phone_number: '+79161234567',
          is_active: true
        } }
        
        run_test!
      end

      response '422', 'invalid request' do
        let(:master) { { last_name: 'Петров' } }
        run_test!
      end
    end
  end

  path '/masters/{id}' do
    parameter name: :id, in: :path, type: :integer

    get 'Get master' do
      tags 'Masters'
      produces 'application/json'

      response '200', 'master found' do
        let(:id) { Master.create!(last_name: 'Петров', first_name: 'Иван', phone_number: '+79161234568').id }
        run_test!
      end

      response '404', 'master not found' do
        let(:id) { 99999 }
        run_test!
      end
    end

    put 'Update master' do
      tags 'Masters'
      consumes 'application/json'
      parameter name: :master, in: :body, schema: {
        type: :object,
        properties: {
          last_name: { type: :string },
          first_name: { type: :string },
          patronymic: { type: :string },
          phone_number: { type: :string },
          is_active: { type: :boolean }
        }
      }

      response '200', 'master updated' do
        let(:id) { Master.create!(last_name: 'Петров', first_name: 'Иван', phone_number: '+79161234569').id }
        let(:master) { { last_name: 'Иванов', phone_number: '+79161234570' } }
        run_test!
      end

      response '404', 'master not found' do
        let(:id) { 99999 }
        let(:master) { { last_name: 'Иванов' } }
        run_test!
      end

      response '422', 'invalid request' do
        let(:id) { Master.create!(last_name: 'Петров', first_name: 'Иван', phone_number: '+79161234571').id }
        let(:master) { { phone_number: '' } }
        run_test!
      end
    end

    delete 'Delete master' do
      tags 'Masters'

      response '204', 'master deleted' do
        let(:id) { Master.create!(last_name: 'Петров', first_name: 'Иван', phone_number: '+79161234572').id }
        run_test!
      end

      response '404', 'master not found' do
        let(:id) { 99999 }
        run_test!
      end
    end
  end
end