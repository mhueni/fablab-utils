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
			_.extend(this, this.options);
			this.shifts = new MyModels.ShiftCollection([ {
				weekday : 3,
				hour : 13,
				week : 0,
				users : [ 'wolfgang', 'machiel', 'anne-helia' ]
			}, {
				weekday : 3,
				hour : 13,
				week : 1,
				users : [ 'wolfgang', 'machiel', 'anne-helia' ]
			}, {
				weekday : 3,
				hour : 17,
				week : 0,
				users : [ 'machiel', 'ronnie' ]
			}, {
				weekday : 3,
				hour : 17,
				week : 1,
				users : [ 'machiel', 'ronnie' ]
			}, {
				weekday : 4,
				hour : 13,
				week : 0,
				users : [ 'dirk', 'matthias' ]
			}, {
				weekday : 4,
				hour : 13,
				week : 1,
				users : [ 'dirk', 'matthias' ]
			}, {
				weekday : 4,
				hour : 17,
				week : 0,
				users : [ 'christoph' ]
			}, {
				weekday : 4,
				hour : 17,
				week : 1,
				users : [ 'christoph', 'oliver' ]
			}, {
				weekday : 5,
				hour : 13,
				week : 0,
				users : [ 'dani' ]
			}, {
				weekday : 5,
				hour : 13,
				week : 1,
				users : [ 'martina', 'roman' ]
			}, {
				weekday : 5,
				hour : 17,
				week : 0,
				users : [ 'dani' ]
			}, {
				weekday : 5,
				hour : 17,
				week : 1,
				users : [ 'pascal', 'roman' ]
			}, {
				weekday : 6,
				hour : 13,
				week : 0,
				users : [ 'andi' ]
			}, {
				weekday : 6,
				hour : 13,
				week : 1,
				users : [ 'andi', 'roman' ]
			}, {
				weekday : 6,
				hour : 17,
				week : 0,
				users : [ 'andi' ]
			}, {
				weekday : 6,
				hour : 17,
				week : 1,
				users : [ 'andi', 'roman' ]
			} ]);
			this.exceptions = new MyModels.ExceptionCollection([ {
				date : '2013-05-02',
				hour : 13,
				user : 'matthias',
				available : false
			}, {
				date : '2013-05-02',
				hour : 13,
				user : 'christoph',
				available : true
			}, {
				date : '2013-05-09',
				hour : 13,
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

// 3 : {
// 0 : {
// 0 : 'wolfgang,machiel,anne-helia',
// 1 : 'wolfgang,machiel,anne-helia'
// },
// 1 : {
// 0 : 'machiel,ronnie',
// 1 : 'machiel,ronnie'
// }
// },
// 4 : {
// 0 : {
// 0 : 'dirk,matthias',
// 1 : 'dirk,matthias'
// },
// 1 : {
// 0 : 'christoph,oliver',
// 1 : 'christoph'
// }
// },
// 5 : {
// 0 : {
// 0 : 'dani',
// 1 : 'martina,roman'
// },
// 1 : {
// 0 : 'dani',
// 1 : 'pascal,roman'
// }
// },
// 6 : {
// 0 : {
// 0 : 'andi,roman',
// 1 : 'andi'
// },
// 1 : {
// 0 : 'andi,roman',
// 1 : 'andi'
// }
// }
