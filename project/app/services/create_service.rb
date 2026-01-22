class CreateService < ApplicationService
    def initialize(model:, params:,session:)
        @model = model
        @params = params
        @session = session
        @logger = LogChainFactory.instance.create_chain
    end
    def call
        log_debug("#{@model.name} create started", params: @params)

        entity = EventMediator.execute_command(action: :create,model:@model,params: @params,session: @session)

        log_info("#{@model.name} created", entity_id: entity.id)

        entity
        rescue ActiveRecord::RecordInvalid => e
            log_error("#{@model.name} create failed", error: e.record.errors.full_messages.join(", "))
            raise CreateError.new(e.record.errors.full_messages.join(", "), e)
        rescue StandardError => e
            log_error("#{@model.name} create failed", error: e.message)
            raise CreateError.new(e.message, e)
    end

    
end