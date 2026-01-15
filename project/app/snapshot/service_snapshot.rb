require_relative 'snapshotable'
class ServiceSnapshot
    include Snapshotable
    def restore
        Service.create!(@attributes)
    end
end