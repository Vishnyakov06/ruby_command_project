class RealReportService
    include ReportServiceInterface
    def self.master_efficiency_report(start_date, end_date,status = 'Выполнена', is_active=true)
        results = Booking
        .joins(:master, :service)
        .references(:master, :service) 
        .where(status: status)
        .where(master: { is_active: is_active})
        .where('date_service BETWEEN ? AND ?', start_date, end_date)
        .group('master.master_id', 'service.category', 'service.title')
        .select(
            'master.master_id as master_id',
            "master.last_name || ' ' || master.first_name as master_name",
            'service.category',
            'service.title as service_name',
            'COUNT(DISTINCT booking.client_id) as unique_clients_count',
            'COUNT(booking.booking_id) as total_bookings',
            'SUM(booking.price) as total_revenue',
            'ROUND(AVG(booking.price), 2) as average_price',
            'MIN(booking.date_service) as first_booking_date',
            'MAX(booking.date_service) as last_booking_date'
        )
        .order('total_revenue DESC, total_bookings DESC')

        formatted_results = results.map do |booking|
        first_date = booking.first_booking_date
        last_date = booking.last_booking_date
        activity_days = first_date && last_date ? 
            ((last_date.to_date - first_date.to_date).to_i + 1) : 0
        {
            master_id: booking.master_id,
            master_name: booking.master_name,
            category: booking.category,
            service_name: booking.service_name,
            unique_clients: booking.unique_clients_count,
            total_bookings: booking.total_bookings,
            total_revenue: booking.total_revenue.to_f.round(2),
            average_price: booking.average_price.to_f.round(2),
            first_booking: first_date,
            last_booking: last_date,
            activity_period_days: activity_days,
            revenue_per_client: booking.unique_clients_count > 0 ? 
            (booking.total_revenue.to_f / booking.unique_clients_count).round(2) : 0,
            bookings_per_day: activity_days > 0 ? 
            (booking.total_bookings.to_f / activity_days).round(2) : 0,
            client_retention_rate: booking.total_bookings > 0 ? 
            (booking.unique_clients_count.to_f / booking.total_bookings * 100).round(2) : 0
        }
        end
        formatted_results
    end

    def self.client_analytics_report(status='Выполнена')
        client_stats = Booking.joins(:client)
                                .where(status: status)
                                .group('client.client_id', 'client.first_name', 'client.last_name', 'client.phone_number','client.registration_date')
                                .select(
                                    'client.client_id as client_id',
                                    "client.first_name || ' ' || client.last_name as client_name",
                                    'client.phone_number as phone_number',
                                    'client.registration_date as registration_date',
                                    'SUM(booking.price) as total_spent',
                                    'COUNT(booking.booking_id) as total_bookings',
                                    'AVG(booking.price) as average_spent_per_booking',
                                    'MIN(booking.date_service) as first_booking_date',
                                    'MAX(booking.date_service) as last_booking_date'
                                    )
        formatted_results = client_stats.map do |client|
            favorite_service = Booking.joins(:service)
                                        .where(client_id: client.client_id)
                                        .group('service.category')
                                        .order('COUNT(booking.booking_id) DESC')
                                        .limit(1)
                                        .pluck('service.category')
                                        .first
            favorite_master = Booking.joins(:master)
                                        .where(client_id: client.client_id)
                                        .group('master.master_id')
                                        .order('COUNT(booking.booking_id) DESC')
                                        .limit(1)
                                        .pluck(Arel.sql("master.first_name || ' ' || master.last_name"))
                                        .first
            unique_visit_days= Booking.where(client_id: client.client_id)
                                        .select('DISTINCT DATE(date_service)')
                                        .count
        {
        client_id: client.client_id,
        client_name: client.client_name,
        phone: client.phone_number,
        registration_date: client.registration_date,
        total_visits: client.total_bookings,
        total_spent: client.total_spent.to_f.round(2),
        average_check: client.average_spent_per_booking.to_f.round(2),
        favorite_master: favorite_master,
        favorite_category: favorite_service,
        unique_visit_days: unique_visit_days,
        first_visit_date: client.first_booking_date,
        last_visit_date: client.last_booking_date
      }
        end
    end

    def self.operational_efficiency_report(status = 'Выполнена')
        results = Booking
        .joins(:master, :service)
        .where(status: status)
        .group(
            'master.master_id',
            'master.last_name',
            'master.first_name',
            'service.category',
            'DATE(date_service)',
            'EXTRACT(DOW FROM date_service)',
            "TO_CHAR(date_service, 'HH24')"
        )
        .select(
            'master.master_id',
            "master.last_name || ' ' || LEFT(master.first_name, 1) || '.' as master_short",
            'master.is_active',
            
            'service.category',
            
            'DATE(date_service) as booking_date',
            'EXTRACT(DOW FROM date_service) as day_of_week',
            "TO_CHAR(date_service, 'HH24') as hour",
            
            'COUNT(*) as bookings_count',
            'SUM(service.duration) as total_minutes',
            'SUM(booking.price) as total_revenue',
            'COUNT(DISTINCT booking.client_id) as unique_clients'
        )
        .order('booking_date DESC, master.master_id')

        formatted_results = results.map do |row|
        day_names = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
        
        {
            date: row.booking_date,
            day_of_week: day_names[row.day_of_week.to_i],
            hour: row.hour.to_i,
            
            master_id: row.master_id,
            master_name: row.master_short,
            is_active: row.is_active,
            
            category: row.category,
            
            bookings: row.bookings_count,
            total_hours: (row.total_minutes.to_f / 60).round(2),
            revenue: row.total_revenue.to_f.round(2),
            unique_clients: row.unique_clients,

            avg_duration: row.bookings_count > 0 ? 
            (row.total_minutes.to_f / row.bookings_count).round(1) : 0,
            avg_price: row.bookings_count > 0 ? 
            (row.total_revenue.to_f / row.bookings_count).round(2) : 0,
            utilization: ((row.total_minutes.to_f / (8 * 60)) * 100).round(1)
        }
        end
        
        formatted_results
    end
  
end