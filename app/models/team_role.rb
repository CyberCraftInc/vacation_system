class TeamRole < ActiveRecord::Base
  belongs_to :holder, polymorphic: true
end
