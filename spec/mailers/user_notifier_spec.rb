require 'rails_helper'

RSpec.describe UserNotifier, type: :mailer do
  let(:requester) do
    double User, first_name: 'Andrew', last_name: 'Migal',
                 email: 'andrey.migal@gmail.com'
  end
  let(:approver) do
    double User, first_name: 'Eugene', last_name: 'Safronov',
                 email: 'es@cybercraft.com'
  end
  let(:vacation_request_participant) do
    double UsersNames, user: requester, approver: approver
  end

  describe '#send_confirm_email' do
    let(:mail) { UserNotifier.send_confirm_email(requester).deliver_now }

    it 'renders the subject' do
      expect(mail.subject).to eq('You have requested vacation')
    end

    it 'renders the receiver email' do
      expect(mail.to).to eq([requester.email])
    end
  end

  describe '#send_accepted_email' do
    let(:mail) do
      UserNotifier.send_accepted_email(vacation_request_participant).deliver_now
    end

    it 'renders the subject' do
      expect(mail.subject).to eq('Your vacation request was accepted')
    end

    it 'renders the receiver email' do
      expect(mail.to).to eq([requester.email])
    end

    it 'assigns @approver.last_name' do
      expect(mail.body.encoded).to match(approver.last_name)
    end
  end

  describe '#send_declined_email' do
    let(:mail) do
      UserNotifier.send_declined_email(vacation_request_participant).deliver_now
    end

    it 'renders the subject' do
      expect(mail.subject).to eq('Your vacation request was declined')
    end

    it 'renders the receiver email' do
      expect(mail.to).to eq([requester.email])
    end

    it 'assigns @approver.last_name' do
      expect(mail.body.encoded).to match(approver.last_name)
    end
  end
end
