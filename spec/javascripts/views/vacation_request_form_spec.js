describe('VacationRequestForm view', function() {
  beforeEach(function() {
    // Stub User
    App.currentUser = new App.Models.CurrentUser();
    App.currentUser.set({'id':1, 'employment_date':'2015-04-02'});

    // Stub User roles
    App.currentUserRoles = new App.Collections.CurrentUserRoles([
      {'id':1, 'team_id':1, 'role':'guest'}
    ]);

    this.holidays = new App.Collections.Holidays([
      {"id":4,"description":"Independence Day","start":"2015-08-24","duration":2},
      {"id":7,"description":"Constitution Day","start":"2015-06-28","duration":2},
      {"id":10,"description":"New Year's Day","start":"2015-01-01","duration":2}
    ]);

    this.vacationRequests = new App.Collections.VacationRequests([
      {'id':1,'start_date':'2015-08-20','end_date':'2015-08-24','kind':'planned', 'status':App.Vacation.statuses.requested},
      {'id':2,'start_date':'2015-07-01','end_date':'2015-07-04','kind':'sickness','status':App.Vacation.statuses.requested},
      {'id':3,'start_date':'2015-01-05','end_date':'2015-01-14','kind':'unpaid',  'status':App.Vacation.statuses.requested}
    ]);

    setFixtures('<div class="new-vacation-request-form"></div>');
    this.container = $('.new-vacation-request-form');

    this.view = new App.Views.VacationRequestForm({
      'holidays': this.holidays,
      'vacationRequests': this.vacationRequests
    });
    this.container.append(this.view.render().el);
  });

  afterEach(function() {
    this.view.remove();
  });

  it('has its .holidays collection defined with proper object', function() {
    expect(this.view.holidays).toBeDefined();
    expect(this.view.holidays).toEqual(jasmine.any(App.Collections.Holidays));
  });

  it('has its .vacationRequests collection defined with proper object', function() {
    expect(this.view.vacationRequests).toBeDefined();
    expect(this.view.vacationRequests).toEqual(jasmine.any(App.Collections.VacationRequests));
  });

  it('has its .model defined with proper object', function() {
    expect(this.view.model).toBeDefined();
    expect(this.view.model).toEqual(jasmine.any(App.Models.VacationRequest));
  });

  it('has its .vacationType=null', function() {
    expect(this.view.vacationType).toBeNull();
  });

  it('returns the view object with its .render() method', function() {
    expect(this.view.render()).toEqual(this.view);
  });

  describe('produces correct HTML', function() {
    it('selected[name=vacation-type]', function() {
      expect(this.view.el).toContainElement('select[name=vacation-type]');
    });

    it('input:text[name=from]', function() {
      datePickerContainer = this.view.$('.input-daterange');
      expect(datePickerContainer).toContainElement('input:text[name=from]');
    });

    it('input:text[name=to]', function() {
      datePickerContainer = this.view.$('.input-daterange');
      expect(datePickerContainer).toContainElement('input:text[name=to]');
    });

    it('button[name=clear]', function() {
      expect(this.view.el).toContainElement('button[name=clear]');
    });
    it('button[name=request]', function() {
      expect(this.view.el).toContainElement('button[name=request]');
    });
  });

  describe('responds to jQuery event', function() {
    it('change select[name=vacation-type]', function() {
      var htmlElement = this.view.$('select[name=vacation-type]'),
          newValue = App.Vacation.types.sickness;

      expect(htmlElement.val()).toBeNull();
      expect(htmlElement.children()[0].selected).toBeTruthy();

      spyOn(this.view, 'onTypeChange').and.callThrough();
      this.view.delegateEvents();

      htmlElement.val(newValue);
      htmlElement.trigger('change');

      expect(this.view.onTypeChange).toHaveBeenCalled();
      expect(this.view.model.get('kind')).toEqual(newValue);
    });

    it('change input[name=from]', function() {
      var htmlElement = this.view.$('input[name=from]'),
          oldValue = this.view.model.get('start_date'),
          newValue = '2015-01-01';

      spyOn(this.view, 'onFromChange').and.callThrough();
      this.view.delegateEvents();

      expect(htmlElement.val()).toEqual(oldValue);

      htmlElement.val(newValue);
      htmlElement.trigger('change');
      expect(this.view.onFromChange).toHaveBeenCalled();
      expect(this.view.model.get('start_date')).toEqual(newValue);
    });

    it('change input[name=to]', function() {
      var htmlElement = this.view.$('input[name=to]'),
          oldValue = this.view.model.get('end_date'),
          newValue = '2015-01-01';

      spyOn(this.view, 'onToChange').and.callThrough();
      this.view.delegateEvents();

      htmlElement.val(newValue);
      htmlElement.trigger('change');
      expect(this.view.onToChange).toHaveBeenCalled();
      expect(this.view.model.get('end_date')).toEqual(newValue);
    });

    it('click button[name=clear]', function() {
      var htmlElement = this.view.$('button[name=clear]'),
          inputFrom = this.view.$('input[name=from]'),
          inputTo = this.view.$('input[name=to]');

      inputFrom.val('2015-01-01');
      inputTo.val('2015-01-05');
      expect(inputFrom).toHaveValue('2015-01-01');
      expect(inputTo).toHaveValue('2015-01-05');

      spyOn(this.view, 'onClear').and.callThrough();
      this.view.delegateEvents();

      htmlElement.trigger('click');
      expect(this.view.onClear).toHaveBeenCalled();
      expect(inputFrom).toHaveValue('');
      expect(inputTo).toHaveValue('');
    });

    it('click button[name=request]', function() {
      var vacationTypeSelect = this.view.$('select[name=vacation-type]'),
          htmlElement = this.view.$('button[name=request]');
      spyOn(this.view, 'onRequest');
      this.view.delegateEvents();

      vacationTypeSelect.val(App.Vacation.types.regular).change();
      htmlElement.trigger('click');

      expect(this.view.onRequest).toHaveBeenCalled();
    });
  });

});
