require 'swagger_helper'

RSpec.describe 'Services API', type: :request do
  path '/services' do
    get 'Get all services' do
      tags 'Services'
      produces 'application/json'

      response '200', 'services found' do
        schema type: :array,
          items: {
            type: :object,
            properties: {
              service_id: { type: :integer, example: 1 },
              title: { type: :string, example: 'Мужская стрижка' },
              duration: { type: :string, example: '00:30:00' },
              base_price: { type: :integer, example: 1000 },
              category: { 
                type: :string, 
                enum: ['Cтрижка', 'Окрашивание', 'Укладка', 'Маникюр', 'Педикюр', 'Визаж', 'Депиляция', 'Массаж', 'Косметология'],
                example: 'Cтрижка'
              }
            }
          }

        run_test!
      end
    end

    post 'Create service' do
      tags 'Services'
      consumes 'application/json'
      parameter name: :service, in: :body, schema: {
        type: :object,
        properties: {
          title: { type: :string },
          duration: { type: :string, description: 'Duration in HH:MM:SS format', example: '00:30:00' },
          base_price: { type: :integer },
          category: { 
            type: :string,
            enum: ['Cтрижка', 'Окрашивание', 'Укладка', 'Маникюр', 'Педикюр', 'Визаж', 'Депиляция', 'Массаж', 'Косметология']
          }
        },
        required: ['title', 'duration', 'base_price', 'category']
      }

      response '201', 'service created' do
        let(:service) { {
          title: 'Мужская стрижка',
          duration: '00:30:00',
          base_price: 1000,
          category: 'Cтрижка'
        } }
        
        run_test!
      end

      response '422', 'invalid request' do
        let(:service) { { title: 'Услуга' } }
        run_test!
      end

      response '422', 'invalid category' do
        let(:service) { {
          title: 'Услуга',
          duration: 2000,
          base_price: 1000,
          category: 'Некорректная категория'
        } }
        run_test!
      end
    end
  end

  path '/services/{id}' do
    parameter name: :id, in: :path, type: :integer

    get 'Get service' do
      tags 'Services'
      produces 'application/json'

      response '200', 'service found' do
        let(:id) { 
          Service.create!(
            title: 'Мужская стрижка',
            duration: 2000,
            base_price: 1000,
            category: 'Cтрижка'
          ).id 
        }
        run_test!
      end

      response '404', 'service not found' do
        let(:id) { 99999 }
        run_test!
      end
    end

    put 'Update service' do
      tags 'Services'
      consumes 'application/json'
      parameter name: :service, in: :body, schema: {
        type: :object,
        properties: {
          title: { type: :string },
          duration: { type: :string, description: 'Duration in HH:MM:SS format' },
          base_price: { type: :integer },
          category: { 
            type: :string,
            enum: ['Cтрижка', 'Окрашивание', 'Укладка', 'Маникюр', 'Педикюр', 'Визаж', 'Депиляция', 'Массаж', 'Косметология']
          }
        }
      }

      response '200', 'service updated' do
        let(:id) { 
          Service.create!(
            title: 'Мужская стрижка',
            duration: 2000,
            base_price: 1000,
            category: 'Cтрижка'
          ).id 
        }
        let(:service) { { 
          title: 'Женская стрижка',
          base_price: 1500 
        } }
        run_test!
      end

      response '404', 'service not found' do
        let(:id) { 99999 }
        let(:service) { { title: 'Новая услуга' } }
        run_test!
      end

      response '422', 'invalid request' do
        let(:id) { 
          Service.create!(
            title: 'Мужская стрижка',
            duration: '00:30:00',
            base_price: 1000,
            category: 'Cтрижка'
          ).id 
        }
        let(:service) { { base_price: -100 } }
        run_test!
      end
    end

    delete 'Delete service' do
      tags 'Services'

      response '204', 'service deleted' do
        let(:id) { 
          Service.create!(
            title: 'Мужская стрижка',
            duration: '00:30:00',
            base_price: 1000,
            category: 'Cтрижка'
          ).id 
        }
        run_test!
      end

      response '404', 'service not found' do
        let(:id) { 99999 }
        run_test!
      end
    end
  end
end