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
	rescue ActiveRecord::RecordInvalid => e
		log_error("#{target_name} #{@action} failed", error: e.record.errors.full_messages.join(", "))
		raise CrudError.new(e.record.errors.full_messages.join(", "), e)
	rescue StandardError => e
		log_error("#{target_name} #{@action} failed", error: e.message)
		raise CrudError.new(e.message, e)
	end

	private

	def target_name
		@entity ? @entity.class.name : @model.name
	end

	def payload
		@entity ? { entity_id: @entity.id } : @params
	end
end