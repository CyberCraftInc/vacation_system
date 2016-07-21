require File.join(Rails.root, 'lib', 'services', 'newcomer_congratulation_mail')

namespace :newcomers do
  desc 'run employment date check'
  task congratulate: :environment do
    NewcomerCongratulationMail.check_employment_date
  end
end
