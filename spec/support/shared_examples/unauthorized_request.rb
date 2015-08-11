RSpec.shared_examples 'unauthorized request' do
  before { send_request }

  it { expect(response).to have_http_status(:unauthorized) }

  it 'should contain error message as JSON data in response body' do
    expect(response.body).to have_json_attribute(:error)
      .with_value('You need to sign in or sign up before continuing.')
  end
end
