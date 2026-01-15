class CreateCommand < Command
    def initialize(entity,params)
        @entity = entity
        @params = params
    end
    def execute
        @entity = @entity.create!(@params)
        @entity
    end
    def undo
        @entity.destroy if @entity.persisted?
    end
end