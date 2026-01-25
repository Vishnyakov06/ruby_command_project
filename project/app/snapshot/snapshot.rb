class Snapshot
    attr_reader :attributes
    def initialize(entity,attributes=nil)
        if attributes
            @attributes = attributes
        else 
            @attributes = entity.attributes.deep_dup
        end
        @entity=entity
    end
    
    def restore
        @entity.create!(@attributes)
    end

    def restore_to(entity)
        entity.update!(@attributes)
    end
end