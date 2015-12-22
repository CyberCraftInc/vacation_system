class UserPolicy < ApplicationPolicy
  def index?
    user
  end

  def create?
    user && user.admin?
  end

  def update?
    user && user.admin?
  end

  def destroy?
    user && user.admin?
  end

  def approval_requests?
    user
  end

  def available_vacations?
    user && user.member?
  end

  def requested_vacations?
    user && user.member?
  end
end
