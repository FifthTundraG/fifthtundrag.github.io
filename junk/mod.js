core.cookieClicked = function() {
    core.cookies += 1000;
    core.cookieBeenClickedTimes += 1;
    core.totalCookies += 1000;
    helper.reloadCookieCounter();
}