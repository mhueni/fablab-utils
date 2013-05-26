(function() {
	var MyModels = this.MyModels = {};

	MyModels.AppModel = Backbone.Model.extend({
		defaults : {},
		initialize : function() {
			_.extend(this, this.attributes);
			this.shifts = new MyModels.ShiftCollection();
			this.exceptions = new MyModels.ExceptionCollection();
		}
	});

	MyModels.BaseModel = Backbone.Model.extend({
		idAttribute : 'id'
	});
	MyModels.BaseCollection = Backbone.Collection.extend({});

	MyModels.User = MyModels.BaseModel.extend({});

	MyModels.Shift = MyModels.BaseModel.extend({});
	MyModels.ShiftCollection = MyModels.BaseCollection.extend({
		model : MyModels.Shift
	});

	MyModels.Exception = MyModels.BaseModel.extend({});
	MyModels.ExceptionCollection = MyModels.BaseCollection.extend({
		model : MyModels.Exception,
		update : function(data) {
			var self = this;
			if (_.isArray(data)) {
				_.each(data, function(d) {
					self.update(d);
				});
			} else if (this.where(data).length == 0) {
				self.add(data);
			}
		}
	});
})();
