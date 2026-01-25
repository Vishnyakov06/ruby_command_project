class UndoService < ApplicationService
    def initialize(session:)
        @session=session
        @logger = LogChainFactory.instance.create_chain
    end
    def call
        log_debug("Undo started",  @session.id)
        command  = EventMediator.undo_last_command(@session)
        log_info("Undo completed", command)
        command
        rescue ActiveRecord::RecordInvalid => e
            log_error(" Undo failed", error: e.record.errors.full_messages.join(", "))
            raise ValidationError.new(
                e.record.errors.full_messages.join(", "),
                e,
                code: :validation_failed,
                details: { errors: e.record.errors }
            )
        rescue ActiveRecord::RecordNotUnique => e
            log_error(" Undo failed", error: error.message)
            raise DuplicateError.new(
                "Undo: Duplicate record",
                e,
                code: :duplicate_record
            )

        rescue ActiveRecord::RecordNotFound => e
            log_error(" Undo failed", error: error.message)
            raise NotFoundError.new(
                "Undo: Record not found",
                e,
                code: :not_found
            )

        rescue ActiveRecord::ConnectionNotEstablished, PG::ConnectionBad => e
            log_error(" Undo failed", error: error.message)
            raise DatabaseError.new(
                "Undo: Database connection error",
                e,
                code: :db_connection
            )

        rescue StandardError => e
            log_error(" Undo failed", error: error.message)
            raise UndoError.new(
                e.message,
                e,
                code: :service_error
            )
        end

end