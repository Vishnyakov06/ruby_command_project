require_relative 'snapshotable'
class BookingSnapshot
    include Snapshotable
    def restore
        Booking.create!(@attributes)
    end
end