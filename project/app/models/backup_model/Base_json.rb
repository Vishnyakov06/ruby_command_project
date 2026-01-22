require 'json'
require_relative 'Json_model_array'
require_relative '../StrategyDb'

class BaseJson
    @@path_to_backup_dir = Rails.root.join('backup', 'backup_jsons')

    def self.file_path
        @@file_path
    end
    
    class << self

        def file_path=(filename)
            full_path = File.join(@@path_to_backup_dir, filename.to_s + '.json')
            unless File.exist?(full_path)
                raise ArgumentError, "Файл '#{filename}' не найден в директории '#{@@path_to_backup_dir}'"
            end

            @@file_path = full_path
        end

        def model 
            raise NotImplementedError, "Метод model должен быть реализован в потомках"
        end
        
        def all
            load_data[model] || []
        end
        
        def find(id)
            data = all.find { |item| item[primary_key] == id.to_i }
            data ? new(data) : nil
        end
        
        def where(conditions = {})
            data = all.select do |item|
                conditions.all? { |key, value| item[key.to_s] == value.to_s }
            end
            data
        end
        
        def create(attributes)
            data = all

            new_id = (data.map { |item| item[primary_key] }.max || 0) + 1
            normalized_attributes = attributes.to_h.transform_keys(&:to_s)
            normalized_attributes[primary_key] = new_id
            normalized_attributes = create_hook(normalized_attributes)
            
            data << normalized_attributes
            save_data(data)
            new(normalized_attributes)
        end

        def create!(attributes)
            begin 
                create(attributes)
            rescue
                raise ActiveRecord::RecordInvalid, "Ошибка при создании"
            end
        end
        
        def count
            all.size
        end
        
        def first
            data = all.first
            data ? new(data) : nil
        end
        
        def last
            data = all.last
            data ? new(data) : nil
        end

        def delete_all
            save_data([])
        end
        
        def primary_key
            "#{model.to_s.singularize}_id"
        end

        def includes(*associations)
            data = all

            associations.each do |item|
                item_class = StrategyDb.get_class_by_marker(item)
                
                data.map! do |elem|
                    elem[item] = item_class.find(elem[item_class.primary_key]).to_h
                    elem
                end
            end
            JsonModelArray.new(data, model)
        end
        
        private

        def create_hook(hash)
            hash
        end
        
        def load_data
            file_content = File.read(file_path)
            JSON.parse(file_content)
        end
        
        def save_data(new_data)
            all_data = load_data
            all_data[model] = new_data
            
            File.write(file_path, JSON.pretty_generate(all_data))
            all_data
        end
    end

    def initialize(attributes = {})
        @attributes = attributes.transform_keys(&:to_s)
    end

    def save
        if id.nil?
            self.class.create(@attributes)
        else
            update(@attributes)
        end 
    end

    def as_json(options = {})
        my_hash = to_h()

        if options[:include].is_a?(Array)
            options[:include].each do |association|
                item_class = StrategyDb.get_class_by_marker(association)
                my_hash[association] = item_class.find(my_hash[item_class.primary_key]).to_h
            end
        elsif options[:include].is_a?(Hash)
            options[:include].each do |association, sub_options|
                item_class = StrategyDb.get_class_by_marker(association)
                my_hash[association] = item_class.find(my_hash[item_class.primary_key]).to_h
            end
        end
        my_hash
    end

    def persisted?
        !id.nil? && id > 0
    end

    def new_record?
        !persisted?()
    end

    def id
        @attributes[self.class.primary_key]
    end

    def update(attributes)
        data = self.class.all
        index = data.find_index { |item| item[self.class.primary_key] == id.to_i}
        return false unless index
        
        data[index] = data[index].merge(attributes)
        save_data(data)
        true
    end

    def update!(attributes)
        begin 
            update(attributes)
        rescue
            raise ActiveRecord::RecordInvalid
        end
    end
            
    def destroy
        data = self.class.all
        index = data.find_index { |item| item[self.class.primary_key] == id }
        
        return false unless index
        
        deleted_item = data.delete_at(index)
        save_data(data)
        true
    end
    
    def to_h
        @attributes
    end

    def attributes
        to_h
    end

    def load_data
        file_content = File.read(@@file_path)
        JSON.parse(file_content)
    end
    
    def save_data(new_data)
        all_data = load_data
        all_data[self.class.model] = new_data
        
        File.write(@@file_path, JSON.pretty_generate(all_data))
        all_data
    end
end