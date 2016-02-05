describe('VacationRequest model', function() {
  beforeEach(function() {
    this.model = new App.Models.VacationRequest();
  });

  it('is able to create its instance', function() {
    expect(this.model).toBeDefined();
  });

  describe('with Backbone.Validation mixin', function() {
    it('has .validate() method', function() {
      expect(this.model.validate).toBeDefined();
    });

    it('has .isValid() method', function() {
      expect(this.model.isValid).toBeDefined();
    });

    it('has .preValidate() method', function() {
      expect(this.model.preValidate).toBeDefined();
    });

    it('has .validation property', function() {
      expect(this.model.validation).toBeDefined();
    });
  });


  describe('as a new instance', function() {
    describe('sets its attribute properly,', function() {
      it('kind="regular"', function() {
        expect(this.model.get('kind')).toEqual('regular');
      });
      it('status="requested"', function() {
        expect(this.model.get('status')).toEqual('requested');
      });
      it('start_date=""', function() {
        expect(this.model.get('start_date')).toEqual('');
      });
      it('end_date=""', function() {
        expect(this.model.get('end_date')).toEqual('');
      });
    });

    it('is not valid', function() {
      expect(this.model.isValid(true)).toBeFalsy();
    });
  });

  it('has .calculateDuration() method', function() {
    expect(this.model.calculateDuration).toBeDefined();
    expect(this.model.calculateDuration).toEqual(jasmine.any(Function));
  });

  it('has .getEndMoment() method', function() {
    expect(this.model.getEndMoment).toBeDefined();
    expect(this.model.getEndMoment).toEqual(jasmine.any(Function));
  });

  it('has .getStartMoment() method', function() {
    expect(this.model.getStartMoment).toBeDefined();
    expect(this.model.getStartMoment).toEqual(jasmine.any(Function));
  });

  it('has .toDates() method', function() {
    expect(this.model.toDates).toBeDefined();
    expect(this.model.toDates).toEqual(jasmine.any(Function));
  });

  describe('with .calculateDuration()', function() {
    beforeEach(function() {
      this.model.set('start_date', '2015-08-25');
      this.model.set('end_date', '2015-09-05');
      this.numberOfWeekends = 3;
      this.numberOfVacationDays = 12;
    });

    describe('with holiday inside of vacation request date range', function() {
      beforeEach(function() {
        this.holidays = new App.Collections.Holidays([{'start':'2015-08-29', 'duration':3}]);
        this.result = this.numberOfVacationDays - 1 - this.numberOfWeekends;
      });
      it('returns proper duration', function() {
        expect(this.model.calculateDuration(this.holidays)).toEqual(this.result);
      });
    });

    describe('with holiday outside of vacation request date range', function() {
      beforeEach(function() {
        this.holidays = new App.Collections.Holidays([{'start':'2015-10-01', 'duration':3}]);
        this.result = this.numberOfVacationDays - this.numberOfWeekends;
      });
      it('returns proper duration', function() {
        expect(this.model.calculateDuration(this.holidays)).toEqual(this.result);
      });
    });

    describe('with holiday intersecting with vacation request date range start', function() {
      beforeEach(function() {
        this.holidays = new App.Collections.Holidays([{'start':'2015-08-24', 'duration':3}]);
        this.result = this.numberOfVacationDays - 2 - this.numberOfWeekends;
      });
      it('returns proper duration', function() {
        expect(this.model.calculateDuration(this.holidays)).toEqual(this.result);
      });
    });

    describe('with holiday intersecting with vacation request date range end', function() {
      beforeEach(function() {
        this.holidays = new App.Collections.Holidays([{'start':'2015-09-04', 'duration':3}]);
        this.result = this.numberOfVacationDays - 1 - this.numberOfWeekends;
      });
      it('returns proper duration', function() {
        expect(this.model.calculateDuration(this.holidays)).toEqual(this.result);
      });
    });

    describe('with holidays intersecting with vacation request date range boundaries', function() {
      beforeEach(function() {
        this.holidays = new App.Collections.Holidays([{'start':'2015-08-24', 'duration':3},{'start':'2015-09-04', 'duration':3}]);
        this.result = this.numberOfVacationDays - 2 - 1 - this.numberOfWeekends;
      });
      it('returns proper duration', function() {
        expect(this.model.calculateDuration(this.holidays)).toEqual(this.result);
      });
    });

    describe('with holidays intersecting with vacation request date range boundaries, and a holiday inside of vacation request date range', function() {
      beforeEach(function() {
        this.holidays = new App.Collections.Holidays([{'start':'2015-08-24', 'duration':3},{'start':'2015-09-02', 'duration':1},{'start':'2015-09-04', 'duration':3}]);
        this.result = this.numberOfVacationDays - 1 - 1 - 2 - this.numberOfWeekends;
      });
      it('returns proper duration', function() {
        expect(this.model.calculateDuration(this.holidays)).toEqual(this.result);
      });
    });

    describe('with date range limitation that truncates vacation duration at its tail', function() {
      beforeEach(function() {
        this.model.set('start_date', '2015-12-25');
        this.model.set('end_date', '2016-01-05');
        this.numberOfWeekends = 2;
        this.numberOfVacationDays = 7;
        this.dateRange = {'start':'2015-01-01', 'end':'2015-12-31'};

        this.result = this.numberOfVacationDays - this.numberOfWeekends;
        this.holidays = new App.Collections.Holidays([]);
      });
      it('returns proper duration', function() {

        expect(this.model.calculateDuration(this.holidays, this.dateRange)).toEqual(this.result);
      });
    });

    describe('with date range limitation that truncates vacation duration at its head', function() {
      beforeEach(function() {
        this.model.set('start_date', '2015-12-25');
        this.model.set('end_date', '2016-01-05');
        this.numberOfWeekends = 2;
        this.numberOfVacationDays = 5;
        this.dateRange = {'start':'2016-01-01', 'end':'2016-12-31'};

        this.result = this.numberOfVacationDays - this.numberOfWeekends;
        this.holidays = new App.Collections.Holidays([]);
      });
      it('returns proper duration', function() {

        expect(this.model.calculateDuration(this.holidays, this.dateRange)).toEqual(this.result);
      });
    });
  });

  describe('with .getEndMoment()', function() {
    beforeEach(function() {
      this.model.set('start_date', '2015-08-25');
      this.model.set('end_date', '2015-08-27');
      this.result = moment('2015-08-27', App.Helpers.getDateFormat());
    });

    it('returns proper moments.js instance', function() {
      var obj = this.model.getEndMoment();
      expect(moment.isMoment(obj)).toBeTruthy();
      expect(obj.format(App.Helpers.getDateFormat())).toEqual('2015-08-27');
    });
  });

  describe('with .getStartMoment()', function() {
    beforeEach(function() {
      this.model.set('start_date', '2015-08-25');
      this.model.set('end_date', '2015-08-27');
      this.result = moment('2015-08-25', App.Helpers.getDateFormat());
    });

    it('returns proper moments.js instance', function() {
      var obj = this.model.getStartMoment();
      expect(moment.isMoment(obj)).toBeTruthy();
      expect(obj.format(App.Helpers.getDateFormat())).toEqual('2015-08-25');
    });
  });

  describe('with .toDates()', function() {
    beforeEach(function() {
      this.model.set('start_date', '2015-08-25');
      this.model.set('end_date', '2015-08-27');
      this.result = ['2015-08-25', '2015-08-26', '2015-08-27'];
    });

    it('returns proper set of dates', function() {
      expect(this.model.toDates()).toEqual(this.result);
    });
  });

  describe('.set', function() {
    it('does not allow to set not expected attributes', function() {
      var predefined_object = {
            'status': App.Vacation.statuses.requested,
            'kind': App.Vacation.types.planned,
            'alien_attribute':'',
          },
          that = this;
      expect(function(){that.model.set(predefined_object);}).toThrow();
    });

    it('sets attributes from object', function() {
      var predefined_object = {
            'kind': App.Vacation.types.planned,
            'status': App.Vacation.statuses.requested,
            'start_date':'',
            'end_date':''
          },
          that = this;
      expect(function(){that.model.set(predefined_object);}).not.toThrow();
    });
  });
});
