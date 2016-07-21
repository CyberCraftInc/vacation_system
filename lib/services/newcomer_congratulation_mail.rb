class NewcomerCongratulationMail
    def self.check_employment_date
      User.where('employment_date like :time_now',
                 time_now: "%#{Time.now.strftime('%m-%d')}").find_each do |user|
        UserNotifier.send_newcomers_congrats(user).deliver_now
      end
    end
end