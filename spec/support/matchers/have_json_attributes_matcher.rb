# Matcher that checks if JSON data contain expected attributes
# Does not check ordering, that is, the following objects are equal:
# {:a, :b}, {:b, :a}
RSpec::Matchers.define :have_json_attributes do |expected|
  match do |response_body|
    begin
      @result = JSON.parse response_body
      @expected = expected
      match?
    rescue
      false
    end
  end

  def match?
    if @result.empty?
      @result == @expected
    else
      @result.first.keys - @expected == @expected - @result.first.keys
    end
  end

  failure_message do
    if @result.first.nil?
      "expected [] to match #{@expected}"
    else
      "expected #{@result.first.keys} to match #{@expected}"
    end
  end

  failure_message_when_negated do
    if @result.first.nil?
      "expected [] not to match #{@expected}"
    else
      "expected #{@result.first.keys} not to match #{@expected}"
    end
  end
end
