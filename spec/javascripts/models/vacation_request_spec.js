describe('VacationRequest model', function() {
  beforeEach(function() {
    this.model = new App.Models.VacationRequest();
  });

  it('is able to create its instance', function() {
    expect(this.model).toBeDefined();
  });

  it('has .calculateDuration() method', function() {
    expect(this.model.calculateDuration).toBeDefined();
    expect(this.model.calculateDuration).toEqual(jasmine.any(Function));
  });

  describe('with .calculateDuration() method', function() {
    beforeEach(function() {
      this.model.set('start', '2015-08-25');
      this.model.set('end',   '2015-09-05');
      this.model.set('duration', 0);
      this.numberOfWeekends = 3;
      this.numberOfVacationDays = 12;
    });

    describe('with holiday inside of vacation request date range', function() {
      beforeEach(function() {
        this.holidays = new App.Collections.Holidays([{'start':'2015-08-29', 'duration':3}]);
        this.result = this.numberOfVacationDays - 1 - this.numberOfWeekends;
      });
      it('sets its .duration attribute properly', function() {
        this.model.calculateDuration(this.holidays);
        expect(this.model.get('duration')).toEqual(this.result);
      });
    });

    describe('with holiday outside of vacation request date range', function() {
      beforeEach(function() {
        this.holidays = new App.Collections.Holidays([{'start':'2015-10-01', 'duration':3}]);
        this.result = this.numberOfVacationDays - this.numberOfWeekends;
      });
      it('sets its .duration attribute properly', function() {
        this.model.calculateDuration(this.holidays);
        expect(this.model.get('duration')).toEqual(this.result);
      });
    });

    describe('with holiday intersecting with vacation request date range start', function() {
      beforeEach(function() {
        this.holidays = new App.Collections.Holidays([{'start':'2015-08-24', 'duration':3}]);
        this.result = this.numberOfVacationDays - 2 - this.numberOfWeekends;
      });
      it('sets its .duration attribute properly', function() {
        this.model.calculateDuration(this.holidays);
        expect(this.model.get('duration')).toEqual(this.result);
      });
    });

    describe('with holiday intersecting with vacation request date range end', function() {
      beforeEach(function() {
        this.holidays = new App.Collections.Holidays([{'start':'2015-09-04', 'duration':3}]);
        this.result = this.numberOfVacationDays - 1 - this.numberOfWeekends;
      });
      it('sets its .duration attribute properly', function() {
        this.model.calculateDuration(this.holidays);
        expect(this.model.get('duration')).toEqual(this.result);
      });
    });

    describe('with holidays intersecting with vacation request date range boundaries', function() {
      beforeEach(function() {
        this.holidays = new App.Collections.Holidays([{'start':'2015-08-24', 'duration':3},{'start':'2015-09-04', 'duration':3}]);
        this.result = this.numberOfVacationDays - 2 - 1 - this.numberOfWeekends;
      });
      it('sets its .duration attribute properly', function() {
        this.model.calculateDuration(this.holidays);
        expect(this.model.get('duration')).toEqual(this.result);
      });
    });

    describe('with holidays intersecting with vacation request date range boundaries, and a holiday inside of vacation request date range', function() {
      beforeEach(function() {
        this.holidays = new App.Collections.Holidays([{'start':'2015-08-24', 'duration':3},{'start':'2015-09-02', 'duration':1},{'start':'2015-09-04', 'duration':3}]);
        this.result = this.numberOfVacationDays - 1 - 1 - 2 - this.numberOfWeekends;
      });
      it('sets its .duration attribute properly', function() {
        this.model.calculateDuration(this.holidays);
        expect(this.model.get('duration')).toEqual(this.result);
      });
    });
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
  });
});
