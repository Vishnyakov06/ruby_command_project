class UpdateService < CrudService
    def initialize(entity:, params:, session:)
        super(action: :update, entity: entity, params: params, session: session)
    end
end