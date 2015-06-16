class VacationStatus < ActiveRecord::Base
  has_many  :vacation_requests
end
