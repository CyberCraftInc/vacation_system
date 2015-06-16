class VacationRequest < ActiveRecord::Base
  belongs_to  :user
  belongs_to  :vacation_types
  belongs_to  :vacation_statuses
  has_many    :approval_requests
end
