$(function() {
	var CalendarView = Backbone.View.extend({
		el : '#cal',
		initialize : function() {
			_.extend(this, this.options);
			this.start = moment().hour(0).minute(0).second(0).add({
				days : moment().format('d') - 4
			}); // first day of week
			this.weeks = [];
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
		initialize : function() {
			_.extend(this, this.options);
			this.$el.append('<div class="wknbr">KW ' + this.start.format('w')
					+ '</div>');
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
						.template('<div class="title"><span class="name"><%= name %></span><span class="dnbr"><%= number %></span></div>'),
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
					'click' : 'addRemoveUser'
				},
				initialize : function() {
					_.extend(this, this.options);
					this.render();
				},
				render : function() {
					this.$el.html('<span class="title">' + this.shift.get('hour') + '</span>');
					var users = {};
					_.each(this.shift.get('users'), function(user) {
						users[user] = true;
					});
					this.exceptions = this.model.exceptions.where({
						date : this.date.format('YYYY-MM-DD'),
						hour : this.shift.get('hour')
					});
					if (this.exceptions) {
						_.each(this.exceptions, function(exception) {
							users[exception.get('user')] = exception
									.get('available');
						});
					}
					var userTpl = _
							.template('<span class="manager <%= className%>"><%= plusMinus %> <%= name %></span>');
					var $el = this.$el;
					var totalUsers = 0;
					_.each(users, function(available, user) {
						if (available)
							totalUsers++;
						$el.append(userTpl({
							name : user,
							plusMinus : available ? '+' : '-',
							className : available ? 'available'
									: 'not-available'
						}));
					});
					this.$el.attr('class', 'shift '
							+ (totalUsers > 0 ? (totalUsers > 1 ? 'green'
									: 'orange') : 'red'));
				},
				addRemoveUser : function() {
					var exception = this.model.exceptions.where({
						date : this.date.format('YYYY-MM-DD'),
						hour : this.shift.get('hour'),
						user : this.model.user.get('name')
					});
					if (exception.length) {
						_.first(exception).destroy();
					} else {
						this.model.exceptions.add({
							date : this.date.format('YYYY-MM-DD'),
							hour : this.shift.get('hour'),
							user : this.model.user.get('name'),
							available : !_.contains(this.shift.get('users'),
									this.model.user.get('name'))
						})
					}
					this.render();
				}
			});

	var username = 'matthias';
	var cal = new CalendarView({
		model : new MyModels.AppModel({
			user : new MyModels.User({
				name : username
			})
		})
	});
//	$('body').prepend(cal.$el);
	var i = 6;
	while (i-- > 0) {
		cal.addWeek();
	}

	// $body = $('body');
	// $cal = $('<div id="calendar"/>');
	// $body.append();
	//
	// $cal.start = moment().add(1 - moment().format('d'));
	// var weeks = 6;
	// while (weeks-- > 0) {
	// $cal.pos = $cal.pos || $cal.start;
	// var weeknbr = $cal.pos.format('w');
	// var $week = $('<div class="week"/>');
	// $week.append('<div class="weeknbr">' + weeknbr + '</div>');
	// var shift, weekday, managers;
	// for ( var d = 0; d < 7; d++) {
	// weekday = $cal.pos.format('d');
	// $day = $('<div class="weekday" id="'
	// + $cal.pos.format('YYYY-MM-DD') + '">'
	// + $cal.pos.format('ddd D') + '</div>');
	// for (shift = 0; shift < 2; shift++) {
	// $shift = $('<div id="' + $cal.pos.format('YYYY-MM-DD') + ':'
	// + shift + '" class="shift shift-' + shift + '"></div>')
	// if (managerWeekdayShifts[weekday]
	// && managerWeekdayShifts[weekday][shift]) {
	// managers = managerWeekdayShifts[weekday][shift][weeknbr % 2];
	// if (managers) {
	// managers = managers.split(',');
	// $.each(managers, function(i, manager) {
	// $shift.append('<span class="manager">' + manager
	// + '</span>');
	// });
	// $shift.addClass(managers.length < 2 ? 'shift-alert'
	// : 'shift-ok');
	// }
	// }
	// $day.append($shift);
	// }
	// $week.append($day);
	// $cal.pos = $cal.pos.add({
	// days : 1
	// });
	// }
	// $cal.append($week);
	// }
});
