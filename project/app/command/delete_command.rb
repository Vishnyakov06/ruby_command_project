class DeleteCommand < Command
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
end