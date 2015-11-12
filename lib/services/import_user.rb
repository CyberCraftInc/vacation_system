class ImportUser
  EXPECTED_COLUMNS = %w(first_name last_name email birth_date employment_date password)
  STATUS_NEW  = 'NEW'
  STATUS_OK   = 'OK'
  STATUS_FAIL = 'FAIL'

  attr_reader :error

  def initialize(attributes, options = {})
    @options = { verbose: false }.merge(options)
    @attributes = attributes.select { |key| EXPECTED_COLUMNS.include?(key) }
    @status = 'new'
    @error = ''
  end

  def insert_to_db
    User.create!(@attributes)
    @status = STATUS_OK
  rescue StandardError => e
    @status = STATUS_FAIL
    @error = e.message
  end

  def report
    report_verbose      if      @options[:verbose]
    report_with_symbol  unless  @options[:verbose]
  end

  def report_verbose
    puts "#{@attributes['email']} #{@status} #{@error}".strip
  end

  def report_with_symbol
    print @status
  end
end
