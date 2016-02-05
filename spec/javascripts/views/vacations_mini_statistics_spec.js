describe('VacationsMiniStatistics view', function() {
  beforeEach(function() {
    // Stop the World time flow
    var baseTime = new Date(2016, 2, 2);
    jasmine.clock().mockDate(baseTime);

    // Stub User
    App.currentUser = new App.Models.CurrentUser();
    App.currentUser.set({'id':1, 'employment_date':'2015-04-02'});

    this.holidays = new App.Collections.Holidays([
      {'id':4,'description':'Independence Day','start':'2015-08-24','duration':2},
      {'id':7,'description':'Constitution Day','start':'2015-06-28','duration':2},
      {'id':10,'description':'New Year','start':'2015-01-01','duration':2}
    ]);

    // planned=2, sickness=3, unpaid=8
    this.vacationRequests = new App.Collections.VacationRequests([
      {'id':1,'start_date':'2015-08-20','end_date':'2015-08-24','kind':App.Vacation.types.regular, 'status':App.Vacation.statuses.requested},
      {'id':2,'start_date':'2015-07-01','end_date':'2015-07-04','kind':App.Vacation.types.sickness,'status':App.Vacation.statuses.requested},
      {'id':3,'start_date':'2016-01-05','end_date':'2016-01-14','kind':App.Vacation.types.unpaid,  'status':App.Vacation.statuses.requested}
    ]);

    setFixtures('<div class="new-vacation-request-form"><div class="panel-footer"></div></div>');

    this.view = new App.Views.VacationsMiniStatistics({
      'vacationType': null,
      'holidays': this.holidays,
      'vacationRequests': this.vacationRequests
    }).render();

    $('.panel-footer').append(this.view.el);
  });

  afterEach(function() {
    this.view.remove();
  });

  it('has its .vacationType=null', function() {
    expect(this.view.vacationType).toBeDefined();
    expect(this.view.vacationType).toBeNull();
  });

  it('has its .holidays collection defined with proper object', function() {
    expect(this.view.holidays).toBeDefined();
    expect(this.view.holidays).toEqual(jasmine.any(App.Collections.Holidays));
  });

  it('has its .vacationRequests collection defined with proper object', function() {
    expect(this.view.vacationRequests).toBeDefined();
    expect(this.view.vacationRequests).toEqual(jasmine.any(App.Collections.VacationRequests));
  });

  it('has its .statistics defined with proper object', function() {
    expect(this.view.statistics).toBeDefined();
    expect(this.view.statistics).toEqual(jasmine.any(Array));
  });

  it('has its .isDetailsVisible defined with proper object', function() {
    expect(this.view.isDetailsVisible).toBeDefined();
    expect(this.view.isDetailsVisible).toEqual(jasmine.any(Boolean));
  });

  it('returns the view object with its .render() method', function() {
    expect(this.view.render()).toEqual(this.view);
    expect(this.view.render()).toEqual(jasmine.any(App.Views.VacationsMiniStatistics));
  });

  it('has .getStatistics() method', function() {
    expect(this.view.getStatistics).toBeDefined();
    expect(this.view.getStatistics).toEqual(jasmine.any(Function));
  });

  describe('with .getStatistics()', function() {
    describe('vacationType=regular', function() {
      beforeEach(function() {
        this.view.vacationType = App.Vacation.types.regular;
        this.expectation = [
          {"year":2016,"accumulated":3,"requested":0,"used":0,"remaining":3},
          {"year":2015,"accumulated":15,"requested":2,"used":0,"remaining":15},
          {"year":"Total","accumulated":18,"requested":2,"used":0,"remaining":18}
        ];
        this.result = this.view.getStatistics();
        this.years_of_employment = 2;
        this.user = new App.Models.User(App.currentUser.attributes);
      });

      it('returns proper array of vacation summaries per year', function() {
        expect(this.result).toEqual(jasmine.any(Array));
        expect(this.result.length).toEqual(this.years_of_employment+1);
        expect(this.result).toEqual(this.expectation.slice(-(this.years_of_employment+1)));
      });
    });

    describe('vacationType=sickness', function() {
      beforeEach(function() {
        this.view.vacationType = App.Vacation.types.sickness;
        this.expectation = [
          {"year":2016,"accumulated":20,"requested":0,"used":0,"remaining":20},
          {"year":2015,"accumulated":20,"requested":3,"used":0,"remaining":20},
          {"year":"Total","accumulated":40,"requested":3,"used":0,"remaining":40}
        ];
        this.result = this.view.getStatistics();
        this.years = App.currentUser.getYearsOfEmployment();

      });

      it('returns proper array of vacation summaries per year', function() {
        expect(this.result).toEqual(jasmine.any(Array));
        expect(this.result.length).toEqual(this.years.length+1);
        expect(this.result).toEqual(this.expectation.slice(-(this.years.length+1)));
      });
    });

    describe('vacationType=unpaid', function() {
      beforeEach(function() {
        this.view.vacationType = App.Vacation.types.unpaid;
        this.expectation = [
          {"year":2016,"accumulated":10,"requested":8,"used":0,"remaining":10},
          {"year":2015,"accumulated":10,"requested":0,"used":0,"remaining":10},
          {"year":"Total","accumulated":20,"requested":8,"used":0,"remaining":20}
        ];
        this.result = this.view.getStatistics();
        this.years = App.currentUser.getYearsOfEmployment();

      });

      it('returns proper array of vacation summaries per year', function() {
        expect(this.result).toEqual(jasmine.any(Array));
        expect(this.result.length).toEqual(this.years.length+1);
        expect(this.result).toEqual(this.expectation.slice(-(this.years.length+1)));
      });
    });
  });

  describe('produces correct HTML', function() {
    describe('for default state', function() {
      it('shows notification', function() {
        expect(this.view.el).toContainElement('.alert');
        expect(this.view.$el[0].children.length).toEqual(1);
      });
    });

    describe('for regular vacation', function() {
      beforeEach(function() {
        this.view.vacationType = App.Vacation.types.regular;
        this.view.render();
      });

      it('provides two placeholders', function() {
        expect(this.view.$el[0].children.length).toEqual(2);
        expect(this.view.el).toContainElement('.simple');
        expect(this.view.el).toContainElement('.extended');
      });

      it('label[name=available]', function() {
        expect(this.view.el).toContainElement('.simple label[name=available]');
      });

      it('label[name=requested]', function() {
        expect(this.view.el).toContainElement('.simple label[name=requested]');
      });

      it('label[name=used]', function() {
        expect(this.view.el).toContainElement('.simple label[name=used]');
      });

      it('button[name=details]', function() {
        expect(this.view.el).toContainElement('.simple button[name=details]');
      });

      it('table with detailed info per year', function() {
        var $table = this.view.$('.extended .bootstrap-table .fixed-table-container .fixed-table-body table');
        expect(this.view.el).toContainElement('.bootstrap-table');
        expect(this.view.el).toContainElement($table);

        var $tableHeadRow = this.view.$('thead tr', $table);
        expect($table).toContainElement($tableHeadRow);

        var tableHeadCols = $tableHeadRow.children();
        expect(tableHeadCols.length).toEqual(5);
        expect(tableHeadCols[0].innerText).toEqual('Year');
        expect(tableHeadCols[1].innerText).toEqual('Accumulated');
        expect(tableHeadCols[2].innerText).toEqual('Requested');
        expect(tableHeadCols[3].innerText).toEqual('Used');
        expect(tableHeadCols[4].innerText).toEqual('Remaining');

        var $tableBodyRows = $('tbody tr', $table);
        expect($tableBodyRows.length).toEqual(this.view.statistics.length);
        _.each(this.view.statistics, function(record, index) {
          var $tableBodyRowCols = $('td', $tableBodyRows[index]);
          expect($tableBodyRowCols.length).toEqual(5);
          expect($tableBodyRowCols[0].innerText).toEqual(record.year.toString());
          expect($tableBodyRowCols[1].innerText).toEqual(record.accumulated.toString());
          expect($tableBodyRowCols[2].innerText).toEqual(record.requested.toString());
          expect($tableBodyRowCols[3].innerText).toEqual(record.remaining.toString());
          expect($tableBodyRowCols[4].innerText).toEqual(record.used.toString());
        });
      });
    });

    describe('for sickness leave', function() {
      beforeEach(function() {
        this.view.vacationType = App.Vacation.types.sickness;
        this.view.render();
      });

      it('provides two placeholders', function() {
        expect(this.view.$el[0].children.length).toEqual(2);
        expect(this.view.el).toContainElement('.simple');
        expect(this.view.el).toContainElement('.extended');
      });

      it('label[name=available]', function() {
        expect(this.view.el).toContainElement('.simple label[name=available]');
      });

      it('label[name=requested]', function() {
        expect(this.view.el).toContainElement('.simple label[name=requested]');
      });

      it('label[name=used]', function() {
        expect(this.view.el).toContainElement('.simple label[name=used]');
      });

      it('button[name=details]', function() {
        expect(this.view.el).toContainElement('.simple button[name=details]');
      });

      it('table with detailed info per year', function() {
        var $table = this.view.$('.extended .bootstrap-table .fixed-table-container .fixed-table-body table');
        expect(this.view.el).toContainElement('.bootstrap-table');
        expect(this.view.el).toContainElement($table);

        var $tableHeadRow = this.view.$('thead tr', $table);
        expect($table).toContainElement($tableHeadRow);

        var tableHeadCols = $tableHeadRow.children();
        expect(tableHeadCols.length).toEqual(5);
        expect(tableHeadCols[0].innerText).toEqual('Year');
        expect(tableHeadCols[1].innerText).toEqual('Available');
        expect(tableHeadCols[2].innerText).toEqual('Requested');
        expect(tableHeadCols[3].innerText).toEqual('Used');
        expect(tableHeadCols[4].innerText).toEqual('Remaining');

        var $tableBodyRows = $('tbody tr', $table);
        expect($tableBodyRows.length).toEqual(this.view.statistics.length);
        _.each(this.view.statistics, function(record, index) {
          var $tableBodyRowCols = $('td', $tableBodyRows[index]);
          expect($tableBodyRowCols.length).toEqual(5);
          expect($tableBodyRowCols[0].innerText).toEqual(record.year.toString());
          expect($tableBodyRowCols[1].innerText).toEqual(record.accumulated.toString());
          expect($tableBodyRowCols[2].innerText).toEqual(record.requested.toString());
          expect($tableBodyRowCols[3].innerText).toEqual(record.remaining.toString());
          expect($tableBodyRowCols[4].innerText).toEqual(record.used.toString());
        });
      });
    });

    describe('for unpaid vacation', function() {
      beforeEach(function() {
        this.view.vacationType = App.Vacation.types.unpaid;
        this.view.render();
      });

      it('provides two placeholders', function() {
        expect(this.view.$el[0].children.length).toEqual(2);
        expect(this.view.el).toContainElement('.simple');
        expect(this.view.el).toContainElement('.extended');
      });

      it('label[name=available]', function() {
        expect(this.view.el).toContainElement('.simple label[name=available]');
      });

      it('label[name=requested]', function() {
        expect(this.view.el).toContainElement('.simple label[name=requested]');
      });

      it('label[name=used]', function() {
        expect(this.view.el).toContainElement('.simple label[name=used]');
      });

      it('button[name=details]', function() {
        expect(this.view.el).toContainElement('.simple button[name=details]');
      });

      it('table with detailed info per year', function() {
        var $table = this.view.$('.extended .bootstrap-table .fixed-table-container .fixed-table-body table');
        expect(this.view.el).toContainElement('.bootstrap-table');
        expect(this.view.el).toContainElement($table);

        var $tableHeadRow = this.view.$('thead tr', $table);
        expect($table).toContainElement($tableHeadRow);

        var tableHeadCols = $tableHeadRow.children();
        expect(tableHeadCols.length).toEqual(5);
        expect(tableHeadCols[0].innerText).toEqual('Year');
        expect(tableHeadCols[1].innerText).toEqual('Available');
        expect(tableHeadCols[2].innerText).toEqual('Requested');
        expect(tableHeadCols[3].innerText).toEqual('Used');
        expect(tableHeadCols[4].innerText).toEqual('Remaining');

        var $tableBodyRows = $('tbody tr', $table);
        expect($tableBodyRows.length).toEqual(this.view.statistics.length);
        _.each(this.view.statistics, function(record, index) {
          var $tableBodyRowCols = $('td', $tableBodyRows[index]);
          expect($tableBodyRowCols.length).toEqual(5);
          expect($tableBodyRowCols[0].innerText).toEqual(record.year.toString());
          expect($tableBodyRowCols[1].innerText).toEqual(record.accumulated.toString());
          expect($tableBodyRowCols[2].innerText).toEqual(record.requested.toString());
          expect($tableBodyRowCols[3].innerText).toEqual(record.remaining.toString());
          expect($tableBodyRowCols[4].innerText).toEqual(record.used.toString());
        });
      });
    });
  });

  describe('responds to jQuery event', function() {
    beforeEach(function() {
      this.view.vacationType = App.Vacation.types.unpaid;
      this.view.render();
    });

    it('click button[name=details]', function() {
      var $htmlElement = this.view.$('button[name=details]'),
          $tableContainer = this.view.$('.extended');

      expect($tableContainer).toHaveClass('hidden');

      spyOn(this.view, 'onClickDetails').and.callThrough();
      this.view.delegateEvents();

      $htmlElement.trigger('click');

      expect(this.view.onClickDetails).toHaveBeenCalled();
      expect($tableContainer).not.toHaveClass('hidden');
    });
  });

});
