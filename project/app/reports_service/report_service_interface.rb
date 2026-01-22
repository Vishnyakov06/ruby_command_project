module ReportServiceInterface

    def master_efficiency_report(start_date, end_date, status = 'Выполнена', is_active=true)
        raise NotImplementedError, "This method should be implemented in a subclass"
    end

    def client_analytics_report(status='Выполнена')
        raise NotImplementedError, "This method should be implemented in a subclass"
    end

    def operational_report(status='Выполнена')
        raise NotImplementedError, "Subclass must implement this method"
    end

end