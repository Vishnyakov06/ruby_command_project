module Snapshotable
    def initialize(entity)
        @attributes = entity.attributes.deep_dup
        @entity=entity
    end
    def restore
        raise NotImplementedError, "Subclasses must implement the restore_to method"
    end
    def restore_to(entity)
        @entity.update!(@attributes)
    end
end