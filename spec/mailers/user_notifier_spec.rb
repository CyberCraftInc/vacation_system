require 'rails_helper'

RSpec.describe UserNotifier, type: :mailer do
  let(:requester) do
    double User, id: 42, first_name: 'Andrew', last_name: 'Migal',
                 email: 'andrey.migal@gmail.com'
  end
  let(:approver) do
    double User, id: 43, first_name: 'Eugene', last_name: 'Safronov',
                 email: 'es@cybercraft.com'
  end
  let(:vacation_request_participant) do
    double UsersNames, user: requester, approver: approver
  end
  let(:vacation_request) do
    VacationRequest.new(kind: 0, start_date: '2016-08-12',
                        end_date: '2016-08-16', status: 0,
                        user_id: requester.id).decorate
  end
  let(:approval_request) do
    double ApprovalRequest, manager_id: approver.id,
                            vacation_request_id: vacation_request.id
  end

  describe '#send_confirm_email' do
    let(:mail) do
      UserNotifier.send_confirm_email(requester, vacation_request).deliver_now
    end

    it 'renders the subject' do
      expect(mail.subject).to eq('You have requested vacation')
    end

    it 'renders the receiver email' do
      expect(mail.to).to eq([requester.email])
    end

    it 'assigns start_date' do
      expect(mail.body.encoded).to match(vacation_request.start_date_to_s)
    end

    it 'assigns end_date' do
      expect(mail.body.encoded).to match(vacation_request.end_date_to_s)
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

  describe '#send_vacation_request_to_managers' do
    before do
      allow(requester).to receive(:full_name).and_return("#{requester.first_name}"\
      " #{requester.last_name}")
    end
    let(:mail) do
      UserNotifier
        .send_vacation_request_to_managers(requester, approver,
                                           vacation_request,
                                           approval_request).deliver_now
    end

    it 'renders the subject' do
      expect(mail.subject).to match('has requested vacation')
    end

    it "renders the subject's first name" do
      expect(mail.subject).to match(requester.first_name)
    end

    it "renders the subject's last name" do
      expect(mail.subject).to match(requester.last_name)
    end

    it 'renders the receiver email' do
      expect(mail.to).to eq([approver.email])
    end

    it 'assigns @start_date' do
      expect(mail.body.encoded).to match(vacation_request.start_date_to_s)
    end

    it 'assigns @end_date' do
      expect(mail.body.encoded).to match(vacation_request.end_date_to_s)
    end

    it 'assigns @requester.first_name' do
      expect(mail.body.encoded).to match(requester.first_name)
    end

    it 'assigns @requester.first_name' do
      expect(mail.body.encoded).to match(requester.last_name)
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
