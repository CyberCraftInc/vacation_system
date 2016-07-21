# it prevent data clump
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

  def send_birthday_reminder(team_member_mail, name_day, day)
    @name_day = name_day
    @f_name = name_day.first_name
    @l_name = name_day.last_name
    @day = day.strftime('%B %dth')
    mail(to: team_member_mail, subject: "#{@f_name} #{@l_name}'s birthday soon")
  end

  def send_appraisal_reminder(team_member_mail, user, appraisal_day)
    @f_name = user.first_name
    @l_name = user.last_name
    @day = appraisal_day.strftime('%B %dth')
    mail(to: team_member_mail, subject: "#{@f_name} #{@l_name}'s appraisal soon")
  end

  def send_birthday_congrats(user)
    @user = user
    mail(to: @user.email, subject: 'Congratulations!')
  end

  def send_newcomers_congrats(user)
    @user = user
    mail(to: @user.email, subject: 'Welcome!')
  end
end
