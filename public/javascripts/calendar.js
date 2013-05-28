$(function() {

	var username = $('#cal').attr('user');
	if (username) {
		var model = new MyModels.AppModel({
			user : new MyModels.User({
				name : username
			})
		});

		var socket = io.connect('/');
		socket.on('model', function(data) {
			model.shifts.reset(data.shifts);
			model.exceptions.reset(data.exceptions);
			if (model.user) {
				new CalendarView({
					model : model
				});
			}
		});
		socket.on('+exception', function(data) {
			model.exceptions.add(data);
		});
		socket.on('-exception', function(data) {
			model.exceptions.remove(model.exceptions.findWhere(data));
		});
	}

	var CalendarView = Backbone.View.extend({
		el : '#cal',
		initialize : function() {
			_.extend(this, this.options);
			this.start = moment().hour(0).minute(0).second(0).add({
				days : -moment().format('d')
			}); // first day of week
			this.weeks = [];
			for (i = 0; i < 7; i++) {
				this.addWeek();
			}
		},
		addWeek : function() {
			this.end = this.end || this.start.clone();
			this.weeks.push(new WeekView({
				model : this.model,
				start : this.end.clone()
			}));
			this.$el.append(_.last(this.weeks).$el);
			this.end.add({
				weeks : 1
			});
		}
	});
	var WeekView = Backbone.View.extend({
		tagName : 'div',
		className : 'week',
		wknbrTmpl : _.template('<div class="wknbr">KW <%= wknbr %></div>'),
		initialize : function() {
			_.extend(this, this.options);
			this.$el.append(this.wknbrTmpl({
				wknbr : this.start.format('w')
			}));
			this.days = [];
			var d = 0;
			while (d++ < 7) {
				this.days.push(new DayView({
					model : this.model,
					start : this.start.clone().add({
						days : d
					})
				}));
				this.$el.append(_.last(this.days).$el);
			}
		}
	});
	var DayView = Backbone.View
			.extend({
				tagName : 'div',
				className : 'day',
				tpl : _
						.template('<div class="title"><span class="name"><%= name %> <%= number %></span></div>'),
				initialize : function() {
					_.extend(this, this.options);
					this.weekday = +this.start.format('d');
					this.evenOddWeek = +this.start.format('w') % 2;
					this.$el.attr('id', this.start.format('YYYY-MM-DD')).html(
							this.tpl({
								name : this.start.format('ddd'),
								number : this.start.format('D')
							}));
					this.shifts = this.model.shifts.where({
						weekday : this.weekday,
						week : this.evenOddWeek
					});
					var self = this;
					_.each(this.shifts, function(shift) {
						self.$el.append(new ShiftView({
							model : self.model,
							shift : shift,
							date : self.start
						}).$el);
					});
				}
			});
	var ShiftView = Backbone.View
			.extend({
				tagName : 'div',
				className : 'shift',
				events : {
					'click' : 'addRemoveMe'
				},
				userTpl : _
						.template('<span class="manager <%= className%>"><%= plusMinus %> <%= name %></span>'),
				initialize : function() {
					var self = this;
					_.extend(self, self.options);
					self.model.exceptions.on('add', this.exceptionsChanged,
							this);
					self.model.exceptions.on('remove', this.exceptionsChanged,
							this);
					self.render();
				},
				render : function() {
					var self = this;
					var $el = this.$el;
					$el.html('<span class="title">' + this.shift.get('hour')
							+ '</span>');
					var users = {};
					_.each(this.shift.get('users'), function(user) {
						users[user] = {
							className : 'available',
							plusMinus : '+',
							name : user
						};
					});
					_.each(this.exceptions(),
							function(exception) {
								var user = exception.get('user');
								users[user] = users[user] || {
									name : user
								};
								users[user].className = exception
										.get('available') ? 'available'
										: 'not-available';
								users[user].plusMinus = exception
										.get('available') ? '+' : '-';
							});
					var availableUsers = _.where(users, {
						className : 'available'
					}).length;
					_.each(users, function(data, user) {
						if (user == self.model.user.get('name')) {
							data.className += ' me';
						}
						$el.append(self.userTpl(data));
					});
					$el
							.attr(
									'class',
									'shift '
											+ (availableUsers > 0 ? (availableUsers > 1 ? 'green'
													: 'orange')
													: 'red'));
				},
				exceptions : function() {
					return this.model.exceptions.where({
						date : this.date.format('YYYY-MM-DD'),
						hour : this.shift.get('hour')
					});
				},
				exceptionsChanged : function(e) {
					if (e.attributes.date == this.date.format('YYYY-MM-DD')
							&& e.attributes.hour == this.shift.get('hour')) {
						this.render();
					}
				},
				addRemoveMe : function() {
					var exception = this.model.exceptions.where({
						date : this.date.format('YYYY-MM-DD'),
						hour : this.shift.get('hour'),
						user : this.model.user.get('name')
					});
					if (exception.length) {
						socket.emit('-exception', _.first(exception));
					} else {
						socket.emit('+exception', {
							date : this.date.format('YYYY-MM-DD'),
							hour : this.shift.get('hour'),
							user : this.model.user.get('name'),
							available : !_.contains(this.shift.get('users'),
									this.model.user.get('name'))
						});
					}
				}
			});

	// model.exceptions.on('all', function(e, m) {
	// switch (e) {
	// case 'add':
	// case 'remove':
	// socket.emit('exception', {
	// action : e,
	// model : m.toJSON()
	// });
	// }
	// });
});
