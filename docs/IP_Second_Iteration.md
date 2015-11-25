#               Second Iteration Implementation Proposal

[General]: #general
##    GENERAL
### Proposals
The application should inform a user about events in response to the user input.
See issue [#35](https://github.com/CyberCraftInc/vacation_system/issues/35).


[Roles]: #roles
##    ROLES
### Description
Roles provide particular privileges to users.

All users are supposed to be assigned to particular teams.
A single user can be assigned to any number of teams.

All users are supposed to have particular roles in teams.
A single user is supposed to be provided with a role in particular team.

Combination of a team a user is assigned to, and roles provided to a user
in the team, give a user particular privileges.

The application considers the following roles:
  - manager,
  - member,
  - guest.

For technical details on roles, see [Appendix A].

### Proposals
The following roles should be added:
  - administrator.


### Administrator Role
#### Proposals
The **administrator** role should provide the following privileges:
  - to create teams;
  - to remove _empty_ teams;
  - to invite new users;
  - to add users to teams;
  - to remove users from teams;
  - to add holidays;
  - to update holidays;
  - to remove holidays.

See issue [#109](https://github.com/CyberCraftInc/vacation_system/issues/109).


### Manager Role
#### Description
The **manager** role provides the following privileges:
  - to approve vacation requests from all team mate users;
  - to decline vacation requests from all team mate users;
  - to add new holidays;
  - to update holidays;
  - to delete holidays.

#### Proposals
The **manager** role should provide the following privileges:
  - to approve vacation requests from team mate users with a **member** role;
  - to decline vacation requests from team mate users with a **member** role.

So, a user with a role in subject should not approve vacation
requests from team mate users with **manager** role.
See issue [#88](https://github.com/CyberCraftInc/vacation_system/issues/88).

Also, the role should not allow a user to do manipulations on holidays.
See issue [#108](https://github.com/CyberCraftInc/vacation_system/issues/108).


### Member Role
#### Description
User with the **member** role has the following privileges:
  - to request a vacation;
  - to cancel own vacation requests.


### Guest Role
#### Proposals
User with the **guest** role has the following privileges:
  - to visit Dashboard page;
  - to see time tables for teams where the user has the role in subject.

The user with the role can only visit the following pages:
  - Dashboard;
  - Settings;
  - Sign in.



[User Interface]: #user-interface
##    USER INTERFACE
### Description
The application has the following information representation pages
paired as a menu item name and a respecting URI:
  - Dashboard,  [#/dashboard]
  - Teams,      [#/teams]
  - Vacations,  [#/vacation_requests]
  - Holidays,   [#/holidays]
  - Sign in,    [users/sign_in]

The **Sign out** [users/sign_out] menu item triggers functionality without any visual representation.

### Proposals
Replace the **Sign out** menu item with the **Profile** drop-down menu item.

The **Profile** should consist of the following items:
  - Settings,
  - Sign out.


[Dashboard]: #dashboard
##    DASHBOARD
The page has the following separate sections:
  - Requests,
  - Pending Approval Requests,
  - Vacations Time Table.

The page also provides a control for selecting teams to see in
the **Vacations Time Table** section.

### Requests
#### Description
The section represents a table with user's vacation requests that are to be approved
by team mates with the **manager** role.

The table has the following columns:
  - Start date;
  - End date;
  - Duration;
  - Type;
  - Approvers;
  - Operations.

### Pending Approval Requests
#### Description
The section represents a table with user's vacation requests that are to be approved
by team mates with the **manager** role.

The table has the following columns:
  - Start date;
  - End date;
  - Type;
  - Duration;
  - Available Days;
  - User;
  - Operations.

### Vacations Time Table
#### Description
#### Proposals
The time table has unpredictable behavior in case of picking empty or wrong dates.
A solution should be proposed to prevent the issue.
See issue [#39](https://github.com/CyberCraftInc/vacation_system/issues/39).

The implementations of time tables for day and week mode have many lines of duplicated code.
The code should be restructured.
See issue [#69](https://github.com/CyberCraftInc/vacation_system/issues/69).

Fix layout floating in time table in day mode.
See issue [#112](https://github.com/CyberCraftInc/vacation_system/issues/69).



[Vacations]: #vacations
##    VACATIONS
### General
#### Proposals
Vacations intersections calculation should be simplified.
See issue [#48](https://github.com/CyberCraftInc/vacation_system/issues/48).

Sickness leave should not be accumulatedю
See issue [#114](https://github.com/CyberCraftInc/vacation_system/issues/114).

Add additional section with vacations related summary of a user.
The following information should be included:
  - number of requested days for a year;
  - number of used days for a year;
  - number of accumulated days for a year;

For example, a user employed on `2011-01-01` may have the following summary on planned vacations:

| Year      | Accumulated | Used | Requested | Left |
|-----------|:-----------:|:----:|:---------:|:----:|
| 2015      |      12     |   5  | 20        |  7   |
| 2014      |      20     |   5  | 5         |  15  |
| 2013      |      20     |   0  |           |  20  |
| 2012      |      20     |   7  |           |  13  |
| 2011      |      20     |   0  |           |  20  |
| **Total** |      72     |  12  |           |  60  |
See issue [#113](https://github.com/CyberCraftInc/vacation_system/issues/113).


### Request New Vacation
#### Proposals
`TODO`

[Holidays]: #holidays
##    HOLIDAYS
The application provides some functionality for managing holidays.
The page with all the functionality can be accessed with the `#/dashboard` URI.

### Description
#### User Interface
The page represents the following:
  - a form for adding new holidays;
  - a list of all the holidays stored in DB;
  - a link to list of Ukrainian holidays on **www.timeanddate.com**.

### Proposals
See the following issues:

  - Add UPDATE button to the list of holidays, [#99](https://github.com/CyberCraftInc/vacation_system/issues/99)
  - Show confirmation dialog on removing a holiday, [#107](https://github.com/CyberCraftInc/vacation_system/issues/107)
  - Create composite key in holidays DB table, [#76](https://github.com/CyberCraftInc/vacation_system/issues/76)



[Teams]: #teams
##    Teams
### Description
The page provides the following functionality for users with the **manager** role:
  - adding new teams;
  - editing teams.

### Proposals
Only users with the **administrator** role should be able to do manipulations on teams.

The following functionality should added:
  - to add users to teams;
  - to remove users from teams;
  - to grant roles to users in particular team;
  - to revoke roles from users in particular team.



[Users]: #users
##    Users
### Proposals
A user dedicated page should be presented to users.
It should be called **Settings**. The page should allow a user to do the following:
  - to change name;
  - to change surname;
  - to change user name;
  - to change date of birth;
  - to change date of employment;
  - to change email;
  - to change password.


##    ESTIMATIONS
| Feature                                                                     | Planned hours | Spent hours | Status  |
|-----------------------------------------------------------------------------|:-------------:|:-----------:|---------|
| [Vacations]                                                                 |       40      |      0      | planned |
| Show confirmation dialog on removing a holiday                              |       2       |      0      | planned |
| Create composite key in holidays DB table                                   |       4       |      0      | planned |
| Managers should not approve requests from other managers from the same team |       8       |      0      | planned |
| Add UPDATE button to the list of holidays                                   |       8       |      0      | skipped |
| Refactoring of vacations intersections finding logic                        |       2       |      0      | skipped |
| Time table unpredictable behavior                                           |       8       |      0      | skipped |
| Refactoring of BB TimeTableByDay and TimeTableByWeek                        |       4       |      0      | skipped |
| Implement error notifications in BB views                                   |       16      |      4      | ongoing |
| [Users]                                                                     |       40      |      60     | done    |
| [Teams]                                                                     |       40      |      40     | done    |
| Add administrator role                                                      |       8       |      8      | done    |
| Manager should not do any manipulations on holidays                         |       4       |      4      | done    |
| Add information about duration of each vacation to be approved              |       2       |      1      | done    |
| Show detailed status of an own vacation request                             |       2       |      8      | done    |
| Add information about own vacation duration                                 |       2       |      1      | done    |
| Add information about own vacations duration on **Vacations** page          |       2       |      1      | done    |

NOTE: The table is prepared with [Markdown Tables Generator ](http://www.tablesgenerator.com/markdown_tables)



##    APPENDICES
[Appendix A]: #appendix-a-teamrole-model

### Appendix A. TeamRole Model
#### Data Structure
The model has the following data structure:
```ruby
class TeamRole < ActiveRecord::Base {
            :id => :integer,
          :role => :integer,
       :user_id => :integer,
       :team_id => :integer,
    :created_at => :datetime,
    :updated_at => :datetime
}
```

The `role` is represented as an enumeration alike Rails object:
```ruby
enum role: [
  :guest,   # 0
  :member,  # 1
  :manager  # 2
]
```
For further details on Rails enumeration, see the reference for [ActiveRecord::Enum](http://edgeapi.rubyonrails.org/classes/ActiveRecord/Enum.html).

#### Table Representation
The model is represented in DB as follows:

```
+----+---------+---------+---------+
| id | role    | user_id | team_id |
+----+---------+---------+---------+
| 1  | manager | 1       | 1       |
| 7  | member  | 5       | 1       |
| 6  | member  | 4       | 1       |
| 4  | manager | 2       | 2       |
| 5  | manager | 3       | 2       |
| 3  | manager | 1       | 2       |
| 14 | member  | 11      | 2       |
| 13 | member  | 10      | 2       |
| 12 | member  | 9       | 2       |
| 11 | member  | 8       | 2       |
| 10 | member  | 7       | 2       |
| 9  | member  | 6       | 2       |
| 15 | member  | 13      | 2       |
| 2  | manager | 1       | 3       |
| 8  | member  | 12      | 3       |
+----+---------+---------+---------+
```

**NOTE**: The columns `created_at` and `updated_at` are omitted.

**NOTE**: The above printout is provided by the following command in Rails console:
```ruby
TeamRole.select(:id, :role, :user_id, :team_id).order(team_id: :asc, role: :desc)
```
