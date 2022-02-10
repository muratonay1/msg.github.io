/**
 * @author İsmet Murat ONAY 
 * @version 1.0.0, 29/01/2022
 */
Object.prototype.jget =
    Object.prototype.jget ||
    function(params) {
        var snapshot = this;

        function isObject(p) {
            var flag;
            p.constructor.name == "Object" ? (flag = true) : (flag = false);
            return flag;
        }

        function recursion(_obj) {
            for (let i = 0; i < _obj.length; i++) {
                if (isObject(snapshot[_obj[i]])) {
                    snapshot = snapshot[_obj[i]];
                    recursion(snapshot);
                } else {
                    snapshot = snapshot[_obj[i]];
                    break;
                }
            }
            return snapshot;
        }
        return recursion(params.split("."));
    };

Object.prototype.jcontain =
    Object.prototype.jcontain ||
    function(property) {
        if (this[property] != undefined) {
            return true;
        }
    };

Object.prototype.jpush =
    Object.prototype.jpush ||
    function(property, value) {
        if (value == null) {
            if (typeof this == "object") {
                var key = Object.keys(property);
                for (var i = 0; i < key.length; i++) {
                    this[key[i]] = property[key[i]];
                }
            }
        } else {
            if (typeof this == "object") {
                this[property] = value;
            }
        }
    };

Object.prototype.jstring =
    Object.prototype.jstring ||
    function() {
        return JSON.stringify(this);
    };
Object.prototype.jparse =
    Object.prototype.jparse ||
    function() {
        return JSON.parse(this);
    };

Object.prototype.formatDate = Object.prototype.jstring || function(format = String, split = String) {
    if (format == "ddMMyyyy") {
        var datePart = this.split('/');
        for (let i = 0; i < datePart.length; i++) {
            if (datePart[i].length == 1) {
                datePart[i] = "0" + datePart[i];
            }
        }
        var swap = datePart[0];
        datePart[0] = datePart[1];
        datePart[1] = swap;
        var outDate = "";
        for (let i = 0; i < datePart.length; i++) {
            i != datePart.length - 1 ? outDate += datePart[i] + split : outDate += datePart[i]
        }
        return outDate;
    }
}

String.prototype.encrypt = String.prototype.encrypt || function() {
    let steps = this.length * 2;

    var alphabet = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'ç', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
        'l', 'm', 'n', 'o', 'ö', 'p', 'q', 'r', 's', 'ş', 't', 'u', 'ü', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F',
        'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '!',
        '#', '$', '+', '-', '/', ':', '@', '[', '.', '*', '_', '%'
    ];
    var chipherText = "";
    if (steps > alphabet.length) {
        steps = steps % alphabet.length;
    }
    for (let i = 0; i < this.length; i++) {
        let char_index = alphabet.indexOf(this[i]) + steps;
        if (char_index > alphabet.length) {
            char_index = char_index % alphabet.length;
        }
        chipherText += alphabet[char_index];
    }
    return chipherText;
}

/** extend DECRYPT */
String.prototype.decrypt = String.prototype.decrypt || function() {
    /**
     * @notfixed > '2' harfinde decrypt ederken undefined veriyor 
     */
    let steps = this.length * 2;
    var alphabet = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'ç', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
        'l', 'm', 'n', 'o', 'ö', 'p', 'q', 'r', 's', 'ş', 't', 'u', 'ü', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F',
        'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '!',
        '#', '$', '+', '-', '/', ':', '@', '[', '.', '*', '_', '%'
    ];
    plaintext = "";

    if (steps > alphabet.length) {
        steps = steps % alphabet.length;
        steps = (-1) * steps
    }
    for (let i = 0; i < this.length; i++) {
        let char_index = alphabet.indexOf(this[i]) - steps;
        if (char_index < alphabet.length) {
            char_index = char_index % alphabet.length;
        }
        plaintext += alphabet[char_index];
    }
    return plaintext;
}


String.prototype.toInt = String.prototype.toInt || function() {
    return parseInt(this);
}

String.prototype.equals = String.prototype.equals || function(params) {
    if (typeof(params) == "string") {
        var correct = true;
        if (this.length == params.length) {
            for (let i = 0; i < this.length; i++) {
                if (this.charCodeAt(i) != params.charCodeAt(i)) {
                    correct = false;
                }
            }
            return correct;
        } else {
            throw new TypeError;
        }
    }
}

String.prototype.equalsIgnoreCase = String.prototype.equalsIgnoreCase || function(params) {
    try {
        if (String(typeof(params)).equals("string") && String(typeof(this)).equals("string")) {
            var loweration = this.toLowerCase();
            var correct = true;
            params = params.toLowerCase();
            if (loweration.length == params.length) {
                for (let i = 0; i < this.length; i++) {
                    if (loweration.charCodeAt(i) != params.charCodeAt(i)) {
                        correct = false;
                    }
                }
                return correct;
            }
        } else {
            throw new TypeError;
        }

    } catch (error) {
        return error;
    }
}

String.prototype.jParse = String.prototype.jParse || function() {
    try {
        if (JSON.parse(this) == undefined) {
            return ""
        } else {
            return JSON.parse(this);
        }
    } catch (error) {

    }
}
Array.prototype.trimList = Array.prototype.trimList || function() {
    try {
        for (let i = 0; i < this.length; i++) {
            this[i] = this[i].trim();
        }
        return this;
    } catch (error) {
        return error;
    }
}
Array.prototype.toUpperCaseList = Array.prototype.upperCaseList || function() {
    try {
        for (let i = 0; i < this.length; i++) {
            this[i] = this[i].toUpperCase();
        }
        return this;
    } catch (error) {
        return error;
    }
}
Array.prototype.toLowerCaseList = Array.prototype.lowerCaseList || function() {
    try {
        for (let i = 0; i < this.length; i++) {
            this[i] = this[i].toLowerCase();
        }
        return this;
    } catch (error) {
        return error;
    }
}