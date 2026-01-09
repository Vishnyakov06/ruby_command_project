# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 4) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "booking", primary_key: "booking_id", id: :serial, force: :cascade do |t|
    t.integer "client_id", null: false
    t.datetime "created_at", precision: nil, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "date_service", precision: nil, null: false
    t.integer "master_id", null: false
    t.text "notes"
    t.integer "price", null: false
    t.integer "service_id", null: false
    t.string "status", limit: 20, default: "Подтверждена", null: false

    t.check_constraint "status::text = ANY (ARRAY['Подтверждена'::character varying::text, 'Выполнена'::character varying::text, 'Отменена'::character varying::text, 'Неявка'::character varying::text])", name: "booking_status_check"
    t.unique_constraint ["master_id", "date_service"], name: "booking_master_id_date_service_key"
  end

  create_table "client", primary_key: "client_id", id: :serial, force: :cascade do |t|
    t.string "first_name", limit: 50, null: false
    t.string "last_name", limit: 50, null: false
    t.string "patronymic", limit: 50
    t.string "phone_number", limit: 20, null: false
    t.date "registartion_date", default: -> { "CURRENT_DATE" }, null: false

    t.unique_constraint ["phone_number"], name: "client_phone_number_key"
  end

  create_table "master", primary_key: "master_id", id: :serial, force: :cascade do |t|
    t.string "first_name", limit: 50, null: false
    t.boolean "is_active", default: true, null: false
    t.string "last_name", limit: 50, null: false
    t.string "patronymic", limit: 50
    t.string "phone_number", limit: 20, null: false

    t.unique_constraint ["phone_number"], name: "master_phone_number_key"
  end

  create_table "service", primary_key: "service_id", id: :serial, force: :cascade do |t|
    t.integer "base_price", null: false
    t.string "category", limit: 50, null: false
    t.interval "duration", null: false
    t.string "title", limit: 100, null: false
    t.check_constraint "category::text = ANY (ARRAY['Cтрижка'::character varying::text, 'Окрашивание'::character varying::text, 'Укладка'::character varying::text, 'Маникюр'::character varying::text, 'Педикюр'::character varying::text, 'Визаж'::character varying::text, 'Депиляция'::character varying::text, 'Массаж'::character varying::text, 'Косметология'::character varying::text])", name: "service_category_check"
  end

  add_foreign_key "booking", "client", primary_key: "client_id", name: "booking_client_id_fkey", on_delete: :cascade
  add_foreign_key "booking", "master", primary_key: "master_id", name: "booking_master_id_fkey", on_delete: :cascade
  add_foreign_key "booking", "service", primary_key: "service_id", name: "booking_service_id_fkey", on_delete: :cascade
end
