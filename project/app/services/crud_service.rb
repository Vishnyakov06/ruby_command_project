class CrudService < ApplicationService
	def initialize(action:, model: nil, entity: nil, params:, session:)
		@action = action
		@model = model
		@entity = entity
		@params = params
		@session = session
		@logger = LogChainFactory.instance.create_chain
	end

	def call
		log_debug("#{target_name} #{@action} started", payload)

		result = EventMediator.execute_command(
			action: @action,
			model: @model,
			entity: @entity,
			params: @params,
			session: @session
		)

		log_info("#{target_name} #{@action} completed", entity_id: result.id)
		result
	rescue ActiveRecord::RecordNotUnique => e
		log_error("#{target} #{action} failed", error: error.message)
		raise DuplicateError.new(
			"Duplicate record",
			e,
			code: :duplicate_record
		)
	rescue ActiveRecord::RecordInvalid => e
		log_error("#{target_name} #{@action} failed", error: e.record.errors.full_messages.join(", "))
		raise ValidationError.new(
			e.record.errors.full_messages.join(", "),
			e,
			code: :validation_failed,
			details: { errors: e.record.errors }
		)
	rescue ActiveRecord::RecordNotFound => e
		log_error("#{target} #{action} failed", error: error.message)
		raise NotFoundError.new(
			"Record not found",
			e,
			code: :not_found
		)

	rescue ActiveRecord::ConnectionNotEstablished, PG::ConnectionBad => e
		log_error("#{target} #{action} failed", error: error.message)
		raise DatabaseError.new(
			"Database connection error",
			e,
			code: :db_connection
		)

	rescue StandardError => e
		log_error("#{target} #{action} failed", error: error.message)
		raise CrudError.new(
			e.message,
			e,
			code: :service_error
		)
	end

	private

	def target_name
		@entity ? @entity.class.name : @model.name
	end

	def payload
		@entity ? { entity_id: @entity.id } : @params
	end
end