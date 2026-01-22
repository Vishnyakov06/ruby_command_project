class DeleteService < ApplicationService
    def initialize(entity:,session:)
        @entity = entity
        @session = session
        @logger = LogChainFactory.instance.create_chain
    end
    def call
        log_debug("#{@entity.class.name} delete started", params: @entity.id)

        EventMediator.execute_command(action: :delete,entity: @entity,params:{},session: @session)

        log_info("#{@entity.class.name} delete", entity_id: @entity.id)
        
        rescue ActiveRecord::RecordInvalid => e
            log_error("#{@entity.class.name} delete failed", error: e.record.errors.full_messages.join(", "))
            raise DeleteError.new(e.record.errors.full_messages.join(", "), e)
        rescue StandardError => e
            log_error("#{@entity.class.name} delete failed", error: e.message)
            raise DeleteError.new(e.message, e)
    end

end