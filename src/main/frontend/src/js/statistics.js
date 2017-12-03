
let Totals = function (id, title) {
    this.id = id;
    this.title = title;
    this.nb = 0;
    this.distance = 0;
    this.elevationGain = 0;
    this.movingTime = 0;
    this.elapsedTime = 0;
    this.activities = [];

    this.add = function (activity) {
        this.activities.push(activity);
        this.distance += activity.distance;
        this.movingTime += activity.moving_time;
        this.elapsedTime += activity.elapsed_time;
        this.elevationGain += activity.total_elevation_gain;
        this.nb++;
    }

    this.remove = function (activity) {
        var index = this.activities.indexOf(activity);
        if (index > -1) {
            this.activities.splice(index, 1);
        }
        this.distance -= activity.distance;
        this.movingTime -= activity.moving_time;
        this.elapsedTime -= activity.elapsed_time;
        this.elevationGain -= activity.total_elevation_gain;
        this.nb--;
    }
};

function findGearName(athleteProfile, gear_id) {
    if (athleteProfile) {
        for (var bikeIndex in athleteProfile.bikes) {
            var bike = athleteProfile.bikes[bikeIndex];
            if (bike.id == gear_id) {
                return bike.name;
            }
        }
        for (var shoeIndex in athleteProfile.shoes) {
            var shoe = athleteProfile.shoes[shoeIndex];
            if (shoe.id == gear_id) {
                return shoe.name;
            }
        }
    }
    return "unnamed gear";
}

let Statistics = function (withGear, athleteProfile) {

    this.globalTotals = new Totals("total", "Total");
    this.trainerTotals = new Totals("trainer", "Trainer");
    this.manualTotals = new Totals("manual", "Manual");
    this.commuteTotals = new Totals("commute", "Commute");
    this.noCommuteTotals = new Totals("noCommute", "No commute");
    this.bikeDistanceTotals0_50 = new Totals("bike0_50", "Bike 0-50km");
    this.bikeDistanceTotals50_100 = new Totals("bike50_100", "Bike 50-100km");
    this.bikeDistanceTotals100_150 = new Totals("bike100_150", "Bike 100-150km");
    this.bikeDistanceTotals150_200 = new Totals("bike150_200", "Bike 150-200km");
    this.bikeDistanceTotals200 = new Totals("bike200", "Bike more than 200km");
    this.runDistanceTotals0_10 = new Totals("run0_10", "Run 0-10km");
    this.runDistanceTotals10_20 = new Totals("run10_20", "Run 10-20km");
    this.runDistanceTotals20_30 = new Totals("run20_30", "Run 20-30km");
    this.runDistanceTotals30_40 = new Totals("run30_40", "Run 30-40km");
    this.runDistanceTotals40 = new Totals("run40", "Run more than 40km");
    this.gearTotals = {};

    this.totals = [this.globalTotals,
                    this.trainerTotals,
                    this.manualTotals,
                    this.commuteTotals,
                    this.noCommuteTotals,
                    this.bikeDistanceTotals0_50,
                    this.bikeDistanceTotals50_100,
                    this.bikeDistanceTotals100_150,
                    this.bikeDistanceTotals150_200,
                    this.bikeDistanceTotals200,
                    this.runDistanceTotals0_10,
                    this.runDistanceTotals10_20,
                    this.runDistanceTotals20_30,
                    this.runDistanceTotals30_40,
                    this.runDistanceTotals40];



    this.addAll = function (activities) {
        let that = this;
        activities.forEach(function (activity) {
            that.globalTotals.add(activity);

            if (activity.commute) {
                that.commuteTotals.add(activity);
            } else {
                that.noCommuteTotals.add(activity);
            }

            if (activity.trainer) {
                that.trainerTotals.add(activity);
            }

            if (activity.manual) {
                that.manualTotals.add(activity);
            }

            if (activity.type == "Ride") {
                if (activity.distance / 1000 <= 50) {
                    that.bikeDistanceTotals0_50.add(activity);
                }

                if (activity.distance / 1000 > 50 && activity.distance / 1000 <= 100) {
                    that.bikeDistanceTotals50_100.add(activity);
                }

                if (activity.distance / 1000 > 100 && activity.distance / 1000 <= 150) {
                    that.bikeDistanceTotals100_150.add(activity);
                }

                if (activity.distance / 1000 > 150 && activity.distance / 1000 <= 200) {
                    that.bikeDistanceTotals150_200.add(activity);
                }

                if (activity.distance / 1000 > 200) {
                    that.bikeDistanceTotals200.add(activity);
                }
            }
            if (activity.type == "Run") {
                if (activity.distance / 1000 <= 10) {
                    that.runDistanceTotals0_10.add(activity);
                }

                if (activity.distance / 1000 > 10 && activity.distance / 1000 <= 20) {
                    that.runDistanceTotals10_20.add(activity);
                }

                if (activity.distance / 1000 > 20 && activity.distance / 1000 <= 30) {
                    that.runDistanceTotals20_30.add(activity);
                }

                if (activity.distance / 1000 > 30 && activity.distance / 1000 <= 40) {
                    that.runDistanceTotals30_40.add(activity);
                }

                if (activity.distance / 1000 > 40) {
                    that.runDistanceTotals40.add(activity);
                }
            }

            if (withGear && activity.gear_id) {
                var gearName = findGearName(athleteProfile, activity.gear_id);
                if (!that.gearTotals[activity.gear_id]) {
                    that.gearTotals[activity.gear_id] = new Totals(activity.gear_id, gearName);
                }
                that.gearTotals[activity.gear_id].add(activity);
            }
        });
    };

    this.updateActivity = function (editedActivity, oldActivity) {
        // check if trainer attribute has been modified and update trainer totals
        if (editedActivity.trainer != oldActivity.trainer) {
            if (editedActivity.trainer) {
                this.trainerTotals.add(oldActivity);
            } else {
                this.trainerTotals.remove(oldActivity);
            }
            oldActivity.trainer = editedActivity.trainer;
        }
        // check if commute attribute has been modified and update commute and noCommute totals
        if (editedActivity.commute != oldActivity.commute) {
            if (editedActivity.commute) {
                this.commuteTotals.add(oldActivity);
                this.noCommuteTotals.remove(oldActivity);
            } else {
                this.commuteTotals.remove(oldActivity);
                this.noCommuteTotals.add(oldActivity);
            }
            oldActivity.commute = editedActivity.commute;
        }
        // check if gear has been modified and update the corresponding gear totals
        if (editedActivity.gear_id != oldActivity.gear_id) {
            this.gearTotals[oldActivity.gear_id].remove(oldActivity);
            if (!this.gearTotals[editedActivity.gear_id]) {
                this.gearTotals[editedActivity.gear_id] = 
                    new Totals(editedActivity.gear_id, findGearName(athleteProfile, editedActivity.gear_id));
            }
            this.gearTotals[editedActivity.gear_id].add(oldActivity);
            oldActivity.gear_id = editedActivity.gear_id;
        }
    };
};

module.exports = Statistics;
