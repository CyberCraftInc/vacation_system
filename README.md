#   Sandbox for AR relations

##  Useful links
https://github.com/turingschool/lesson_plans/tree/master/ruby_02-web_applications_with_ruby
http://condor.depaul.edu/sjost/it231/documents/one-to-many.htm

##  Models
### `DayOff`
- Generate model:
  ```
  rails g model DayOff \
      description:string \
      start:date \
      duration:integer
  ```


### `VacationRequest`
- Generate model:
  ```
  rails g model VacationRequest \
      type:string \
      start:date \
      end:date \
      duration:integer \
      status:string \
      user:references
  ```

- Define one-to-many relation with `VacationRequest` in `vacation_requests.rb`:
  ```ruby
  has_many  :approval_requests
  ```


### `AvailableVacation`
- Generate model:
  ```
  rails g model AvailableVacation \
      type:string \
      available_days:float \
      user:references
  ```
  <!-- TODO: float? -->


### `ApprovalRequest`

- Generate model:
  ```
  rails g model ApprovalRequest \
      manager_id:integer \
      vacation_request:references
  ```
- Define relations:
  ```ruby
  belongs_to  :user, foreign_key: :manager_id
  ```


### `TeamRole`
- Generate model:
  ```
  rails g model TeamRole \
      role:string \
      holder:references{polymorphic}
  ```


### `Team`
- Generate model:
  ```
  rails g model Team \
      name:string
  ```

- Define relations:
  ```ruby
  has_many  :team_roles, as: :holder
  ```


### `User`
- Generate User model:
```
rails g model User \
    first_name:string \
    last_name:string \
    position:string \
    birth_date:date \
    username:string:uniq
```

- Define relations:
  ```ruby
  has_many  :team_roles, as: :holder
  has_many  :vacation_requests
  has_many  :available_vacations
  has_many  :approval_requests
  ```
