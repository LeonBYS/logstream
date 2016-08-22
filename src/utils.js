'use strict'


class Counter {
    constructor (milliseconds) {
        this.milliseconds = milliseconds;
        this.timestamps = [];
    }

    count() {
        var now = Date.now();
        this.timestamps = this.timestamps.filter(x => now-x <= this.milliseconds);
        return this.timestamps.length;
    }

    inc() {
        this.timestamps.push(Date.now());
    }
}


class LogCounter {
    constructor (milliseconds) {
        this.milliseconds = milliseconds;
        this.table = {};
    }

    inc(key) {
        if (!this.table[key]) {
            this.table[key] = new Counter(this.milliseconds);
        }
        this.table[key].inc();
    }

    count(key) {
        if (!this.table[key]) {
            this.table[key] = new Counter(this.milliseconds);
        }
        return this.table[key].count();
    }
}


module.exports = {
	LogCounter: LogCounter
};