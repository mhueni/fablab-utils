(function() {
	var server = false, MyModels;
	if (typeof exports !== 'undefined') {
		MyModels = exports;
		server = true;
	} else {
		MyModels = this.MyModels = {};
	}

	MyModels.AppModel = Backbone.Model.extend({
		defaults : {},
		initialize : function() {
			_.extend(this, this.attributes);
			this.shifts = new MyModels.ShiftCollection([ {
				weekday : 3,
				hour : '13-17',
				week : 0,
				users : [ 'wolfgang', 'machiel', 'anne-helia' ]
			}, {
				weekday : 3,
				hour: '13-17',
				week : 1,
				users : [ 'wolfgang', 'machiel', 'anne-helia' ]
			}, {
				weekday : 3,
				hour : '17-21',
				week : 0,
				users : [ 'machiel', 'ronnie' ]
			}, {
				weekday : 3,
				hour : '17-21',
				week : 1,
				users : [ 'machiel', 'ronnie' ]
			}, {
				weekday : 4,
				hour: '13-17',
				week : 0,
				users : [ 'dirk', 'matthias' ]
			}, {
				weekday : 4,
				hour: '13-17',
				week : 1,
				users : [ 'dirk', 'matthias' ]
			}, {
				weekday : 4,
				hour : '17-21',
				week : 0,
				users : [ 'christoph', 'oliver' ]
			}, {
				weekday : 4,
				hour : '17-21',
				week : 1,
				users : [ 'christoph' ]
			}, {
				weekday : 5,
				hour: '13-17',
				week : 0,
				users : [ 'dani' ]
			}, {
				weekday : 5,
				hour: '13-17',
				week : 1,
				users : [ 'martina', 'roman' ]
			}, {
				weekday : 5,
				hour : '17-21',
				week : 0,
				users : [ 'dani' ]
			}, {
				weekday : 5,
				hour : '17-21',
				week : 1,
				users : [ 'pascal', 'roman' ]
			}, {
				weekday : 6,
				hour: '13-17',
				week : 0,
				users : [ 'andi' ]
			}, {
				weekday : 6,
				hour: '13-17',
				week : 1,
				users : [ 'andi', 'roman' ]
			}, {
				weekday : 6,
				hour : '17-21',
				week : 0,
				users : [ 'andi' ]
			}, {
				weekday : 6,
				hour : '17-21',
				week : 1,
				users : [ 'andi', 'roman' ]
			} ]);
			this.exceptions = new MyModels.ExceptionCollection([ {
				date : '2013-04-25',
				hour: '17-21',
				user : 'christoph',
				available : false
			}, {
				date : '2013-04-25',
				hour: '17-21',
				user : 'matthias',
				available : true
			}, {
				date : '2013-05-02',
				hour: '13-17',
				user : 'matthias',
				available : false
			}, {
				date : '2013-04-02',
				hour: '13-17',
				user : 'christoph',
				available : true
			}, {
				date : '2013-05-09',
				hour: '13-17',
				user : 'matthias',
				available : false
			} ]);
		}
	});

	MyModels.BaseModel = Backbone.Model.extend({});
	MyModels.BaseCollection = Backbone.Collection.extend({});
	
	MyModels.User = MyModels.BaseModel.extend({});

	MyModels.Shift = MyModels.BaseModel.extend({});
	MyModels.ShiftCollection = MyModels.BaseCollection.extend({
		model : MyModels.Shift
	});

	MyModels.Exception = MyModels.BaseModel.extend({});
	MyModels.ExceptionCollection = MyModels.BaseCollection.extend({
		model : MyModels.Exception
	});
})();
