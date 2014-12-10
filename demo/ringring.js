(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
        module.exports = mod();
    else if (typeof define == "function" && define.amd) // AMD
        return define([], mod);
    else // Plain browser env
        this.Ringring = mod();
})(function() {
    "use strict";

    var hsx = /^\s*#\s*#\s*#\s*#\s*#\s*#\s*/,
        hvx = /^\s*#\s*#\s*#\s*#\s*#\s*/,
        hux = /^\s*#\s*#\s*#\s*#\s*/,
        hrx = /^\s*#\s*#\s*#\s*/,
        htx = /^\s*#\s*#\s*/,
        hox = /^\s*#\s*/,
        wsx = /^\s*$/,
        lsx = /^[\-\*]\s+/,
        brx = /^\s*>\s*>\s*>\s*/,
        btx = /^\s*>\s*>\s*/,
        box = /^\s*>\s*/,
        cox = /^\s*```\s*$/;

    function forward(head, anchor) {
    // 调整起始结束点
    // ({line: INT, ch: INT}, {line: INT, ch: INT}) => {start, end} 
        if (head.line > anchor.line) {
            return {
                start: anchor,
                end: head
            };
        } else if (head.line < anchor.line) {
            return {
                start: head,
                end: anchor
            };
        } else {
            if (head.ch > anchor.ch) {
                return {
                    start: anchor,
                    end: head
                };
            } else {
                return {
                    start: head,
                    end: anchor
                };
            }
        }
    }

    function totalCLRF(str) {
        var i = 0, len = str.length, nnum = 0;
        while (i < len) {
            if (str.charAt(i) === '\n') {
                nnum -= 1;
            }
            i++;
        }
        return nnum;
    }

    function replaceCLRF(str) {
        var i = 0, len = str.length, text = '', ch, nnum = 0;
        while (i < len) {
            ch = str.charAt(i);
            if (ch === '\n') {
                text += ' ';
                nnum -= 1;
            } else {
                text += ch;
            }
            i++;
        }
        return {
            text: text,
            nnum: nnum
        };
    }

    function headFormat(str) {
        var text = '', mark = '', nnum = 0, content;
        if (hsx.test(str)) {
            mark = '';
            text = RegExp.rightContext;
        } else if (hvx.test(str)) {
            mark = '###### ';
            text = RegExp.rightContext;
        } else if (hux.test(str)) {
            mark = '##### ';
            text = RegExp.rightContext;
        } else if (hrx.test(str)) {
            mark = '#### ';
            text = RegExp.rightContext;
        } else if (htx.test(str)) {
            mark = '### ';
            text = RegExp.rightContext;
        } else if (hox.test(str)) {
            mark = '## ';
            text = RegExp.rightContext;
        } else {
            mark = '# ';
            text = str;
        }
        if (wsx.test(text)) {
            text = 'Head';
        } else {
            content = replaceCLRF(text);
            text = content.text.trim().replace(/\s{2,}/g, ' ');
            nnum = content.nnum;
        }
        return {
            text: text,
            mark: mark,
            nnum: nnum
        };
    }

    function head(selections, i, len, selectionRps, selectionNews, texts, crlfs) {
        if (i >= 0 && i < len) {
            // 初始配置
            var 
                // 调整选区顺序
                selection = forward(selections[i].head, selections[i].anchor), 
                // 要替换的选区
                selectionRp = {
                    head: {
                        line: selection.start.line,
                        ch: 0
                    },
                    anchor: {
                        line: selection.end.line,
                        ch: cmdoc.getLine(selection.end.line).length
                    }
                }, 
                // 新的选区
                selectionNew = {
                    head: {
                        line: selectionRp.head.line,
                        ch: selectionRp.head.ch
                    },
                    anchor: {
                        line: selectionRp.anchor.line,
                        ch: selectionRp.anchor.ch
                    }
                }, 
                content = headFormat(cmdoc.getRange(selectionRp.head, selectionRp.anchor)), 
                nnum = content.nnum, 
                text = content.text, 
                mark = content.mark, 
                before = (selectionRp.head.line === 0 || wsx.test(cmdoc.getLine(selectionRp.head.line - 1))) ? '' : '\n',
                after = (selectionRp.anchor.line === (cmdoc.lineCount() - 1) || wsx.test(cmdoc.getLine(selectionRp.anchor.line + 1))) ? '' : '\n',
                beforeLen = before.length, 
                afterLen = after.length;  
            selectionNew.anchor.line = selectionNew.head.line = selectionRp.head.line + beforeLen + crlfs;
            selectionNew.head.ch = selectionRp.head.ch + mark.length;
            selectionNew.anchor.ch = selectionNew.head.ch + text.length;
            selectionRps.push(selectionRp); 
            selectionNews.push(selectionNew); 
            texts.push(before + mark + text + after); 
            return head(selections, ++i, len, selectionRps, selectionNews, texts, crlfs + nnum + beforeLen + afterLen);
        } else {
            return {
                selectionRps: selectionRps,
                selectionNews: selectionNews,
                texts: texts
            };
        }
    }

    function listitemFormat(str) {
    // 替换标记
        var text = '', mark = '', nnum = 0, content;
        if (lsx.test(str)) { 
            mark = '';
            text = RegExp.rightContext;
        } else {
            mark = '- ';
            text = str;
        }
        if (wsx.test(text)) { 
            text = 'Item';
        } else { 
            content = replaceCLRF(text);
            text = content.text.trim().replace(/\s{2,}/g, ' ');
            nnum = content.nnum;
        }
        return {
            text: text,
            mark: mark,
            nnum: nnum
        };
    }

    function listitem(selections, i, len, selectionRps, selectionNews, texts, crlfs) {
        if (i >= 0 && i < len) {
            var selection = forward(selections[i].head, selections[i].anchor), 
                selectionRp = {
                    head: {
                        line: selection.start.line,
                        ch: 0
                    },
                    anchor: {
                        line: selection.end.line,
                        ch: cmdoc.getLine(selection.end.line).length
                    }
                }, 
                selectionNew = {
                    head: {
                        line: selectionRp.head.line,
                        ch: selectionRp.head.ch
                    },
                    anchor: {
                        line: selectionRp.anchor.line,
                        ch: selectionRp.anchor.ch
                    }
                },
                content = listitemFormat(cmdoc.getRange(selectionRp.head, selectionRp.anchor)),  
                text = content.text,
                mark = content.mark,
                nnum = content.nnum;  
            selectionNew.anchor.line = selectionNew.head.line = selectionRp.head.line + crlfs;
            selectionNew.head.ch = selectionRp.head.ch + mark.length;
            selectionNew.anchor.ch = selectionNew.head.ch + text.length;  
            selectionRps.push(selectionRp);
            selectionNews.push(selectionNew);  
            texts.push(mark + text);
            return listitem(selections, ++i, len, selectionRps, selectionNews, texts, crlfs + nnum);
        } else {
            return {
                selectionRps: selectionRps,
                selectionNews: selectionNews,
                texts: texts
            };
        }
    }

    function findRoundMark(mr, beforeText, afterText) {
        var i = 0,
            mark = '',
            beforeLen = beforeText.length,
            afterLen = afterText.length;

        while (i < beforeLen && i < afterLen) {
            if (beforeText.charAt(beforeLen - i - 1) !== '*' || 
                afterText.charAt(i) !== '*' || i++ === 3) {
                break;
            }
            mark += mr;
        }

        return mark;
    }

    function emphaFormat(str, roundmark) { 
    // 替换标记
        var text = str, nnum = 0, mark = '', content;
        if (roundmark === '***') {
            mark = '';
        } else if (roundmark === '**') {
            mark = '***';
        } else if (roundmark === '*') {
            mark = '**';
        } else { 
            mark = '*';
        } 
        if (wsx.test(text)) {
            text = 'Em';
        } else { 
            content = replaceCLRF(text);
            text = content.text.trim().replace(/\s{2,}/g, ' ');
            nnum = content.nnum;
        }
        return {
            text: text,
            mark: mark,
            nnum: nnum
        };
    }

    function empha(selections, i, len, selectionRps, selectionNews, texts, crlfs) {
        if (i >= 0 && i < len) {
            var selection = forward(selections[i].head, selections[i].anchor), 
                selectionRp = {
                    head: {
                        line: selection.start.line,
                        ch: selection.start.ch
                    },
                    anchor: {
                        line: selection.end.line,
                        ch: selection.end.ch
                    }
                }, 
                selectionNew = {
                    head: {
                        line: selectionRp.head.line,
                        ch: selectionRp.head.ch
                    },
                    anchor: {
                        line: selectionRp.anchor.line,
                        ch: selectionRp.anchor.ch
                    }
                },
                startLine = cmdoc.getLine(selectionRp.head.line),
                endLine = cmdoc.getLine(selectionRp.anchor.line),
                roundmark = findRoundMark('*', startLine.slice(0, selectionRp.head.ch), endLine.slice(selectionRp.anchor.ch, endLine.length)),
                roundmarkLen = roundmark.length,
                content = emphaFormat(cmdoc.getRange(selection.start, selection.end), roundmark),
                nnum = content.nnum, 
                text = content.text, 
                mark = content.mark,
                markLen = mark.length;      
            selectionRp.head.ch -= roundmarkLen;
            selectionRp.anchor.ch += roundmarkLen;
            selectionNew.anchor.line = selectionNew.head.line = selectionRp.head.line + crlfs;
            selectionNew.head.ch = selectionRp.head.ch + markLen;
            selectionNew.anchor.ch = selectionNew.head.ch + text.length; 
            selectionRps.push(selectionRp);
            selectionNews.push(selectionNew);   
            texts.push(mark + text + mark);
            return empha(selections, ++i, len, selectionRps, selectionNews, texts, crlfs + nnum);
        } else {
            return {
                selectionRps: selectionRps,
                selectionNews: selectionNews,
                texts: texts
            };
        }
    }

    function blockquoteFormat(str) {
        var nnum = 0, texts = [], textsLen, newRow;
        str.split('\n').forEach(function (row) {
            if (wsx.test(row)) {
                nnum -= 1;
            } else if (brx.test(row)) {
                newRow = RegExp.rightContext.trim().replace(/\s{2,}/, ' ');
                if (wsx.test(newRow)) {
                    nnum -= 1;
                } else {
                    texts.push(newRow);
                }
            } else if (btx.test(row)) {
                texts.push('>>> ' + RegExp.rightContext.trim().replace(/\s{2,}/, ' '));
            } else if (box.test(row)) {
                texts.push('>> ' + RegExp.rightContext.trim().replace(/\s{2,}/, ' '));
            } else {
                texts.push('> ' + row.trim().replace(/\s{2,}/, ' '));
            }
        });
        if (texts.length === 0) {
            texts.push('> Blockquote');
            nnum += 1;
        } 
        return {
            text: texts.join('\n'),
            nnum: nnum,
            llen: texts[texts.length - 1].length
        };
    }

    function blockquote(selections, i, len, selectionRps, selectionNews, texts, crlfs) {
        if (i >= 0 && i < len) {
            var selection = forward(selections[i].head, selections[i].anchor), 
                selectionRp = {
                    head: {
                        line: selection.start.line,
                        ch: 0
                    },
                    anchor: {
                        line: selection.end.line,
                        ch: cmdoc.getLine(selection.end.line).length
                    }
                }, 
                selectionNew = {
                    head: {
                        line: selectionRp.head.line,
                        ch: selectionRp.head.ch
                    },
                    anchor: {
                        line: selectionRp.anchor.line,
                        ch: selectionRp.anchor.ch
                    }
                },
                content = blockquoteFormat(cmdoc.getRange(selectionRp.head, selectionRp.anchor)), 
                text = content.text,
                nnum = content.nnum,
                llen = content.llen, 
                before = (selectionRp.head.line === 0 || wsx.test(cmdoc.getLine(selectionRp.head.line - 1))) ? '' : '\n',
                after = (selectionRp.anchor.line === (cmdoc.lineCount() - 1) || wsx.test(cmdoc.getLine(selectionRp.anchor.line + 1))) ? '' : '\n',
                beforeLen = before.length;
                afterLen = after.length; 
            selectionNew.head.line = selectionRp.head.line + crlfs + beforeLen;
            selectionNew.head.ch = 0;
            selectionNew.anchor.line = selectionRp.anchor.line + crlfs + beforeLen + nnum;
            selectionNew.anchor.ch = llen;
            selectionRps.push(selectionRp);
            selectionNews.push(selectionNew);   
            texts.push(before + text + after);
            return blockquote(selections, ++i, len, selectionRps, selectionNews, texts, crlfs + nnum + beforeLen + afterLen);
        } else {
            return {
                selectionRps: selectionRps,
                selectionNews: selectionNews,
                texts: texts
            };
        }
    }

    function code(selections, i, len, selectionRps, selectionNews, texts, crlfs) {
        if (i >= 0 && i < len) {
            var selection = forward(selections[i].head, selections[i].anchor), 
                selectionRp = {
                    head: {
                        line: selection.start.line,
                        ch: 0
                    },
                    anchor: {
                        line: selection.end.line,
                        ch: cmdoc.getLine(selection.end.line).length
                    }
                }, 
                selectionNew = {
                    head: {
                        line: selectionRp.head.line,
                        ch: selectionRp.head.ch
                    },
                    anchor: {
                        line: selectionRp.anchor.line,
                        ch: selectionRp.anchor.ch
                    }
                },
                nnum = 0, 
                text = cmdoc.getRange(selectionRp.head, selectionRp.anchor),
                llen = cmdoc.getLine(selectionRp.anchor.line).length,
                before, 
                after,
                beforeLen, 
                afterLen;     
            if (selectionRp.head.line > 0 && 
                cox.test(cmdoc.getLine(selectionRp.head.line - 1)) &&
                selectionRp.anchor.line < (cmdoc.lineCount() - 1) && 
                cox.test(cmdoc.getLine(selectionRp.anchor.line + 1))) {
                before = (selectionRp.head.line === 1 || wsx.test(cmdoc.getLine(selectionRp.head.line - 2))) ? '' : '\n';
                after = (selectionRp.anchor.line === (cmdoc.lineCount() - 2) || wsx.test(cmdoc.getLine(selectionRp.anchor.line + 2))) ? '' : '\n';
                beforeLen = before.length;
                afterLen = after.length;
                selectionRp.head.line -= 1;
                selectionRp.head.ch = 0;
                selectionRp.anchor.line += 1;
                selectionRp.anchor.ch = cmdoc.getLine(selectionRp.anchor.line).length;
                selectionNew.head.line = selectionRp.head.line + crlfs + beforeLen;
                selectionNew.head.ch = selectionRp.head.ch;
                selectionNew.anchor.line = selectionRp.anchor.line - 2 + crlfs + beforeLen;
                selectionNew.anchor.ch = llen;
                console.log(selectionRp.head.ch,
                            selectionRp.head.line, 
                            selectionRp.anchor.ch,
                            selectionRp.anchor.line,
                            selectionNew.head.ch, 
                            selectionNew.head.line,
                            selectionNew.anchor.ch,
                            selectionNew.anchor.line);
                nnum = -2;
            } else {
                before = (selectionRp.head.line === 0 || wsx.test(cmdoc.getLine(selectionRp.head.line - 1))) ? '' : '\n';
                after = (selectionRp.anchor.line === (cmdoc.lineCount() - 1) || wsx.test(cmdoc.getLine(selectionRp.anchor.line + 1))) ? '' : '\n';
                beforeLen = before.length;
                afterLen = after.length;
                selectionNew.head.line = selectionRp.head.line + 1 + beforeLen + crlfs;
                selectionNew.head.ch = 0;
                selectionNew.anchor.line = selectionRp.anchor.line + 1 + beforeLen + crlfs;
                selectionNew.anchor.ch = llen;
                nnum = 2;
                text = '```\n' + text + '\n```';
            } 
            selectionRps.push(selectionRp);
            selectionNews.push(selectionNew);   
            texts.push(before + text + after);
            return code(selections, ++i, len, selectionRps, selectionNews, texts, crlfs + nnum + beforeLen + afterLen);
        } else {
            return {
                selectionRps: selectionRps,
                selectionNews: selectionNews,
                texts: texts
            };
        }
    }

    function inblock(text) {
        return function walk(selections, i, len, selectionRps, selectionNews, texts, crlfs) {
            if (i >= 0 && i < len) {
                var selection = forward(selections[i].head, selections[i].anchor), 
                    selectionRp = {
                        head: {
                            line: selection.start.line,
                            ch: selection.start.ch
                        },
                        anchor: {
                            line: selection.end.line,
                            ch: selection.end.ch
                        }
                    }, 
                    selectionNew = {
                        head: {
                            line: selectionRp.head.line,
                            ch: selectionRp.head.ch
                        },
                        anchor: {
                            line: selectionRp.anchor.line,
                            ch: selectionRp.anchor.ch
                        }
                    },
                    nnum = totalCLRF(cmdoc.getRange(selectionRp.head, selectionRp.anchor)), 
                    startLine = cmdoc.getLine(selectionRp.head.line),
                    endLine = cmdoc.getLine(selectionRp.anchor.line),
                    before = wsx.test(startLine.slice(0, selectionRp.head.ch)) 
                                ? ((selectionRp.head.line === 0 || wsx.test(cmdoc.getLine(selectionRp.head.line - 1))) 
                                        ? '' 
                                        : '\n') 
                                : '\n\n', 
                    after = wsx.test(endLine.slice(selectionRp.anchor.ch, endLine.length)) 
                                ? ((selectionRp.anchor.line === (cmdoc.lineCount() - 1) || wsx.test(cmdoc.getLine(selectionRp.anchor.line + 1)))
                                        ? ''
                                        : '\n')
                                : '\n\n',
                    beforeLen = before.length, 
                    afterLen = after.length;
                selectionNew.anchor.line = selectionNew.head.line = selectionRp.head.line + crlfs + beforeLen;
                selectionNew.head.ch = text.length;
                selectionNew.anchor.ch = text.length; 
                selectionRps.push(selectionRp);
                selectionNews.push(selectionNew);   
                texts.push(before + text + after); 
                return walk(selections, ++i, len, selectionRps, selectionNews, texts, crlfs + nnum + beforeLen + afterLen);
            } else {
                return {
                    selectionRps: selectionRps,
                    selectionNews: selectionNews,
                    texts: texts
                };
            }
        };
    }

    function inner(text) {
        return function walk(selections, i, len, selectionRps, selectionNews, texts, crlfs) {
            if (i >= 0 && i < len) {
                var selection = forward(selections[i].head, selections[i].anchor), 
                    selectionRp = {
                        head: {
                            line: selection.start.line,
                            ch: selection.start.ch
                        },
                        anchor: {
                            line: selection.end.line,
                            ch: selection.end.ch
                        }
                    }, 
                    selectionNew = {
                        head: {
                            line: selectionRp.head.line,
                            ch: selectionRp.head.ch
                        },
                        anchor: {
                            line: selectionRp.anchor.line,
                            ch: selectionRp.anchor.ch
                        }
                    },
                    nnum = totalCLRF(cmdoc.getRange(selectionRp.head, selectionRp.anchor));
                selectionNew.anchor.line = selectionNew.head.line = selectionRp.head.line + crlfs;
                selectionNew.anchor.ch = selectionNew.head.ch + text.length; 
                selectionRps.push(selectionRp);
                selectionNews.push(selectionNew);   
                texts.push(text); 
                return walk(selections, ++i, len, selectionRps, selectionNews, texts, crlfs + nnum);
            } else {
                return {
                    selectionRps: selectionRps,
                    selectionNews: selectionNews,
                    texts: texts
                };
            }
        };
    }

    function bind(f) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return function () {
                f.apply(null, args);
            };
        }
    }

    function emitHead(cm, cmdoc) {
        var selections = cmdoc.listSelections(),
            options = head(selections, 0, selections.length, [], [], [], 0);
        cmdoc.setSelections(options.selectionRps);
        cmdoc.replaceSelections(options.texts, 'around');
        cmdoc.setSelections(options.selectionNews);
        cm.focus();
    }

    function onhead(cm, cmdoc) {
        return function (e) {
            emitHead(cm, cmdoc);
        };
    }

    function emitListitem(cm, cmdoc) {
        var selections = cmdoc.listSelections(),
            options = listitem(selections, 0, selections.length, [], [], [], 0);
        cmdoc.setSelections(options.selectionRps);
        cmdoc.replaceSelections(options.texts, 'around');
        cmdoc.setSelections(options.selectionNews);
        cm.focus();
    }

    function emitEmpha(cm, cmdoc) {
        var selections = cmdoc.listSelections(),
            options = empha(selections, 0, selections.length, [], [], [], 0);
        cmdoc.setSelections(options.selectionRps);
        cmdoc.replaceSelections(options.texts, 'around');
        cmdoc.setSelections(options.selectionNews);
        cm.focus();
    }

    function emitBlockquote(cm, cmdoc) {
        var selections = cmdoc.listSelections(),
            options = blockquote(selections, 0, selections.length, [], [], [], 0);
        cmdoc.setSelections(options.selectionRps);
        cmdoc.replaceSelections(options.texts, 'around');
        cmdoc.setSelections(options.selectionNews);
        cm.focus();
    }

    function emitCode(cm, cmdoc) {
        var selections = cmdoc.listSelections(),
            options = code(selections, 0, selections.length, [], [], [], 0);
        cmdoc.setSelections(options.selectionRps);
        cmdoc.replaceSelections(options.texts, 'around');
        cmdoc.setSelections(options.selectionNews);
        cm.focus();
    }

    function emitLine(cm, cmdoc) {
        var selections = cmdoc.listSelections(),
            options = inblock('---------')(selections, 0, selections.length, [], [], [], 0);
        cmdoc.setSelections(options.selectionRps);
        cmdoc.replaceSelections(options.texts, 'around');
        cmdoc.setSelections(options.selectionNews);
        cm.focus();
    }

    function emitBlock(cm, cmdoc, f) {
        var selections = cmdoc.listSelections(),
            options = inblock(String(f()))(selections, 0, selections.length, [], [], [], 0);
        cmdoc.setSelections(options.selectionRps);
        cmdoc.replaceSelections(options.texts, 'around');
        cmdoc.setSelections(options.selectionNews);
        cm.focus();
    }

    function emitInner(cm, doc, f) {
        var selections = cmdoc.listSelections(),
            options = inner(String(f()))(selections, 0, selections.length, [], [], [], 0);
        cmdoc.setSelections(options.selectionRps);
        cmdoc.replaceSelections(options.texts, 'around');
        cmdoc.setSelections(options.selectionNews);
        cm.focus();
    }

    function zoom(iw, ih, cw, ch) {
        var wz = iw / cw,
            hz = ih / ch,
            w = 0,
            h = 0;
        if (wz > 1) {
            if (hz > 1) {
                if (wz > hz) {
                    w = cw;
                    h = w * (ih / iw);
                } else {
                    h = ch;
                    w = h * (iw / ih);
                }
            } else {
                w = cw;
                h = w * (ih / iw);
            }
        } else {
            if (hz > 1) {
                h = ch;
                w = h * (iw / ih);
            } else {
                w = iw;
                h = ih;
            }
        }
        return {
            width: Math.floor(w),
            height: Math.floor(h)
        };
    }

    function css(elem/*, name, options*/) {
        var arg1 = arguments[1], arg2 = arguments[2], key;
        if (typeof arg1 === 'string') {
            if (typeof arg2 === 'string') {
                elem.style[arg1] = arg2;
            } else {
                return document.defaultView 
                            ? document.defaultView.getComputedStyle(elem, null)[arg1]
                            : elem.currentStyle[arg1];
            }
        } else if (typeof arg1 === 'object' && arg1 !== null) {
            for (key in arg1) {
                elem.style[key] = arg1[key]; 
            }
        } 
    }

    function uploader(config, f) {
        var elemOpen = config.elemOpen,
            elemIframe = config.elemIframe,
            elemLoading = config.elemLoading,
            elemForm = config.elemForm || this,
            elemFile = config.elemFile,
            isLoading = false;
        elemIframe.contentWindow.document.write('');
        elemIframe.contentWindow.document.close();  
        css(elemIframe, 'padding', '0px');
        if(elemLoading) {
            css(elemLoading, 'display', 'none');
        }
        elemOpen.addEventListener('click', function () { 
            elemFile.click();
        }, false);
        elemFile.addEventListener('change', function () { 
            if (!isLoading) {
                isLoading = true;
                if(elemLoading) {
                    css(elemLoading, 'display', 'block');
                }
                elemForm.submit();
            }
        }, false);
        elemIframe.addEventListener('load', function () { 
            if (!isLoading) { 
                return;
            } 
            var elemImg = elemIframe.contentWindow.document.querySelector('img'),
                cw = parseInt(css(elemIframe, 'width')),
                ch = parseInt(css(elemIframe, 'height')),
                size = zoom(elemImg.width, elemImg.height, cw - parseInt(2 * 2), ch - parseInt(2 * 2)),
                iw = size.width,
                ih = size.height,
                vw = Math.floor((cw - iw) / 2),
                hw = Math.floor((ch - ih) / 2); 
            if(elemLoading) {
                css(elemLoading, 'display', 'none');
            }
            css(elemImg, {
                display: 'block',
                position: 'absolute',
                top: hw + 'px',
                left: vw + 'px',
                width: iw + 'px',
                height: ih + 'px'
            });
            isLoading = false;
            if (typeof f === 'function') { 
                f(elemImg.src);
            }
        }, false);
    }

    function closer(config) {
        var elemOpen = config.elemOpen,
            elemClose = config.elemClose,
            elemContainer = config.elemContainer;  
        document.addEventListener('click', function (e) {
            if (elemOpen.contains(e.target)) {
                css(elemContainer, 'display', 'block');
            }
            if (config.touch) {
                if (!elemContainer.contains(e.target) &&
                    !elemOpen.contains(e.target)) {
                    css(elemContainer, 'display', 'none');
                }
            } else {
                if (elemClose.contains(e.target)) {
                    css(elemContainer, 'display', 'none');
                }
            }
        }, false); 
    }

    return {
        onhead: bind(emitHead),
        onlistitem: bind(emitListitem),
        onempha: bind(emitEmpha),
        onblockquote: bind(emitBlockquote),
        oncode: bind(emitCode),
        online: bind(emitLine),
        onblock: bind(emitBlock),
        oninner: bind(emitInner),
        head: emitHead,
        listitem: emitListitem,
        empha: emitEmpha,
        blockquote: emitBlockquote,
        code: emitCode,
        line: emitLine,
        block: emitBlock,
        inner: emitInner,
        uploader: uploader,
        closer: closer,
        css: css
    };
});