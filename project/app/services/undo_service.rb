class UndoService < ApplicationService
    def initialize(session:)
        @session=session
        @logger = LogChainFactory.instance.create_chain
    end
    def call
        log_debug("Undo started", @session)
        command  = EventMediator.undo_last_command(@session)
        log_info("Undo completed", command)
        command
        rescue ActiveRecord::RecordInvalid => e
            log_error("Undo failed", error: e.record.errors.full_messages.join(", "))
            raise UndoError.new(e.record.errors.full_messages.join(", "), e)
        rescue StandardError => e
            log_error("Undo failed", error: e.message)
            raise UndoError.new(e.message, e)
    end

end