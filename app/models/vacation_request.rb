class VacationRequest < ActiveRecord::Base
  belongs_to  :user
  has_many    :approval_requests
end
