class UpdateCommand < Command
    attr_reader :snapshot
    def initialize(entity,client_params)
        @entity = entity
        @client_params = client_params
        @snapshot=Snapshot.new(entity)
    end
    def execute
        @entity.update!(@client_params)
        @entity
    end
    def undo
        @snapshot.restore_to(@entity)
    end
    def description
    {
        type: "update",
        entity: @entity.class.name,
        primary_key: @entity.class.primary_key,
        snapshot: @snapshot.attributes
    }
    end

end