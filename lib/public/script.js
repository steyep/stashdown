$(document).ready(function() {
    $('#save').click(function() {
        var data = {};
        data.md = document.getElementById('pad').value;
        $.ajax({
            type: 'POST',
            async: true,
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/'
        });
    });

    $('#close').click(function() {
        $.ajax({
            type: 'GET',
            async: true,
            url: '/close',
            success: function(res) {
                console.log('success!');
            }
        });
    });
});

window.onload = function() {
    var converter = new showdown.Converter();
    var pad = document.getElementById('pad');
    var markdownArea = document.getElementById('markdown');   

    // make the tab act like a tab
    pad.addEventListener('keydown',function(e) {
        if(e.keyCode === 9) { // tab was pressed
            // get caret position/selection
            var start = this.selectionStart;
            var end = this.selectionEnd;

            var target = e.target;
            var value = target.value;

            // set textarea value to: text before caret + tab + text after caret
            target.value = value.substring(0, start)
                            + "\t"
                            + value.substring(end);

            // put caret at right position again (add one for the tab)
            this.selectionStart = this.selectionEnd = start + 1;

            // prevent the focus lose
            e.preventDefault();
        }
    });

    var convertTextAreaToMarkdown = function(){
        var markdownText = pad.value;
        html = converter.makeHtml(markdownText)
            .replace(/~~([^~]+)~~/g,'<strike>$1</strike>')

        markdownArea.innerHTML = html;
    };

    pad.addEventListener('input', convertTextAreaToMarkdown);

    convertTextAreaToMarkdown();
};