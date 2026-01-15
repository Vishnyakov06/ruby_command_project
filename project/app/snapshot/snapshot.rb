class Snapshot
    def initialize(entity)
        @attributes = entity.attributes.deep_dup
        @entity=entity
    end
    def restore
        @entity.class.create!(@attributes)
    end
    def restore_to(entity)
        @entity.update!(@attributes)
    end
end