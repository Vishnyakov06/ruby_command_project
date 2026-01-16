class UpdateCommand < Command
    def initialize(entity,client_params)
        @entity = entity
        @client_params = client_params
        @snapshot=Snapshot.new(@entity)
    end
    def execute
        @entity.update!(@client_params)
        @entity
    end
    def undo
        @snapshot.restore_to(@entity)
    end
end