class ProxyCachedReportService
    extend ReportServiceInterface
    CACHE_TTL=10.minutes
    @cache={}
    @report_service=RealReportService

    class << self
        attr_accessor :report_service
    end
    
    def self.master_efficiency_report(start_date, end_date,status = 'Выполнена', is_active=true)
        cached_report(:master_efficiency_report, start_date, end_date, status, is_active)
    end

    def self.client_analytics_report(status='Выполнена')
        cached_report(:client_analytics_report, status)
    end

    def self.operational_efficiency_report(status='Выполнена')
        cached_report(:operational_efficiency_report, status)
    end

    private

    def self.cached_report(method_name, *args)
        cache_key = generate_cache_key(method_name, *args)
        if cache_hit?(cache_key)
            return @cache[cache_key][:data]
        end
        result = specific_report(method_name, *args)
        cleanup_old_cache
        cache_result(cache_key,result)
        result
    end

    def self.specific_report(method_name, *args)
        case method_name
        when :master_efficiency_report
            @report_service.master_efficiency_report(*args)
        when :client_analytics_report
            @report_service.client_analytics_report(*args)
        when :operational_efficiency_report
            @report_service.operational_efficiency_report(*args)
        else
            raise "Unknown report method: #{method_name}"
        end
    end
    def self.generate_cache_key(method_name, *args)
        Digest::MD5.hexdigest("#{method_name}#{args.join('#')}")
    end

    def self.cache_hit?(key)
        return false unless @cache[key]
        (Time.now - @cache[key][:created_at]) < CACHE_TTL
    end

    def self.cleanup_old_cache
        @cache.delete_if do |key, entry|
            (Time.now - entry[:created_at]) >= CACHE_TTL
        end
    end

    def self.cache_result(key,data)
        @cache[key]={
            data: data,
            size: estimate_data_size(data),
            created_at: Time.now

        }
    end

    def self.estimate_data_size(data)
        Marshal.dump(data).bytesize/1024.0
    end

    def self.estimate_memory_usage
       @cache.values.sum { |entry| entry[:size]||0 }.round(2)
    end

end