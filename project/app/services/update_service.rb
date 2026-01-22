class UpdateService < ApplicationService
    def initialize(entity:,params:,session:)
        @entity = entity
        @params=params
        @session = session
        @logger = LogChainFactory.instance.create_chain
    end
    def call
        log_debug("#{@entity.class.name} update started", params: @entity.id)

        entity = EventMediator.execute_command(action: :update,entity:@entity,params:@params,session: @session)

        log_info("#{@entity.class.name} update", entity_id: entity.id)
        entity
        rescue ActiveRecord::RecordInvalid => e
            log_error("#{@entity.class.name} update failed", error: e.record.errors.full_messages.join(", "))
            raise DeleteError.new(e.record.errors.full_messages.join(", "), e)
        rescue StandardError => e
            log_error("#{@entity.class.name} update failed", error: e.message)
            raise DeleteError.new(e.message, e)
    end

end