'use strict'

var projects = {};
var logs = {};
var timerUpdateLog = null;

var api = {
    get: function (url, success) {
        $.ajax({
            url: url,
            success: success,
            dataType: 'json',
            cache: false
        });
    },
    post: function (url, data, success) {
        $.ajax({
            method: 'POST',
            url: url,
            data: data,
            success: success,
            dataType: 'json',
            cache: false
        });
    }
};

/*
function updateLog(project, logname) {
    var url = '/api/' + project + '/' + logname + '/logs';
    api.get(url, function (data, status) {
        logs = data;
        var tableHTML = '';
        for (var i = 0; i<logs.length; i++) {
            tableHTML += '<tr><td>' + (logs.length - i) + '</td><td>' + logs[i] + '</td></tr>';
        }
        $('#table-log > tbody').html(tableHTML);
    });
    timerUpdateLog = setTimeout(function() {updateLog(project, logname);}, 1000);
}

function renderProjectsPanel(projects) {
    var menu = $('#side-menu');

    // generate html code for projects panel
    var projectsHTML = $('#side-menu > li.sidebar-search')[0].outerHTML;
    for (var project in projects) {
        var html = '<li>';
        html += '<a><i class="fa fa-fw"></i>' + project + '<span class="fa arrow"></span></a>';
        html += '<ul class="nav nav-second-level">';
        var lognames = projects[project];
        for (var i=0; i<lognames.length; i++) {
            var logname = lognames[i];
            html += '<li><a>' + logname + '</a></li>';
        }
        html += '</ul>'
        html += '</li>'

        projectsHTML += html;
    }
    
    // render the html code and bind events callbacks
    menu.html(projectsHTML);
    menu.metisMenu();
    $('#side-menu > li > ul > li > a').click(function() {
        $('#side-menu > li > ul > li').attr('class', '');
        $(this).parent().attr('class', 'active');
        clearTimeout(timerUpdateLog);
        var project = $(this).parent().parent().prev().text();
        var logname = $(this).text();
        updateLog(project, logname);
    });
}

$(document).ready(function(){
    api.get('/api/projects', function (data, status) {
        projects = data;
        renderProjectsPanel(projects);
    });
});

*/