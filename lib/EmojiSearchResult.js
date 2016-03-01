//eshint: esnext: true, node: true;

"use strict";

var Enumerable = require('linq');

var EmojiSearchResult = (function() {
    function EmojiSearchResult(data) {
        this.prototype = Object.assign(this, data);
    }

    EmojiSearchResult.prototype.toData = function() {
        return Enumerable.from(Object.keys(this))
            .where('$ !== "prototype" ')
            .select((key) => {
                return { key: key, value: this[key] };
            })
            .toObject('$.key', '$.value');
    }

    EmojiSearchResult.prototype.format = function(fmt) {
        if (!fmt) {
            return this.formatSimple();
        }

        if (fmt === "all") {
            return this.formatAll();
        }

        var fmtAry = fmt.split('\\%');
        var result = Enumerable.from(fmtAry)
                .select((fmt) => {
                    fmt = fmt.replace(/\%c/g, this.code);
                    fmt = fmt.replace(/\%C/g, this.chars);
                    fmt = fmt.replace(/\%n/g, this.name);
                    fmt = fmt.replace(/\%g/g, this.age);
                    fmt = fmt.replace(/\%d/g, this.default);
                    fmt = fmt.replace(/\%a/g, this.annotations.join(", "));

                    return fmt;
                })
                .toArray()
                .join('$');

        return result;
    }

    EmojiSearchResult.prototype.formatSimple = function() {
        return `${this.chars} ${this.name} (${this.code}) - ${this.annotations.join(", ")}`;
    }

    EmojiSearchResult.prototype.formatAll = function() {
        return `${this.code}\t${this.chars}\t${this.name}\t${this.age}\t${this.default}\t${this.annotations.join(", ")}`;
    }

    EmojiSearchResult.prototype.formatJson = function() {
        var data = this.toData();
        return JSON.stringify(data);
    }
    
    return EmojiSearchResult;
})();

module.exports = EmojiSearchResult;
