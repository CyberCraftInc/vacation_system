describe('VacationRequests collection', function() {
  beforeEach(function() {
    this.collection = new App.Collections.VacationRequests();
  });

  it('is able to create its instance object', function() {
    expect(this.collection).toBeDefined();
  });

  it('is able to add model instances as objects', function() {
    var vacation = {};
    expect(this.collection.length).toBe(0);

    vacation = {
      'kind': App.Vacation.types.regular,
      'status': App.Vacation.statuses.requested,
      'start_date': '2015-01-01',
      'end_date': '2015-01-05',
    };
    this.collection.add(vacation);
    expect(this.collection.length).toBe(1);

    vacation = new App.Models.VacationRequest();
    this.collection.add(vacation);
    expect(this.collection.length).toBe(2);
  });

  it('is able to add model instances as arrays', function() {
    expect(this.collection.length).toBe(0);

    this.collection.add([
      {
        'kind': App.Vacation.types.regular,
        'status': App.Vacation.statuses.used,
        'start_date': '2015-01-01',
        'end_date': '2015-01-05'
      }, {
        'kind': App.Vacation.types.regular,
        'status': App.Vacation.statuses.requested,
        'start_date': '2015-03-01',
        'end_date': '2015-03-05'
      }
    ]);
    expect(this.collection.length).toBe(2);

    this.collection.add([
      new App.Models.VacationRequest({
            'kind': App.Vacation.types.regular,
            'status': App.Vacation.statuses.used,
            'start_date': '2015-01-01',
            'end_date': '2015-01-05'
          }),
      new App.Models.Team({
            'kind': App.Vacation.types.regular,
            'status': App.Vacation.statuses.requested,
            'start_date': '2015-03-01',
            'end_date': '2015-03-05'
          }),
    ]);
    expect(this.collection.length).toBe(4);
  });

  describe('as a brand new object', function() {
    it('has its .length attribute to be zero', function() {
      expect(this.collection.length).toBe(0);
    });

    it('has its .url attribute set to "/vacation_requests"', function() {
      expect(this.collection.url).toEqual('/vacation_requests');
    });

    it('has its .model attribute defined', function() {
      expect(this.collection.model).toBeDefined();
    });
  });

  it('has .getVacationsDuration() method', function() {
    expect(this.collection.getVacationsDuration).toBeDefined();
    expect(this.collection.getVacationsDuration).toEqual(jasmine.any(Function));
  });

  it('has .toDates() method', function() {
    expect(this.collection.toDates).toBeDefined();
    expect(this.collection.toDates).toEqual(jasmine.any(Function));
  });

  describe('with .getVacationsDuration()', function() {
    beforeEach(function() {
      this.collection.add([
        {   // 2 days
          'kind': App.Vacation.types.regular,
          'status': App.Vacation.statuses.used,
          'start_date': '2015-01-01',
          'end_date': '2015-01-02'
        },{ // 2 days
          'kind': App.Vacation.types.regular,
          'status': App.Vacation.statuses.used,
          'start_date': '2015-03-05',
          'end_date': '2015-03-07'
        }
      ]);
      this.holidays = new App.Collections.Holidays();
      this.filters = {'year':2015, 'type':App.Vacation.types.regular, 'status':App.Vacation.statuses.used};
      this.expectation = 0;
      this.methodUnderTest = this.collection.getVacationsDuration;
    });

    describe('with no holidays', function() {
      beforeEach(function() {
        this.expectation = 4;
      });

      it('returns proper duration', function() {
        expect(this.collection.getVacationsDuration(this.holidays, this.filters)).toEqual(this.expectation);
      });
    });

    describe('with holidays that do not intersect with vacations', function() {
      beforeEach(function() {
        this.holidays = new App.Collections.Holidays([
          {'id':4,'description':'Independence Day','start':'2015-08-24','duration':2},
          {'id':7,'description':'Constitution Day','start':'2015-06-28','duration':2},
        ]);
        this.expectation = 4;
      });

      it('returns proper duration', function() {
        expect(this.collection.getVacationsDuration(this.holidays, this.filters)).toEqual(this.expectation);
      });
    });

    describe('with holidays that intersect with vacations', function() {
      beforeEach(function() {
        this.holidays = new App.Collections.Holidays([
          {'id':4,'description':'Independence Day','start':'2015-01-01','duration':2},
          {'id':7,'description':'Constitution Day','start':'2015-06-28','duration':2},
        ]);

        this.expectation = 2;
      });

      it('returns proper set of dates', function() {
        expect(this.collection.getVacationsDuration(this.holidays, this.filters)).toEqual(this.expectation);
      });
    });
  });

  describe('with .toDates()', function() {
    beforeEach(function() {
      this.collection.add([
        {
          'kind': App.Vacation.types.regular,
          'status': App.Vacation.statuses.used,
          'start_date': '2015-01-01',
          'end_date': '2015-01-02'
        },{
          'kind': App.Vacation.types.regular,
          'status': App.Vacation.statuses.used,
          'start_date': '2015-03-05',
          'end_date': '2015-03-07'
        }
      ]);
      this.result = ['2015-01-01', '2015-01-02', '2015-03-05', '2015-03-06', '2015-03-07'];
    });

    it('returns proper set of dates', function() {
      expect(this.collection.toDates()).toEqual(this.result);
    });
  });

});
