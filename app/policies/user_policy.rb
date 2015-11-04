class UserPolicy < ApplicationPolicy
  def index?
    user
  end

  def approval_requests?
    manager_or_member?
  end

  def requested_vacations?
    manager_or_member?
  end

private

  def manager_or_member?
    (user.manager? || user.member?)
  end
end
