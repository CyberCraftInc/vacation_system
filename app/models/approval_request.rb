class ApprovalRequest < ActiveRecord::Base
  belongs_to  :vacation_request
  belongs_to  :user, foreign_key: :manager_id
end
