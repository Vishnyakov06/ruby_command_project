class CreateService < CrudService
    def initialize(model:, params:, session:)
        super(action: :create, model: model, params: params, session: session)
    end
    
end