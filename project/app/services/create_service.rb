class CreateService < ApplicationService
    def initialize(model:, params:,session:)
        @model = model
        @params = params
        @session = session
        @logger = LogChainFactory.instance.create_chain
    end
    def call
        log_debug("#{@model.name} create started", params: @params)

        client = EventMediator.execute_command(action: :create,model:@model,params: @params,session: @session)

        log_info("#{@model.name} created", client_id: client.id)

        client
        rescue ActiveRecord::RecordInvalid => e
            log_error("#{@model.name} create failed", error: e.record.errors.full_messages.join(", "))
            raise CreateError.new(e.record.errors.full_messages.join(", "), e)
        rescue StandardError => e
            log_error("#{@model.name} create failed", error: e.message)
            raise CreateError.new(e.message, e)
    end

    private 

    def log_info(message, payload = {})
        @logger.log(Request.new("INFO", message, payload))
    end

    def log_error(message, payload = {})
        @logger.log(Request.new("ERROR", message, payload))
    end

    def log_warn(message, payload = {})
        @logger.log(Request.new("WARN", message, payload))
    end

    def log_debug(message, payload = {})
        @logger.log(Request.new("DEBUG", message, payload))
    end
end