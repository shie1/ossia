export function getMixedValue(original: string) {
    var maskbase = [45, 65, 3, 65, 78, 105];
    var mixedvalue = [];
    for (var i = 0; i < original.length; i++)
        mixedvalue.push(original.charCodeAt(i));
    while (mixedvalue.length % 4 != 0)
        mixedvalue.push(0);
    var realmask = [];
    var maskindex = 0;
    while (realmask.length < mixedvalue.length) {
        realmask.push(maskbase[maskindex]);
        maskindex++;
        if (maskindex >= maskbase.length) maskindex = 0;
    }
    for (var i = 0; i < mixedvalue.length; i++)
        mixedvalue[i] = mixedvalue[i] ^ realmask[i];
    var tmp = [0, 0, 0, 0];
    for (var ti = 0; ti < 4; ti++)
        tmp[ti] = mixedvalue[ti];
    for (var i = 0; i < mixedvalue.length - 4; i += 4) {
        for (var ti = 0; ti < 4; ti++) {
            mixedvalue[i + ti] = mixedvalue[i + 4 + ti];
        }
    }
    for (var ti = 0; ti < 4; ti++)
        mixedvalue[mixedvalue.length - 4 + ti] = tmp[ti];
    var result = "";
    for (var i = 0; i < mixedvalue.length; i++) {
        result += mixedvalue[i].toString(16).padStart(2, "0");
    }
    return result;
}