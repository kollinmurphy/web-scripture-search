class BoldedWord {
    constructor(word, start, len) {
        if (typeof word == "string") {
            this.str = [{
                txt: word,
                bold: false
            }];
        } else {
            this.str = word.str;
        }
        this.bold(start, len);
    }

    bold(start, len) {
        let end = start + len;
        let cnt = 0;
        let subS = [{txt: "", bold: true}];
        for (let i = 0; i < this.str.length; i++) {
            for (let ch = 0; ch < this.str[i].txt.length; ch++) {
                if (cnt >= start && cnt < end || this.str[i].bold) {
                    if (subS[subS.length - 1].bold) {
                        subS[subS.length - 1].txt += this.str[i].txt.charAt(ch);
                    } else {
                        subS.push({txt: this.str[i].txt.charAt(ch), bold: true});
                    }
                } else {
                    if (!subS[subS.length - 1].bold) {
                        subS[subS.length - 1].txt += this.str[i].txt.charAt(ch);
                    } else {
                        subS.push({txt: this.str[i].txt.charAt(ch), bold: false});
                    }
                }
                cnt += 1;
            }
        }
        this.str = subS;
    }
    
    toString() {
        let s = "";
        for (let i = 0; i < this.str.length; i++) {
            if (this.str[i].bold && this.str[i].txt != "") {
                s += "<span class='bold'>" + this.str[i].txt + "</span>";
            } else {
                s += this.str[i].txt;
            }
        }
        return s;
    }


}