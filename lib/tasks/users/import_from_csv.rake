namespace :users do
  desc 'Append users from users.csv file into DB'
  task import_from_csv: :environment do
    require 'csv'
    # require 'lib/services/import_user'
    require File.join(Rails.root, 'lib', 'services', 'import_user')

    records = CSV.parse(File.read('users.csv'), headers: true)
    records.each do |record|
      service = ImportUser.new(record.to_hash, verbose: true)
      service.insert_to_db
      service.report
    end
  end
end
