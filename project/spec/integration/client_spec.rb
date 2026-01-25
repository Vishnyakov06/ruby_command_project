require 'swagger_helper'

RSpec.describe 'Clients API', type: :request do
  path '/clients' do
    get 'Get all clients' do
      tags 'Clients'
      produces 'application/json'
      description 'Retrieves a list of all clients'

      response '200', 'clients found' do
        schema type: :array,
          items: {
            type: :object,
            properties: {
              client_id: { type: :integer, example: 1 },
              last_name: { type: :string, example: 'Иванова' },
              first_name: { type: :string, example: 'Анна' },
              patronymic: { type: :string, example: 'Сергеевна' },
              phone_number: { type: :string, example: '+79161234567' },
              registartion_date: { type: :string, format: :date, example: '2024-01-15' }
            },
            required: ['client_id', 'last_name', 'first_name', 'phone_number', 'registartion_date']
          }

        run_test! do
          # Создаем тестовые данные, если их нет
          if Client.count.zero?
            Client.create!(
              last_name: 'Иванова',
              first_name: 'Анна',
              patronymic: 'Сергеевна',
              phone_number: '+79161234567',
              registartion_date: '2024-01-15'
            )
          end
          
          get clients_path
          expect(response).to have_http_status(200)
          expect(response.content_type).to include('application/json')
        end
      end
    end

    post 'Create client' do
      tags 'Clients'
      consumes 'application/json'
      description 'Creates a new client record'
      parameter name: :client, in: :body, schema: {
        type: :object,
        properties: {
          last_name: { type: :string, example: 'Иванова' },
          first_name: { type: :string, example: 'Анна' },
          patronymic: { type: :string, example: 'Сергеевна' },
          phone_number: { type: :string, example: '+79161234567' }
        },
        required: ['last_name', 'first_name', 'phone_number']
      }

      response '201', 'client created successfully' do
        let(:client) { {
          last_name: 'Петров',
          first_name: 'Дмитрий',
          patronymic: 'Александрович',
          phone_number: '+79162345678'
        } }
        
        run_test! do
          expect(response).to have_http_status(201)
          expect(response.content_type).to include('application/json')
          json_response = JSON.parse(response.body)
          expect(json_response['last_name']).to eq('Петров')
          expect(json_response['first_name']).to eq('Дмитрий')
          expect(json_response['phone_number']).to eq('+79162345678')
        end
      end

      response '422', 'invalid request - missing required fields' do
        let(:client) { { last_name: 'Иванова' } } # Не хватает first_name и phone_number
        
        run_test! do
          expect(response).to have_http_status(422)
        end
      end

      response '422', 'invalid request - duplicate phone number' do
        before do
          Client.create!(
            last_name: 'Сидорова',
            first_name: 'Екатерина',
            phone_number: '+79163456789'
          )
        end
        
        let(:client) { {
          last_name: 'Кузнецов',
          first_name: 'Алексей',
          phone_number: '+79163456789' # Дублирующийся номер
        } }
        
        run_test! do
          expect(response).to have_http_status(422)
        end
      end
    end
  end

  path '/clients/{id}' do
    parameter name: :id, in: :path, type: :integer, description: 'Client ID'

    get 'Get client' do
      tags 'Clients'
      produces 'application/json'
      description 'Retrieves a client by ID'

      response '200', 'client found' do
        schema type: :object,
          properties: {
            client_id: { type: :integer, example: 1 },
            last_name: { type: :string, example: 'Иванова' },
            first_name: { type: :string, example: 'Анна' },
            patronymic: { type: :string, example: 'Сергеевна' },
            phone_number: { type: :string, example: '+79161234567' },
            registartion_date: { type: :string, format: :date, example: '2024-01-15' }
          },
          required: ['client_id', 'last_name', 'first_name', 'phone_number', 'registartion_date']

        let(:id) do
          client = Client.create!(
            last_name: 'Иванова',
            first_name: 'Анна',
            patronymic: 'Сергеевна',
            phone_number: '+79161234568',
            registartion_date: '2024-01-15'
          )
          client.id
        end
        
        run_test! do
          expect(response).to have_http_status(200)
          json_response = JSON.parse(response.body)
          expect(json_response['client_id']).to eq(id)
          expect(json_response['last_name']).to eq('Иванова')
        end
      end

      response '404', 'client not found' do
        let(:id) { 99999 } # Несуществующий ID
        
        run_test! do
          expect(response).to have_http_status(404)
        end
      end
    end

    put 'Update client' do
      tags 'Clients'
      consumes 'application/json'
      description 'Updates client information'
      parameter name: :client, in: :body, schema: {
        type: :object,
        properties: {
          last_name: { type: :string, example: 'Иванова-Петрова' },
          first_name: { type: :string, example: 'Анна' },
          patronymic: { type: :string, example: 'Сергеевна' },
          phone_number: { type: :string, example: '+79161234567' }
        }
      }

      response '200', 'client updated successfully' do
        let(:id) do
          client = Client.create!(
            last_name: 'Иванова',
            first_name: 'Анна',
            patronymic: 'Сергеевна',
            phone_number: '+79161234569',
            registartion_date: '2024-01-15'
          )
          client.id
        end
        
        let(:client) { { 
          last_name: 'Иванова-Петрова',
          phone_number: '+79161234570'
        } }
        
        run_test! do
          expect(response).to have_http_status(200)
          json_response = JSON.parse(response.body)
          expect(json_response['last_name']).to eq('Иванова-Петрова')
          expect(json_response['phone_number']).to eq('+79161234570')
          # Проверяем, что неизмененные поля остались прежними
          expect(json_response['first_name']).to eq('Анна')
          expect(json_response['patronymic']).to eq('Сергеевна')
        end
      end

      response '404', 'client not found' do
        let(:id) { 99999 }
        let(:client) { { last_name: 'Обновленное имя' } }
        
        run_test! do
          expect(response).to have_http_status(404)
        end
      end

      response '422', 'invalid request - validation failed' do
        let(:id) do
          client = Client.create!(
            last_name: 'Иванова',
            first_name: 'Анна',
            phone_number: '+79161234571',
            registartion_date: '2024-01-15'
          )
          client.id
        end
        
        let(:client) { { phone_number: '' } } # Невалидный номер
        
        run_test! do
          expect(response).to have_http_status(422)
        end
      end
    end

    delete 'Delete client' do
      tags 'Clients'
      description 'Deletes a client by ID'

      response '204', 'client deleted successfully' do
        let(:id) do
          client = Client.create!(
            last_name: 'Иванова',
            first_name: 'Анна',
            patronymic: 'Сергеевна',
            phone_number: '+79161234572',
            registartion_date: '2024-01-15'
          )
          client.id
        end
        
        run_test! do
          expect(response).to have_http_status(204)
          expect(Client.find_by(id: id)).to be_nil
        end
      end

      response '404', 'client not found' do
        let(:id) { 99999 }
        
        run_test! do
          expect(response).to have_http_status(404)
        end
      end
    end
  end
end