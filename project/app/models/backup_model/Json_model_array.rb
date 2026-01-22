class JsonModelArray
    attr_reader :data, :klass
    
    def initialize(data, klass)
        @data = data
        @klass = klass
    end

    def where(conditions = {})
        filtered = @data.select do |item|
            conditions.all? do |key, value|
                item[key.to_s] == value || item[key.to_s].to_s == value.to_s
            end
        end
    
        JsonModelArray.new(filtered, @klass)
    end

    def as_json(options = {})
        @data
    end
    
end