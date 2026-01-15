require_relative 'snapshotable'
class ClientSnapshot
    include Snapshotable
    def restore
        Client.create!(@attributes)
    end
end