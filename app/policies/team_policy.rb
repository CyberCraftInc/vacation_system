class TeamPolicy < ApplicationPolicy
  def index?
    user
  end

  def create?
    user.manager?
  end

  def update?
    user.manager?
  end

  def destroy?
    user.manager?
  end
end
