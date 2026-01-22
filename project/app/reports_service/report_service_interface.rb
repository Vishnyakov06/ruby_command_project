module ReportServiceInterface

    def self.master_efficiency_report(start_date, end_date, status = 'Выполнена', is_active=true)
        raise NotImplementedError, "This method should be implemented in a subclass"
    end

    def self.client_analytics_report(status='Выполнена')
        raise NotImplementedError, "This method should be implemented in a subclass"
    end

    def self.operational_report(status='Выполнена')
        raise NotImplementedError, "Subclass must implement this method"
    end

end