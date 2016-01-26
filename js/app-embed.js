function initAppEmbed() {
    $("#submit-new-user").on("click", createUser);
    $("#refresh-bin-list").on("click", getBins);
    getUser();
    getBins();
    toggleMobile();
    $(window).on("resize", toggleMobile);
}

function createUser() {
    var button = $(this);
    if (typeof button.attr("disabled") === typeof undefined) {
        button.attr("disabled", "disabled");
        var name = $("#new-user-name").val();
        if (name != "") {
            $.ajax({
                url: "http://ianwensink.nl/dev/hr/internetfornature/getCountSanboxAccounts.php",
                success: function (count) {
                    var email = "trial" + (parseInt(count) + 1) + "@projectsmartbin.com";
                    API.registerNewUser(name, email, "admin", function (user) {
                        $.ajax({
                            url: "http://ianwensink.nl/dev/hr/internetfornature/insertNewSandboxUser.php",
                            method: "post",
                            data: {
                                name: name,
                                email: email,
                                userId: user.UserId
                            },
                            success: function () {
                                localStorage.userId = user.UserId;
                                $("iframe").attr("src", "http://project.hosted.hr.nl/2015_2016/mtnll_mt2b_t3/Website/setNewUserId.php?id=" + user.UserId);
                                button.removeAttr("disabled");
                                getUser();
                                getBins();
                            }
                        });
                    });
                }
            });
        }
        else {
            button.removeAttr("disabled");
            $("#new-user-name").focus();
        }
    }
}

function getUser() {
    API.getUser(getUserId(), "info", printUser);
}

function printUser(user) {
    $("#current-user #user-name").text(user.Name);
    $("#current-user #user-email").text(user.Email);
}

function getBins() {
    if (getUserId() != 2) {
        API.getUser(getUserId(), "bins", formatBins);
        $("#add-user-first-text").addClass("hidden");
    }
}

function formatBins(bins) {
    var binForms = "";
    $.each(bins.Bins, function () {
        binForms += "<form class=\"update-weight-form\" action=\"\">" +
                        "<div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">" +
                            "<input class=\"mdl-textfield__input\" type=\"number\" id=\"bin-" + this.BinId + "\">" +
                            "<label class=\"mdl-textfield__label\" for=\"bin-" + this.BinId + "\">" + this.Name + "</label>" +
                        "</div>" +
                        "<button data-bin-id=\"" + this.BinId + "\" type=\"button\" class=\"mdl-button mdl-js-button mdl-button--primary mdl-js-ripple-effect mdl-button--raised submit-bin-weight\">Voeg toe</button>" +
                    "</form>";
    });
    var currentBins = $(".update-weight-form");
    if (currentBins.length > 0) currentBins.fadeTo(300, 0, function () {
        printBins(binForms, bins);
    });
    else printBins(binForms, bins);
}

function printBins(binForms, bins) {
    $(".update-weight-form").remove();
    $("#update-weight-controls").append(binForms);
    $(".submit-bin-weight").on("click", updateBinWeight);
    if (bins.Bins.length > 0) $("#no-bins-text").addClass("hidden");
    else $("#no-bins-text").removeClass("hidden");
    componentHandler.upgradeAllRegistered();
}

function updateBinWeight() {
    var button = $(this);
    var binId = button.attr("data-bin-id");
    var input = button.siblings("div").find("input");
    if (input.val() != "") {
        API.editWeight(binId, input.val(), "45f17b19ad5527e8bd6a0b749bf412ac", function (o) {
            input.val("");
            $("iframe").attr("src", $("iframe").contents().get(0).location.href);
            $(".is-dirty").removeClass("is-dirty");
            componentHandler.upgradeAllRegistered();
        });
    }
}

function toggleMobile() {
    if (checkIfMobile()) {
        $("#phone-embed #phone-frame-container").addClass("hidden");
        $("#phone-embed #no-phone-container").removeClass("hidden");
    } else {
        $("#phone-embed #phone-frame-container").removeClass("hidden");
        $("#phone-embed #no-phone-container").addClass("hidden");
    }
}
