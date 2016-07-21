class BirthdayCongratulationMail
  def self.check_birthdays
    User.where('birth_date like :time_now',
               time_now: "%#{Time.now.strftime('%m-%d')}").find_each do |user|
      UserNotifier.send_birthday_congrats(user).deliver_now
    end
  end
end
