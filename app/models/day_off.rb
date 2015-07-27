class DayOff < ActiveRecord::Base
  validates :description, :duration, :start,
            presence: true
  validates :description,
            allow_blank: false,
            length: { minimum: 7, maximum: 25 }
  validates :duration,
            numericality: { only_integer: true,
                            greater_than: 0,
                            less_than: 5 }
  validates :start,
            inclusion: { in: Date.new(2015, 01, 01)..Date.new(2115, 01, 01) }
end
