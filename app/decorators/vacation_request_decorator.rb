class VacationRequestDecorator < Draper::Decorator
  delegate_all

  def vacation_duration
    object.duration(Holiday.dates)
  end

  def start_date_to_s
    object.start_date.strftime('%A %d-%m %Y')
  end

  def end_date_to_s
    object.end_date.strftime('%A %d-%m %Y')
  end
end
