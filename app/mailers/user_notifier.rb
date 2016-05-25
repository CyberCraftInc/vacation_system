# it receives data clump
UsersNames = Struct.new(:user, :approver)

# it sends notifications about vacation request
class UserNotifier < ApplicationMailer
  def send_accepted_email(a_user)
    send_vacation_response(a_user, 'Your vacation request was accepted')
  end

  def send_declined_email(a_user)
    send_vacation_response(a_user, 'Your vacation request was declined')
  end

  def send_confirm_email(user)
    @user = user
    mail(to: @user.email, subject: 'You have requested vacation')
  end

  def send_vacation_response(a_user, message)
    @user = a_user.user
    @approver = a_user.approver
    mail(to: @user.email, subject: message)
  end
end
