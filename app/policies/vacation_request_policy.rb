class VacationRequestPolicy < ApplicationPolicy
  def index?
    user
  end

  def create?
    user.manager? || user.member?
  end

  def update?
    user.manager? || user.member?
  end

  def cancel?
    (user.manager? || user.member?) && user.owns_vacation_request?(record)
  end
end
