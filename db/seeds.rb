# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
# https://codedecoder.wordpress.com/2013/04/25/rake-db-seed-in-rails/

puts '[i] Populating DB with users.'

# *****************************************************************************
# Add some leaders
leaders = [
  { email: 'iron@i.ua',     first_name: 'J.A.R.V.I.S' },
  { email: 'prime@i.ua',    first_name: 'Optimus',  last_name: 'Prime' },
  { email: 'megatron@i.ua', first_name: 'Megatron' },
  { email: 'ironman@i.ua',  first_name: 'Tony',  last_name: 'Stark' }
]

# Add some members for JARVIS's team
avengers_members = []
10.times do |n|
  avengers_members << { email: "suit#{n}@i.ua",    first_name: "Suit#{n}" }
end

# Add some members for Optimus's team
autobots_members = []
10.times do |n|
  autobots_members << { email: "autobot#{n}@i.ua", first_name: "Autobot#{n}" }
end

# Add some members for Megatron's team
decepticons_members = []
10.times do |n|
  decepticons_members << { email: "decepticon#{n}@i.ua", first_name: "Decepticon#{n}" }
end

users = leaders + avengers_members + autobots_members + decepticons_members

# Provide users with super-strong-and-unique passwords :D
users.each do |u|
  u['password'] = '123456secret'
end

User.create users

puts '[i] Done.'

# *****************************************************************************
# Populate DB with Teams
avengers    = Team.create(name: 'Avengers')
autobots    = Team.create(name: 'Autobots')
decepticons = Team.create(name: 'Decepticons')

# DEPRECATED
# *****************************************************************************
# Populate DB with Vacation Types
# vacation_types = [
#   { name: 'planned' },
#   { name: 'unpaid' },
#   { name: 'sickness' }
# ]
#
# VacationType.create vacation_types

# DEPRECATED
# *****************************************************************************
# Populate DB with Roles
# guest   = Role.create name: 'guest'
# member  = Role.create name: 'member'
# manager = Role.create name: 'manager'

# *****************************************************************************
# Assign leaders to their teams
TeamRole.create do |r|
  r.role_id = manager.id
  r.user_id = User.find_by(first_name: 'J.A.R.V.I.S').id
  r.team_id = avengers.id
end

TeamRole.create do |r|
  r.role_id = manager.id
  r.user_id = User.find_by(first_name: 'Optimus').id
  r.team_id = autobots.id
end

TeamRole.create do |r|
  r.role_id = manager.id
  r.user_id = User.find_by(first_name: 'Megatron').id
  r.team_id = decepticons.id
end

# Populate teams with members
avengers_members.each do |m|
  TeamRole.create do |r|
    r.role_id = member.id
    r.user_id = User.find_by(email: m[:email]).id
    r.team_id = avengers.id
  end
end
TeamRole.create do |r|
  r.role_id = guest.id
  r.user_id = User.find_by(first_name: 'Optimus').id
  r.team_id = avengers.id
end
TeamRole.create do |r|
  r.role_id = guest.id
  r.user_id = User.find_by(first_name: 'Megatron').id
  r.team_id = avengers.id
end


autobots_members.each do |m|
  TeamRole.create do |r|
    r.role_id = member.id
    r.user_id = User.find_by(email: m[:email]).id
    r.team_id = autobots.id
  end
end

decepticons_members.each do |m|
  TeamRole.create do |r|
    r.role_id = member.id
    r.user_id = User.find_by(email: m[:email]).id
    r.team_id = decepticons.id
  end
end

# Let Tony become a guest
TeamRole.create do |r|
  r.role_id = guest.id
  r.user_id = User.find_by(first_name: 'Tony').id
  r.team_id = avengers.id
end
