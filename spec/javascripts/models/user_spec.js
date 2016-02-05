describe('User model', function() {
  beforeEach(function() {
    this.model = new App.Models.User();
  });

  it('is able to create its instance object', function() {
    expect(this.model).toBeDefined();
  });

  describe('with Backbone.Validation mixin', function() {
    it('has .validate() method', function() {
      expect(this.model.isValid).toBeDefined();
    });

    it('has .isValid() method', function() {
      expect(this.model.isValid).toBeDefined();
    });

    it('has .preValidate() method', function() {
      expect(this.model.preValidate).toBeDefined();
    });
  });

  describe('as a brand new object', function() {
    it('has its .first_name=""', function() {
      expect(this.model.get('first_name')).toEqual('');
    });

    it('has its .last_name=""', function() {
      expect(this.model.get('last_name')).toEqual('');
    });

    it('has its .email=""', function() {
      expect(this.model.get('email')).toEqual('');
    });

    it('has its .position=""', function() {
      expect(this.model.get('position')).toEqual('');
    });

    it('has its .username=""', function() {
      expect(this.model.get('username')).toEqual('');
    });

    it('has its .birth_date="1990-01-01"', function() {
      var date = '1990-01-01';
      expect(this.model.get('birth_date')).toEqual(date);
    });

    it('has its .employment_date set to current date', function() {
      var date = moment(new Date()).format('YYYY-MM-DD');
      expect(this.model.get('employment_date')).toEqual(date);
    });

    it('has proper error messages after validation', function() {
      var errors  = this.model.validate();
      expect(_.keys(errors).length).toEqual(3);
      expect(_.keys(errors)).toEqual(['first_name', 'last_name', 'email']);
      expect(errors.first_name).toEqual('First name is required');
      expect(errors.last_name).toEqual('Last name is required');
      expect(errors.email).toEqual('Email is required');
    });

    it('is invalid', function() {
      var isValid = this.model.isValid(true);
      expect(isValid).toBeFalsy();
    });
  });

  describe('.set', function() {
    it('does not allow to set not expected attributes', function() {
      var that = this,
          predefined_object = {
            'first_name':'',
            'last_name':'',
            'email':'',
            'position':'',
            'username':'',
            'birth_date':'1990-01-01',
            'employment_date': moment(new Date()).format('YYYY-MM-DD'),
            'this_key_is_not_expected': 'indeed'
          };
      expect(function(){that.model.set(predefined_object);}).toThrow();
    });

    it('sets attributes from object', function() {
      var that = this,
          predefined_object = {
            'first_name':'',
            'last_name':'',
            'email':'',
            'position':'',
            'username':'',
            'birth_date':'1990-01-01',
            'employment_date': moment(new Date()).format('YYYY-MM-DD')
          };
      expect(function(){that.model.set(predefined_object);}).not.toThrow();
    });
  });

  describe('with invalid attributes,', function() {
    beforeEach(function() {
      this.testData = {
        'first_name':'ThisFirstNameIsDefinitelyTooLongUserFirstNameAllowedToUseForSure',
        'last_name':'ThisLastNameIsDefinitelyTooLongUserLastNameAllowedToUseForSureWithoutAnyDoubtsPeriod',
        'email':'jack.sparrow@ua'
      };
    });

    describe('first_name set to too long value,', function() {
      beforeEach(function() {
        this.model.set('first_name', this.testData.first_name);
      });

      it('has properly set attribute', function() {
        expect(this.model.get('first_name')).toEqual(this.testData.first_name);
      });

      it('validates with proper error message', function() {
        var errors  = this.model.validate();

        expect(errors.first_name).toEqual('First name must be between 1 and 50 characters');
      });

      it('is invalid', function() {
        var isValid = this.model.isValid(true);
        expect(isValid).toBeFalsy();
      });
    });

    describe('last_name set to too long value,', function() {
      beforeEach(function() {
        this.model.set('last_name', this.testData.last_name);
      });

      it('has properly set attribute', function() {
        expect(this.model.get('last_name')).toEqual(this.testData.last_name);
      });

      it('validates with proper error message', function() {
        var errors  = this.model.validate();

        expect(errors.last_name).toEqual('Last name must be between 1 and 70 characters');
      });

      it('is invalid', function() {
        var isValid = this.model.isValid(true);
        expect(isValid).toBeFalsy();
      });
    });

    describe('email = "jack.sparrow@ua",', function() {
      beforeEach(function() {
        this.model.set('email', this.testData.email);
      });

      it('has properly set attribute', function() {
        expect(this.model.get('email')).toEqual(this.testData.email);
      });

      it('validates with proper error message', function() {
        var errors  = this.model.validate();

        expect(errors.email).toEqual('Email must be a valid email');
      });

      it('is invalid', function() {
        var isValid = this.model.isValid(true);
        expect(isValid).toBeFalsy();
      });
    });
  });

  describe('with valid attributes,', function() {
    beforeEach(function() {
      this.testData = {
        'first_name':'Jack',
        'last_name':'Sparrow',
        'email':'jack.sparrow@i.ua'
      };
      this.model.set(this.testData);
    });

    it('has properly set attributes', function() {
      expect(this.model.get('first_name')).toEqual(this.testData.first_name);
      expect(this.model.get('last_name')).toEqual(this.testData.last_name);
      expect(this.model.get('email')).toEqual(this.testData.email);
    });

    it('validates without any error messages', function() {
      var errors  = this.model.validate();

      expect(errors).toBeUndefined();
    });

    it('is valid', function() {
      var isValid = this.model.isValid(true);
      expect(isValid).toBeTruthy();
    });
  });

  it('has .composeFullName() method', function() {
    expect(this.model.composeFullName).toBeDefined();
    expect(this.model.composeFullName).toEqual(jasmine.any(Function));
  });

  it('has .calculateAccumulatedVacations() method', function() {
    expect(this.model.calculateAccumulatedVacations).toBeDefined();
    expect(this.model.calculateAccumulatedVacations).toEqual(jasmine.any(Function));
  });

  it('has .calculateAccumulatedRegularVacations() method', function() {
    expect(this.model.calculateAccumulatedRegularVacations).toBeDefined();
    expect(this.model.calculateAccumulatedRegularVacations).toEqual(jasmine.any(Function));
  });

  it('has .calculateEmploymentDuration() method', function() {
    expect(this.model.calculateEmploymentDuration).toBeDefined();
    expect(this.model.calculateEmploymentDuration).toEqual(jasmine.any(Function));
  });

  it('has .calculateTotalEmploymentDuration() method', function() {
    expect(this.model.calculateEmploymentDuration).toBeDefined();
    expect(this.model.calculateEmploymentDuration).toEqual(jasmine.any(Function));
  });

  describe('with .composeFullName()', function() {
    beforeEach(function() {
      this.testData = {
        'first_name':' Jack ',
        'last_name':' Sparrow ',
      };
      this.model.set(this.testData);
    });

    it('provides a string with first_name and last_name separated with a space', function() {
      expect(this.model.composeFullName()).toEqual('Jack Sparrow');
    });
  });

  describe('with .calculateAccumulatedVacations()', function() {
    it('pending');
  });

  describe('with .calculateAccumulatedRegularVacations()', function() {
    it('pending');
  });

  describe('with .calculateEmploymentDuration()', function() {
    describe('with employment_date set to yesterday', function() {
      beforeEach(function() {
        this.date = moment();
        this.year = this.date.year();
        this.result = 2;
        this.model.set('employment_date', moment(this.date).subtract(1,'day').format(App.Helpers.getDateFormat()));
      });

      it('returns proper number of days', function() {
        expect(this.model.calculateEmploymentDuration(this.year)).toEqual(this.result);
      });
    });

    describe('with employment_date="2010-12-01",', function() {
      beforeEach(function() {
        this.employmentDate = moment([2012,11,1]);
        this.model.set('employment_date', this.employmentDate.format(App.Helpers.getDateFormat()));
      });

      describe('with year=2010', function() {
        beforeEach(function() {
          this.year = this.employmentDate.year();
          this.result = 31;
        });

        it('returns proper number of days', function() {
          expect(this.model.calculateEmploymentDuration(this.year)).toEqual(this.result);
        });
      });

      describe('with year=2011', function() {
        beforeEach(function() {
          this.year = this.employmentDate.year()+1;
          this.result = 365;
        });

        it('returns proper number of days', function() {
          expect(this.model.calculateEmploymentDuration(this.year)).toEqual(this.result);
        });
      });

      describe('with year set to current', function() {
        beforeEach(function() {
          var today = moment();
          this.year = today.year();
          this.result = moment([this.year]);
          this.result = today.diff(moment([this.year,0,1]), 'days')+1;
        });

        it('returns proper number of days', function() {
          expect(this.model.calculateEmploymentDuration(this.year)).toEqual(this.result);
        });
      });

    });

  });

  describe('with .calculateTotalEmploymentDuration()', function() {
    it('pending');
  });
});
