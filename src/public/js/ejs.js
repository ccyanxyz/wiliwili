EJS_SYNTAX = [/{%(.+?)%}/, /{{(.+?)}}/];

function ejs(templateStr) {
    var result = [];
    
    function output(text) {
        if (text) {
            result.push("output.push('" + 
                        text.replace(/\\/g, "\\\\").replace(/'/g, "\\'") +
                        "');");
        }
    }
    
    function search(str, re) {
        var nearest = str.length;
        for (var i = 0; i < re.length; i++) {
            var pos = str.search(re[i]);
            if (pos >= 0 && pos < nearest) {
                nearest = pos;
                nearestRe = re[i];
            }
        }
        
        if (nearest >= 0 && nearest < str.length ) {
            var prefix = str.substring(0, nearest);
            str = str.substring(nearest);
            var r = nearestRe.exec(str);
            str = str.substring(r[0].length);
            return [prefix, r, str];
        }
        
        return null;
    }
    
    result.push("var output = [];");
    var lines = templateStr.split('\n');
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        
        while (true) {
            var test = search(line, EJS_SYNTAX);
            if (test) {
                output(test[0]);
                
                var codeType = test[1][0].substring(0, 2);
                if (codeType == '{%') {
                    result.push(test[1][1]);
                }
                else if (codeType == '{{') {
                    result.push('output.push(' + test[1][1] + ')');
                }
                
                line = test[2];
            }
            else {
                output(line);
                break;
            }
        };
        
        result.push('output.push("\\n");');
    }
    result.push("return output.join('');");
    
    var renderer = new Function('context', result.join('\n'));
    return renderer;
}
