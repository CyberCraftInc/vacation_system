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

  def destroy?
    user.manager? || user.member?
  end
end
