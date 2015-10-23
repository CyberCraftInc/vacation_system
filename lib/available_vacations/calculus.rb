module AvailableVacations
  DAYS_IN_YEAR = 365
  # Number of available days per year for each type of vacation
  PLANNED_PER_YEAR = 20
  SICKNESS_PER_YEAR = 21
  UNPAID_PER_YEAR = 0

  # Number of available days per day for each type of vacation
  PLANNED_PER_DAY = PLANNED_PER_YEAR.fdiv(DAYS_IN_YEAR)
  SICKNESS_PER_DAY = SICKNESS_PER_YEAR.fdiv(DAYS_IN_YEAR)
  UNPAID_PER_DAY = 0

  # Hash of rates
  RATES = Hash[
    planned:  PLANNED_PER_DAY,
    unpaid:   UNPAID_PER_DAY,
    sickness: SICKNESS_PER_DAY,
  ]
end
