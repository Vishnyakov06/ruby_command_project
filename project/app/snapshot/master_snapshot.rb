require_relative 'snapshotable'
class MasterSnapshot
    include Snapshotable
    def restore
        Master.create!(@attributes)
    end
end