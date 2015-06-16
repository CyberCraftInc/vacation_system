class VacationType < ActiveRecord::Base
  has_many  :vacation_requests
  has_many  :available_vacations
end
