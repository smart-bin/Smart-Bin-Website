function initWebsite() {
}

function getUserId() {
    if (typeof localStorage.userId == "undefined") return 2;
    else return localStorage.userId;
}

function toggleSubmenu() {
    var menu = $(this).find(".has-submenu");
    $("#"+ menu.attr("for")).toggleClass("hidden");
}
