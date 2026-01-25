class DeleteService < CrudService
    def initialize(entity:, session:)
        super(action: :delete, entity: entity,params:{}, session: session)
    end
end