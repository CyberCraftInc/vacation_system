describe('Team view', function() {
  beforeEach(function() {
    // Stub User roles
    App.currentUserRoles = new App.Collections.CurrentUserRoles([
      {'id':1, 'team_id':1, 'role':'admin'}
    ]);
  });

  describe('as a real object', function() {
    beforeEach(function() {
      this.model = new App.Models.Team({
        'id':   1,
        'name': 'Angrybirds'
      });
      this.view = new App.Views.Team({'model': this.model});

      setFixtures('<ul class="teams-list"></ul>');
      this.container = $('.teams-list');
      this.container.append(this.view.render().el);
    });

    afterEach(function() {
      this.view.remove();
    });


    it('has its .model attribute defined', function() {
      expect(this.view.model).toBeDefined();
    });

    it('has its .className properly set', function() {
      expect(this.view.el.className).toBe('list-group-item');
    });

    it('has its .tagName properly set', function() {
      expect(this.view.el.tagName.toLowerCase()).toBe('li');
    });

    it('returns the view object', function() {
      expect(this.view.render()).toEqual(this.view);
    });

    it('produces the correct HTML', function() {
      this.container.append(this.view.render().el);

      expect(this.container.find('li .view')).toHaveText(this.model.get('name'));
      expect(this.container.find('li .view')).toHaveText(this.model.get('name'));
      expect(this.container.find('li .view')).toHaveCss({'display':'block'});
      expect(this.container.find('li .edit')).toHaveValue(this.model.get('name'));
      expect(this.container.find('li .edit')).toHaveCss({'display':'none'});
    });

    describe('responds to jQuery event', function() {
      it('dblclick .view', function() {
        this.editArea = this.container.find('li .edit');
        this.viewArea = this.container.find('li .view');
        spyOn(this.view, 'edit').and.callThrough();
        this.view.delegateEvents();

        expect(this.editArea).toHaveCss({'display':'none'});

        this.viewArea.trigger('dblclick');
        expect(this.view.edit).toHaveBeenCalled();
        expect(this.editArea).toHaveCss({'display':'block'});
      });

      it('click .remove', function() {
        this.deleteButton = this.container.find('li .remove');
        spyOn(this.view, 'onRemove');
        this.view.delegateEvents();

        this.deleteButton.trigger('click');
        expect(this.view.onRemove).toHaveBeenCalled();
      });

      it('keypress .edit', function() {
        this.editArea = this.container.find('li .edit');
        spyOn(this.view, 'updateOnEnter').and.callThrough();
        this.view.delegateEvents();

        this.editArea.trigger('keypress');
        expect(this.view.updateOnEnter).toHaveBeenCalled();
      });
    });

    describe('responds to user input confirmation, and', function() {
      beforeEach(function() {
        // Encapsulate model inside of collection to set up url property,
        // as it is in real life
        var collection = new App.Collections.Teams(this.view.model);
        this.inputField = this.container.find('li .edit');
      });

      describe('if value of the edit form is not changed,', function() {
        it('the value of model is not changed as well', function() {
          expect(this.view.model.get('name')).toBe(this.inputField.val());

          this.view.close();
          expect(this.view.model.get('name')).toBe(this.inputField.val());
        });
        it('no request to server is sent', function() {
          spyOn(this.view.model, 'save');
          this.view.close();
          expect(this.view.model.save).not.toHaveBeenCalled();
        });
      });

      describe('if value of the edit form is changed to invalid one,', function() {
        describe('name="Ants",', function() {
          beforeEach(function() {
            this.inputField.val('Ants');
          });

          it('the value of model is not changed and value of the edit form is set to value of the model', function() {
            var oldValue = this.view.model.get('name');
            this.view.close();

            expect(this.view.model.get('name')).not.toBe('Ants');
            expect(this.view.model.get('name')).toBe(oldValue);
            expect(this.inputField.val()).toBe(oldValue);
          });
        });

        describe('name="",', function() {
          beforeEach(function() {
            this.inputField.val('');
          });

          it('the value of model is not changed and value of the edit form is set to value of the model', function() {
            var oldValue = this.view.model.get('name');
            this.view.close();

            expect(this.view.model.get('name')).not.toBe('');
            expect(this.view.model.get('name')).toBe(oldValue);
            expect(this.inputField.val()).toBe(oldValue);
          });
        });
      });

      describe('if value of the edit form is changed to valid one,', function() {
        describe('name="SuperAnts",', function() {
          beforeEach(function() {
            this.inputField.val('SuperAnts');
          });

          it('the value of model is set to value of the edit form', function() {
            this.view.close();

            expect(this.view.model.get('name')).toBe('SuperAnts');
            expect(this.view.model.get('name')).toBe(this.inputField.val());
          });
        });
      });
    });
  });
});
