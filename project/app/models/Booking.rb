class Booking < ApplicationRecord
    self.table_name = 'booking'
    self.primary_key = 'booking_id'
    
    belongs_to :client, foreign_key: 'client_id'
    belongs_to :master, foreign_key: 'master_id'
    belongs_to :service, foreign_key: 'service_id'

    validates :price,
        numericality: {
            only_integer: true,
            greater_than_or_equal_to: 0,
            less_than_or_equal_to: 100_000
        }
    
    STATUSES = %w[Подтверждена Выполнена Отменена Неявка]
    validates :status, 
        inclusion: { in: STATUSES }
    validates :notes,
        length: { maximum: 1000 },
        allow_blank: true
    
    validate :date_service_valid, on: :create
    validate :client_future_bookings_limit, on: :create
    validate :client_no_show_block, on: :create
    validate :minimum_booking_time, on: :create
    validate :master_is_active
    validate :working_time_valid
    validate :created_at_valid
    validate :master_daily_workload
    validate :client_daily_duration_limit
    validate :price_valid
   
    private

    def client_daily_duration_limit
        return if client.blank? || service.blank? || date_service.blank?

        day_start = date_service.beginning_of_day
        day_end   = date_service.end_of_day

        total_minutes = Booking
            .joins(:service)
            .where(client_id: client_id)
            .where(date_service: day_start..day_end)
            .sum('service.duration')

        total_minutes += service.duration

        if total_minutes > 4.hours.in_minutes
            errors.add(:base, 'Общая длительность услуг клиента в день не должна превышать 4 часов')
        end
    end

    def minimum_booking_time
        return if service.blank? || date_service.blank?

        limit = service.category == 'Маникюр' ? 1.hour : 2.hours

        if date_service < Time.current + limit
            errors.add(
                :date_service,
                "запись должна быть создана минимум за #{limit / 1.hour} час(а)"
            )
        end
    end

    def master_daily_workload
        return if master.blank? || service.blank? || date_service.blank?

        day_start = date_service.beginning_of_day
        day_end   = date_service.end_of_day

        total_minutes = Booking
            .joins(:service)
            .where(master_id: master_id)
            .where(date_service: day_start..day_end)
            .sum('service.duration')

        total_minutes += service.duration

        if total_minutes > 8.hours.in_minutes
            errors.add(:base, 'Мастер не может иметь более 8 часов записей в день')
        end
    end

    def client_no_show_block
        return if client.blank?

        one_month_ago = 1.month.ago

        no_show_count = Booking
            .where(client_id: client_id, status: 'Неявка')
            .where('created_at >= ?', 1.month.ago)
            .count

        return if no_show_count < 3

        last_no_show = Booking
            .where(client_id: client_id, status: 'Неявка')
            .order(created_at: :desc)
            .first

        block_until = last_no_show.created_at + 30.days

        if Time.current < block_until
            errors.add(
                :base,
                "Запись невозможна. Клиент заблокирован до #{block_until.strftime('%d.%m.%Y')}"
            )
        end
    end

    def client_future_bookings_limit
        return if client.blank? || date_service.blank?

        future_confirmed_count = Booking
            .where(client_id: client_id, status: 'Подтверждена')
            .where('date_service > ?', Time.current)
            .count

        if future_confirmed_count >= 3
            errors.add(:base, 'Клиент не может иметь более 3 будущих подтверждённых записей')
        end
    end

    def price_valid
        return if price.blank? || service.blank?

        min_price = (service.base_price * 0.8).round
        max_price = (service.base_price * 1.5).round

        if price < min_price
            errors.add(:price, "не может быть меньше #{min_price}")
        end

        if price > max_price
            errors.add(:price, "не может быть больше #{max_price}")
        end

        if service.category == 'Маникюр' && price < 500
            errors.add(:price, 'для услуги Маникюр минимальная цена 500 рублей')
        end
    end

    def working_time_valid
        return if date_service.blank?

        time = date_service

        if time.saturday? || time.sunday?
            errors.add(:date_service, 'запись невозможна в выходные дни')
        end

        if time.hour < 9 || (time.hour == 21 && time.min > 0) || time.hour > 21
            errors.add(:date_service, 'запись возможна только с 9:00 до 21:00')
        end

        if time.min % 15 != 0
            errors.add(:date_service, 'время должно быть кратно 15 минутам')
        end
    end

    def master_is_active
        if master && !master.is_active
            errors.add(:master_id, "не активен и не может принимать записи")
        end
    end

    def created_at_valid
        return if created_at.blank?
        errors.add(:created_at, 'не может быть в будущем') if created_at > Time.current
    end
    
    def date_service_valid
        return if date_service.blank?

        if date_service <= Time.current
            errors.add(:date_service, 'должна быть в будущем')
        end

        if date_service > 3.months.from_now
            errors.add(:date_service, 'не может быть более чем на 3 месяца вперёд')
        end
    end
end