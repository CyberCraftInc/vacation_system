shared_examples 'a pretty request' do
  it 'responds with status code :ok (200)' do
    send_request
    expect(response).to have_http_status(:ok)
  end
end
