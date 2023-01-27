class Engine {
    constructor() {
        this.keywords = "";
        this.selectedBook = "";
    }

    beginSearch(keywords) {
        this.keywords = keywords;
        this.selectedBook = getSelectedBook();
        this.searchByBook();
    }

    searchByBook() {
        let arrayKeywords = parseKeywords(this.keywords);
        let results = {
            verseCount: 0,
            occurrenceCount: 0,
            list: []
        };
        switch (this.selectedBook) {
            case "ot":
                runSearchMain(arrayKeywords, oldTestament, results);
                break;
            case "nt":
                runSearchMain(arrayKeywords, newTestament, results);
                break;
            case "bom":
                runSearchMain(arrayKeywords, bookOfMormon, results);
                break;
            case "dc":
                runSearchDC(arrayKeywords, results);
                break;
            case "pearl":
                runSearchMain(arrayKeywords, pearlOfGreatPrice, results);
                break;
            case "all":
                runSearchMain(arrayKeywords, oldTestament, results);
                runSearchMain(arrayKeywords, newTestament, results);
                runSearchMain(arrayKeywords, bookOfMormon, results);
                runSearchDC(arrayKeywords, results);
                runSearchMain(arrayKeywords, pearlOfGreatPrice, results);
                break;
        };
        document.querySelector("#searchResults").innerHTML = this.generateResults(results);
        return 1;
    }

    generateResults(result) {
        let r = "";
        for (let i = 0; i < result.list.length; i++) {
            let txt = result.list[i].text.split(" ");
            for (let o = 0; o < result.list[i].occurrences.length; o++) {
                if (!result.list[i].occurrences[o].hasOwnProperty("start")) {
                    txt[result.list[i].occurrences[o].word] = new BoldedWord(txt[result.list[i].occurrences[o].word], 0, txt[result.list[i].occurrences[o].word].length);
                } else {
                    txt[result.list[i].occurrences[o].word] = new BoldedWord(txt[result.list[i].occurrences[o].word], result.list[i].occurrences[o].start, result.list[i].occurrences[o].len);
                }
            }
            r += "<p><span class='reference'><a href='" + createChurchLink(result.list[i].reference) + "' target='_blank'>" + result.list[i].reference;
            r += "</a></span><br>" + joinWords(txt) + "</p>";
        }
        let preamble = "";
        preamble += (result.verseCount != 1) ? result.verseCount + " results" : "1 result";
        preamble += " for <span class='reference'>" + this.keywords + "</span><br><br>";
        return preamble + r;
    }
}

function joinWords(txt) {
    s = "";
    for (let i = 0; i < txt.length; i++) {
        s += txt[i].toString();
        if (i != txt.length - 1) {
            s += " ";
        }
    }
    return s;
}

var bookCodes = {
    "bofm": {
        "1 Nephi": "1-ne",
        "2 Nephi": "2-ne",
        "Jacob": "",
        "Enos": "",
        "Jarom": "",
        "Omni": "",
        "Words of Mormon": "w-of-m",
        "Mosiah": "",
        "Alma": "",
        "Helaman": "hel",
        "3 Nephi": "3-ne",
        "4 Nephi": "4-ne",
        "Mormon": "morm",
        "Ether": "",
        "Moroni": "moro"
    },
    "nt": {
        "Matthew" : "matt",
        "Mark": "",
        "Luke": "",
        "John": "",
        "Acts": "",
        "Romans": "rom",
        "1 Corinthians": "1-cor",
        "2 Corinthians": "2-cor",
        "Galatians": "gal",
        "Ephesians": "eph",
        "Philippians": "philip",
        "Colossians": "col",
        "1 Thessalonians": "1-thes",
        "2 Thessalonians": "2-thes",
        "1 Timothy": "1-tim",
        "2 Timothy": "2-tim",
        "Titus": "",
        "Philemon": "philem",
        "Hebrews": "heb",
        "James": "",
        "1 Peter": "1-pet",
        "2 Peter": "2-pet",
        "1 John": "1-jn",
        "2 John": "2-jn",
        "3 John": "3-jn",
        "Jude": "",
        "Revelation": "rev",
    },
    "ot": {
        "Genesis": "gen",
        "Exodus": "ex",
        "Leviticus": "lev",
        "Numbers": "num",
        "Deuteronomy": "deut",
        "Joshua": "josh",
        "Judges": "judg",
        "Ruth": "",
        "1 Samuel": "1-sam",
        "2 Samuel": "2-sam",
        "1 Kings": "1-kgs",
        "2 Kings": "2-kgs",
        "1 Chronicles": "1-chr",
        "2 Chronicles": "2-chr",
        "Ezra": "",
        "Nehemiah": "neh",
        "Esther": "esth",
        "Job": "",
        "Psalms": "ps",
        "Proverbs": "prov",
        "Ecclesiastes": "eccl",
        "Song Solomon": "song",
        "Isaiah": "isa",
        "Jeremiah": "jer",
        "Lamentations": "lam",
        "Ezekiel": "ezek",
        "Daniel": "dan",
        "Hosea": "",
        "Joel": "",
        "Amos": "",
        "Obadiah": "obad",
        "Jonah": "",
        "Micah": "",
        "Nahum": "",
        "Habakkuk": "hab",
        "Zephaniah": "zeph",
        "Haggai": "hag",
        "Zechariah": "zech",
        "Malachi": "mal"
    },
    "pgp": {
        "Moses": "",
        "Abraham": "abr",
        "Joseph Smith—Matthew": "js-m",
        "Joseph Smith—History": "js-h",
        "Articles Faith": "a-of-f",
    },
    "dc-testament": {
        "D&C": "dc"
    }
};

function createChurchLink(reference) {
    let ref = reference.replace("of ", "").split(":");
    let chapNum = ref[0].match(/\d+$/g);
    let bookName = "";
    ref[0] = ref[0].split(" ");
    if (ref[0].length == 3) {
        bookName = ref[0][0] + " " + ref[0][1];
    } else {
        bookName = ref[0][0];
    }
    let s = "https://www.churchofjesuschrist.org/study/scriptures/";
    let bookCode = "";
    for (const property in bookCodes) {
        if (bookCodes[property].hasOwnProperty(bookName)) {
            if (bookCodes[property][bookName] == "") {
                bookCode = property + "/" + bookName.toLowerCase();
            } else {
                bookCode = property + "/" + bookCodes[property][bookName];
            }
        }
    }
    for (var i = 0; i < bookCodes.length; i++) {
        
    }
    return s + bookCode + "/" + chapNum[0] + "." + ref[1] + "#p" + ref[1] + "#" + ref[1];
}

function parseKeywords(string) {
    let ar = string.split(",");
    for (let i = 0; i < ar.length; i++) {
        let trimmedKeyphrase = ar[i].replace(/\s\s+/g, " ").trim();

        // if first and last characters are double quotes, mark it as an exact keyphrase
        let containsQuotes = (trimmedKeyphrase.charCodeAt(0) === 34 && trimmedKeyphrase.charCodeAt(trimmedKeyphrase.length - 1) === 34);

        let keyphrases = trimmedKeyphrase.split(" ");

        for (let k = 0; k < keyphrases.length; k++) {
            let keywords = keyphrases[k].split("");
            let r = "";

            for (let j = 0; j < keywords.length; j++) {
                let c = keywords[j].charCodeAt();
                if (c > 64 && c < 91 || c > 96 && c < 123 || c === 39) {
                    // if is A-Z, a-z, or ' (apostrophe)
                    r += keywords[j].toLowerCase();
                }
            }
            keyphrases[k] = r;
        }

        ar[i] = {
            list: keyphrases,
            quotes: containsQuotes
        };
    }
    let finalArray = [];
    for (let i = 0; i < ar.length; i++) {
        if (ar[i].list[0] != "") {
            finalArray.push(ar[i]);
        }
    }
    return finalArray;
}

function runSearchMain(arrayKeywords, bookToSearch, results) {
    for (let book = 0; book < bookToSearch.books.length; book++) {
        for (let chapter = 0; chapter < bookToSearch.books[book].chapters.length; chapter++) {
            for (let verse = 0; verse < bookToSearch.books[book].chapters[chapter].verses.length; verse++) {
                let thisVerse = bookToSearch.books[book].chapters[chapter].verses[verse];
                evalVerse(thisVerse, arrayKeywords, results);
            }
        }
    }
}

function runSearchDC(arrayKeywords, results) {
    for (let section = 0; section < doctrineAndCovenants.sections.length; section++) {
        for (let verse = 0; verse < doctrineAndCovenants.sections[section].verses.length; verse++) {
            let thisVerse = doctrineAndCovenants.sections[section].verses[verse];
            evalVerse(thisVerse, arrayKeywords, results);
        }
    }
}

function evalVerse(thisVerse, arrayKeywords, results) {
    let thisResult = JSON.parse(JSON.stringify(thisVerse));
    thisResult.occurrences = [];

    for (let keyphrase = 0; keyphrase < arrayKeywords.length; keyphrase++) {
        if (arrayKeywords[keyphrase].quotes) {
            // must look for an exact match

            let found = {
                matchingWords: [],
                word: 0,
                iterationMatches: []
            };

            for (let word = 0; word < thisVerse.parsedText.length; word++) {

                if (thisVerse.parsedText[word] === arrayKeywords[keyphrase].list[found.word]) {
                    found.word++;
                    found.iterationMatches.push({word: word});
                    if (found.iterationMatches.length == arrayKeywords[keyphrase].list.length) {
                        found.matchingWords = found.matchingWords.concat(found.iterationMatches);
                        found.iterationMatches = [];
                        found.word = 0;
                    }
                } else {
                    found.iterationMatches = [];
                    found.word = 0;
                }

            }

            thisResult.occurrences = thisResult.occurrences.concat(found.matchingWords);

        } else {

            let found = {
                matchingWords: [],
                wordChecks: (new Array(arrayKeywords[keyphrase].list.length).fill(false))
            };

            for (let word = 0; word < thisVerse.parsedText.length; word++) {
                let keywordIndex = arrayKeywords[keyphrase].list.indexOf(thisVerse.parsedText[word]);
                if (keywordIndex !== -1) {
                    found.wordChecks[keywordIndex] = true;
                    found.matchingWords.push({word: word});
                } else {
                    // if length of word is greater than 2, search for word as a substr of key
                    let txt = thisVerse.text.split(" ");
                    if (txt[word].length > 2) {
                        for (let i = 0; i < arrayKeywords[keyphrase].list.length; i++) {
                            if (arrayKeywords[keyphrase].list[i].length > 2) {
                                let substrIndex = txt[word].toLowerCase().indexOf(arrayKeywords[keyphrase].list[i]);
                                if (substrIndex !== -1) {
                                    found.wordChecks[i] = true;
                                    found.matchingWords.push({
                                        word: word,
                                        start: substrIndex,
                                        len: arrayKeywords[keyphrase].list[i].length
                                    });
                                    
                                }
                            }
                        }
                    }
                }
            }

            // if all elements in array wordChecks are true, then add the occurrences to the result array
            if (found.wordChecks.every(function (val) { return val; })) {
                thisResult.occurrences = thisResult.occurrences.concat(found.matchingWords);
            }

        }
    }

    if (thisResult.occurrences.length > 0) {
        results.verseCount++;
        results.list.push(thisResult);
    }
}

function getSelectedBook() {
    let bookSymbols = ["all", "ot", "nt", "bom", "dc", "pearl"];
    for (i = 0; i < bookSymbols.length; i++) {
        if (document.querySelector("#" + bookSymbols[i]).checked) {
            return bookSymbols[i];
        }
    }
}