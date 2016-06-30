'use strict'

var projects = {};
var logs = {};
var timerUpdateLog = null;

function updateLog(project, logname) {
    $.get('/' + project + '/' + logname + '/logs', function (data, status) {
        logs = typeof(data) === 'string' ? JSON.parse(data) : data;
        var table = $('#table-log > tbody');
        var tableHTML = '';
        for (var i = 0; i<logs.length; i++) {
            tableHTML += '<tr><td>' + i + '</td><td>' + logs[i] + '</td></tr>';
        }
        table.html(tableHTML);
    });
    timerUpdateLog = setTimeout(function() {updateLog(project, logname)}, 1000);
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
        $(this).parent().siblings().attr('class', '');
        $(this).parent().attr('class', 'active');
        clearTimeout(timerUpdateLog);
        var project = $(this).parent().parent().prev().text();
        var logname = $(this).text();
        updateLog(project, logname);
    });
}

$(document).ready(function(){
    $.get('/projects', function (data, status) {
        projects = typeof(data) === 'string' ? JSON.parse(data) : data;
        renderProjectsPanel(projects);
    });

});

