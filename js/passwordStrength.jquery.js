/**
 *
 * @copyright PasswordStrength (c) 2013 João Parreira <joaofrparreira@gmail.com>
 *
 * Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License
 *  
 * This work is licensed under the Creative Commons 
 * Attribution-NonCommercial-ShareAlike 3.0 Unported License. 
 * To view a copy of this license, visit 
 * http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to 
 * Creative Commons, 444 Castro Street, Suite 900, Mountain View, California, 
 * 94041, USA.
 * ---------------------------------------------------- 
 *
 * Date: 9/Jan/2013
 * File: passStrengthMeasure.jQuery.js 
 * Encoding: UTF-8
 *
 * @author: João Parreira <joaofrparreira@gmail.com>
 * @package Project: passwordStrength.jquery 
 * @version 0.1.3
 *
 **/

/**
 * @param {type} jQuery
 * @param {type} window
 * @param {type} undefined
 * @returns {undefined}
 */

;
(function(jQuery, window, undefined) {
    var PasswordStrength = this.PasswordStrength = function(elem, options) {
        this.options = jQuery.extend(true,{}, jQuery.fn.passwordStrength.defaultSettings, options || {});
        this.$elem = jQuery(elem);
        this.percentage = 0;
        this.complexity = 0;
        this.time = 0;
        this.valid = false;
        //this.target = null;
        this.divs = {
            targetDiv: null,
            progressDiv: null,
            progressBarDiv: null,
            percentageDiv: null,
            timeDiv: null
        };
        this.init();
        // make sure to return the object so we can reference it later
        return this;
    };
    PasswordStrength.prototype = {
        init: function() {
            var $this = this;
            $this.$elem.keyup(function() {
                var password = $this.$elem.val();
                $this._complexity(password);
                $this._time(password);
                if ($this.options.show === true)
                    $this._show();
                if ($this.options.callback !== undefined) {
                    $this.valid = this.minimumChars < password.length ? true : false;
                    $this.options.callback.call($this);
                }
            });
        },
        _getTargetDiv: function(targetDiv, name, parent) {
            if (targetDiv === null) {
                var a = jQuery("<div/>", {id: name});
                if (parent !== null)
                    a.insertAfter(parent);
                return a;
            }
            if (typeof targetDiv === "string")
                return jQuery("#" + targetDiv);
            if (targetDiv instanceof jQuery)
                return targetDiv;

        },
        _show: function() {
            if (this.divs.targetDiv === null) {
                this.divs.targetDiv = this._getTargetDiv(this.options.targetDiv, 'passwordStrength', this.$elem);
            }
            if (this.options.showProgressBar === true) {
                if (this.divs.progressBarDiv === null) {
                    this.divs.progressBarDiv = this._getTargetDiv(this.options.progressBarTargetDiv, 'progressbar', null);
                    if (this.divs.progressDiv === null) {
                        this.divs.progressDiv = this._getTargetDiv(this.options.progressTargetDiv, 'progress', null);
                        this.divs.progressDiv.appendTo(this.divs.progressBarDiv);
                    }
                    this.divs.progressBarDiv.appendTo(this.divs.targetDiv);
                }
                this.divs.progressDiv.css({'width': this.percentage + '%', 'backgroundColor': "rgb(" + Math.floor((100 - this.percentage) / 50 * 255) + "," + Math.floor((255 * (this.percentage / 50))) + ",0)"});
            }
            if (this.options.showPercentage === true) {
                if (this.divs.percentageDiv === null) {
                    this.divs.percentageDiv = this._getTargetDiv(this.options.percentageTargetDiv, 'percentage', null);
                    if (this.options.showProgressBar === true)
                        this.divs.percentageDiv.appendTo(this.divs.progressBarDiv);
                    else
                        this.divs.percentageDiv.appendTo(this.divs.targetDiv);
                }
                this.divs.percentageDiv.html(this.percentage + '%');
            }
            if (this.options.showTime === true) {
                if (this.divs.timeDiv === null) {
                    this.divs.timeDiv = this._getTargetDiv(this.options.timeTargetDiv, 'time', null);
                    this.divs.timeDiv.appendTo(this.divs.targetDiv);
                }
                this.divs.timeDiv.html(this.time);
            }
        },
        _additionalComplexityForCharset: function(str, charset) {
            for (var i = str.length - 1; i >= 0; i--) {
                if (charset[0] <= str.charCodeAt(i) && str.charCodeAt(i) <= charset[1]) {
                    return charset[1] - charset[0] + 1;
                }
            }
            return 0;
        },
        _complexity: function(password) {
            var complexity = 0;
            if (!this._inBanlist(password)) {
                for (i = this.CHARSET.length - 1; i >= 0; i--) {
                    complexity += this._additionalComplexityForCharset(password, this.CHARSET[i]);
                }
            } else {
                complexity = 1;
            }
            this.complexity = complexity = Math.log(Math.pow(complexity, password.length));
            complexity = (complexity / this.MAX_COMPLEXITY) * 100;
            complexity = (complexity > 100) ? 100 : complexity;
            this.percentage = Math.round(complexity);
        },
        _inBanlist: function(str) {
            if (this.options.banmode === 'strict') {
                for (var i = 1; i <= str.length; i++) {
                    if (jQuery.inArray(str.substr(0, i), this.options.bannedPasswords) > -1) {
                        // Will return true if a word from the list appears at
                        // the beginning of the password
                        return true;
                    }
                }
                return false;
            } else {
                return jQuery.inArray(str, this.options.bannedPasswords) > -1 ? true : false;
            }
        },
        _time: function(str) {
            var pos = Math.pow(this.complexity, str.length);
            var s = pos / this.options.rate;

            var decimalYears = s / (3600 * 24 * 365);
            var years = Math.floor(decimalYears);

            var decimalMonths = (decimalYears - years) * 12;
            var months = Math.floor(decimalMonths);

            var decimalDays = (decimalMonths - months) * 30;
            var days = Math.floor(decimalDays);

            var decimalHours = (decimalDays - days) * 24;
            var hours = Math.floor(decimalHours);

            var decimalMinutes = (decimalHours - hours) * 60;
            var minutes = Math.floor(decimalMinutes);

            var decimalSeconds = (decimalMinutes - minutes) * 60;
            var seconds = Math.floor(decimalSeconds);

            var time = [];

            if (years > 0) {
                if (years === 1)
                    time.push("1 " + this.options.text.year.split("|")[0] + ", ");
                else
                    time.push(years + " " + this.options.text.year.split("|")[1] + ", ");
            }
            if (months > 0) {
                if (months === 1)
                    time.push("1 " + this.options.text.month.split("|")[0] + ", ");
                else
                    time.push(months + " " + this.options.text.month.split("|")[1] + ", ");
            }
            if (days > 0) {
                if (days === 1)
                    time.push("1 " + this.options.text.day.split("|")[0] + ", ");
                else
                    time.push(days + " " + this.options.text.day.split("|")[1] + ", ");
            }
            if (hours > 0) {
                if (hours === 1)
                    time.push("1 " + this.options.text.hour.split("|")[0] + ", ");
                else
                    time.push(hours + " " + this.options.text.hour.split("|")[1] + ", ");
            }
            if (minutes > 0) {
                if (minutes === 1)
                    time.push("1 " + this.options.text.minute.split("|")[0] + ", ");
                else
                    time.push(minutes + " " + this.options.text.minute.split("|")[1] + ", ");
            }
            if (seconds > 0) {
                if (seconds === 1)
                    time.push("1 " + this.options.text.second.split("|")[0] + ", ");
                else
                    time.push(seconds + " " + this.options.text.second.split("|")[1] + ", ");
            }

            if (time.length <= 0)
                time = this.options.text.lessthanonesecond + ", ";
            else if (time.length === 1)
                time = time[0];
            else
                time = time[0] + time[1];
            this.time = this.options.text.canbefound + time.substring(0, time.length - 2);
        },
        MIN_COMPLEXITY: 49,
        MAX_COMPLEXITY: 120,
        CHARSET: [//Commonly Used
            [0x0030, 0x0039], // Numbers
            [0x0041, 0x005A], // Uppercase
            [0x0061, 0x007A], // Lowercase
            [0x0021, 0x002F], // Punctuation
            [0x003A, 0x0040], // Punctuation
            [0x005B, 0x0060], // Punctuation
            [0x007B, 0x007E], // Punctuation    //Everything Else
            [0x0080, 0x00FF], // Latin-1 Supplement
            [0x0100, 0x017F], // Latin Extended-A
            [0x0180, 0x024F], // Latin Extended-B
            [0x0250, 0x02AF], // IPA Extensions
            [0x02B0, 0x02FF], // Spacing Modifier Letters
            [0x0300, 0x036F], // Combining Diacritical Marks
            [0x0370, 0x03FF], // Greek
            [0x0400, 0x04FF], // Cyrillic
            [0x0530, 0x058F], // Armenian
            [0x0590, 0x05FF], // Hebrew
            [0x0600, 0x06FF], // Arabic
            [0x0700, 0x074F], // Syriac
            [0x0780, 0x07BF], // Thaana
            [0x0900, 0x097F], // Devanagari
            [0x0980, 0x09FF], // Bengali
            [0x0A00, 0x0A7F], // Gurmukhi
            [0x0A80, 0x0AFF], // Gujarati
            [0x0B00, 0x0B7F], // Oriya
            [0x0B80, 0x0BFF], // Tamil
            [0x0C00, 0x0C7F], // Telugu
            [0x0C80, 0x0CFF], // Kannada
            [0x0D00, 0x0D7F], // Malayalam
            [0x0D80, 0x0DFF], // Sinhala
            [0x0E00, 0x0E7F], // Thai
            [0x0E80, 0x0EFF], // Lao
            [0x0F00, 0x0FFF], // Tibetan
            [0x1000, 0x109F], // Myanmar
            [0x10A0, 0x10FF], // Georgian
            [0x1100, 0x11FF], // Hangul Jamo
            [0x1200, 0x137F], // Ethiopic
            [0x13A0, 0x13FF], // Cherokee
            [0x1400, 0x167F], // Unified Canadian Aboriginal Syllabics
            [0x1680, 0x169F], // Ogham
            [0x16A0, 0x16FF], // Runic
            [0x1780, 0x17FF], // Khmer
            [0x1800, 0x18AF], // Mongolian
            [0x1E00, 0x1EFF], // Latin Extended Additional
            [0x1F00, 0x1FFF], // Greek Extended
            [0x2000, 0x206F], // General Punctuation
            [0x2070, 0x209F], // Superscripts and Subscripts
            [0x20A0, 0x20CF], // Currency Symbols
            [0x20D0, 0x20FF], // Combining Marks for Symbols
            [0x2100, 0x214F], // Letterlike Symbols
            [0x2150, 0x218F], // Number Forms
            [0x2190, 0x21FF], // Arrows
            [0x2200, 0x22FF], // Mathematical Operators
            [0x2300, 0x23FF], // Miscellaneous Technical
            [0x2400, 0x243F], // Control Pictures
            [0x2440, 0x245F], // Optical Character Recognition
            [0x2460, 0x24FF], // Enclosed Alphanumerics
            [0x2500, 0x257F], // Box Drawing
            [0x2580, 0x259F], // Block Elements
            [0x25A0, 0x25FF], // Geometric Shapes
            [0x2600, 0x26FF], // Miscellaneous Symbols
            [0x2700, 0x27BF], // Dingbats
            [0x2800, 0x28FF], // Braille Patterns
            [0x2E80, 0x2EFF], // CJK Radicals Supplement
            [0x2F00, 0x2FDF], // Kangxi Radicals
            [0x2FF0, 0x2FFF], // Ideographic Description Characters
            [0x3000, 0x303F], // CJK Symbols and Punctuation
            [0x3040, 0x309F], // Hiragana
            [0x30A0, 0x30FF], // Katakana
            [0x3100, 0x312F], // Bopomofo
            [0x3130, 0x318F], // Hangul Compatibility Jamo
            [0x3190, 0x319F], // Kanbun
            [0x31A0, 0x31BF], // Bopomofo Extended
            [0x3200, 0x32FF], // Enclosed CJK Letters and Months
            [0x3300, 0x33FF], // CJK Compatibility
            [0x3400, 0x4DB5], // CJK Unified Ideographs Extension A
            [0x4E00, 0x9FFF], // CJK Unified Ideographs
            [0xA000, 0xA48F], // Yi Syllables
            [0xA490, 0xA4CF], // Yi Radicals
            [0xAC00, 0xD7A3], // Hangul Syllables
            [0xD800, 0xDB7F], // High Surrogates
            [0xDB80, 0xDBFF], // High Private Use Surrogates
            [0xDC00, 0xDFFF], // Low Surrogates
            [0xE000, 0xF8FF], // Private Use
            [0xF900, 0xFAFF], // CJK Compatibility Ideographs
            [0xFB00, 0xFB4F], // Alphabetic Presentation Forms
            [0xFB50, 0xFDFF], // Arabic Presentation Forms-A
            [0xFE20, 0xFE2F], // Combining Half Marks
            [0xFE30, 0xFE4F], // CJK Compatibility Forms
            [0xFE50, 0xFE6F], // Small Form Variants
            [0xFE70, 0xFEFE], // Arabic Presentation Forms-B
            [0xFEFF, 0xFEFF], // Specials
            [0xFF00, 0xFFEF], // Halfwidth and Fullwidth Forms
            [0xFFF0, 0xFFFD]  // Specials
        ]
    };
    jQuery.fn.passwordStrength = function(options, callback) {
        if (callback !== undefined)
            options.callback = callback;
        return this.each(function() {
            if (!jQuery.data(this, "_PasswordStrength")) {
                jQuery.data(this, "_PasswordStrength", new PasswordStrength(this, options));
            }
        });
    };

    jQuery.fn.passwordStrength.defaultSettings = {
        targetDiv: null,
        show: true,
        showProgressBar: true,
        progressTargetDiv: null,
        progressBarTargetDiv: null,
        showPercentage: true,
        percentageTargetDiv: null,
        showTime: true,
        timeTargetDiv: null,
        minimumChars: 8,
        bannedPasswords: [],
        banmode: 'strict', // (strict|loose)
        rate: 348000000000, //Fastest bruteforce machine until December 2012 http://hackaday.com/2012/12/06/25-gpus-brute-force-348-billion-hashes-per-second-to-crack-your-passwords/
        text: {
            year: 'year|years',
            month: 'month|months',
            day: 'day|days',
            hour: 'hour|hours',
            minute: 'minute|minutes',
            second: 'second|seconds',
            lessthanonesecond: 'less than one second',
            canbefound: 'Can be found in: '
        }
    };
})(jQuery, window);
