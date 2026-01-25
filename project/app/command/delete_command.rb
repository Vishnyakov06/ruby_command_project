class DeleteCommand < Command
    attr_reader :snapshot
    def initialize(entity)
        @entity = entity
        @snapshot=Snapshot.new(@entity)
    end
    def execute
        @entity.destroy
    end
    def undo
        @snapshot.restore
    end
    def description
    {
        type: "delete",
        entity: @entity.class.name,
        primary_key: @entity.class.primary_key,
        snapshot: @snapshot.attributes
    }
    end
end