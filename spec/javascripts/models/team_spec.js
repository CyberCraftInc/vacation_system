describe('Team model', function() {
  beforeEach(function() {
    this.model = new App.Models.Team();
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
    it('has its .name attribute set to empty string', function() {
      expect(this.model.get('name')).toEqual('');
    });

    it('validates .name attribute with proper error message', function() {
      var errors  = this.model.validate();
      expect(errors.name).toEqual('Name is required');
    });

    it('is invalid', function() {
      var isValid = this.model.isValid(true);
      expect(isValid).toBeFalsy();
    });
  });

  describe('with invalid attributes,', function() {
    describe('name="Oz"', function() {
      beforeEach(function() {
        this.value = 'Oz';
        this.attribute = 'name';
        this.model.set(this.attribute, this.value);
      });

      it('sets attribute properly', function() {
        expect(this.model.get(this.attribute)).toEqual(this.value);
      });

      it('validates with proper error message', function() {
        var errors = this.model.validate();
        expect(errors[this.attribute]).toEqual('Name must be between 3 and 80 characters');
      });

      it('is invalid', function() {
        var isValid = this.model.isValid(true);
        expect(isValid).toBeFalsy();
      });
    });

    describe('name is set to a very long string', function() {
      beforeEach(function() {
        this.value  = 'SuperMegaIncrediblyTurboQuickAnts!!!';
        this.value += 'SuperMegaIncrediblyTurboQuickAnts!!!';
        this.value += 'SuperMegaIncrediblyTurboQuickAnts!!!';
        this.attribute = 'name';
        this.model.set(this.attribute, this.value);
      });

      it('sets attribute properly', function() {
        expect(this.model.get(this.attribute)).toEqual(this.value);
      });

      it('validates with proper error message', function() {
        var errors  = this.model.validate();
        expect(errors[this.attribute]).toEqual('Name must be between 3 and 80 characters');
      });

      it('is invalid', function() {
        var isValid = this.model.isValid(true);
        expect(isValid).toBeFalsy();
      });
    });
  });

  describe('with valid attributes,', function() {
    describe('name="Ant"', function() {
      beforeEach(function() {
        this.value = 'Ant';
        this.attribute = 'name';
        this.model.set(this.attribute, this.value);
      });

      it('sets attribute properly', function() {
        expect(this.model.get(this.attribute)).toEqual(this.value);
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
  });
});
