ht.Views.LobbyView = Backbone.View.extend({

  className: 'lobby',

  template: ht.Templates.LobbyTemplate,

  initialize: function() {
    console.log(this.model);
    _.bindAll(this, 'changeInUser');
    ht.dispatcher.on('changeInUser', this.changeInUser);
    ht.dispatcher.trigger('createSockets');
    this.leaveRooms();
    this.render();
  },

  events: {
    'click #new-game-button': 'modalShow',
    'click #cancel, #mask': 'modalHide',
    'click #start-new-game': 'createGame'
  },

  render: function() {
    this.$el.empty();
    this.$el.append(this.template(this.model.attributes));
    if (this.model.get('invites').length) {
      this.invites = new ht.Views.LobbyInvitesView({model: this.model});
      this.$el.append(this.invites.el);
    }
    if (this.model.get('pendingGames').length) {
      this.pendingGames = new ht.Views.LobbyPendingGamesView({model: this.model});
      this.$el.append(this.pendingGames.el);
    }
    if (this.model.get('games').length) {
      this.games = new ht.Views.LobbyGamesListView({model: this.model});
      this.$el.append(this.games.el);
    }
  },

  leaveRooms: function(){
    console.log('i gets called');
    ht.dispatcher.trigger('leaveRooms');
  },

  modalShow: function(event) {
    $('#new-game-modal').fadeIn(300);
    this.$el.append('<div id="mask" class="mask"></div>');
    $('#mask').fadeIn(300);
  },

  modalHide: function() {
    $('#mask, #new-game-modal, #invite-game-modal').fadeOut(300, function() {
      $('#mask').remove();
    });
  },

  changeInUser: function (){
    console.log('made it to the lobby');
    var self = this;
    this.model.fetch({
      success: function(user) {
        self.render();
      },
      error: function(user, res) {
        console.log('error: ', res);
      }
    });
  },

  createGame: function() {
    this.modalHide();
    ht.router.navigate('/lobby/'+this.model.id+'/new', {trigger: true});
  }

});