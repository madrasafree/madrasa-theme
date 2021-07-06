const getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};

const showCurrentState = function () {
    if (getUrlParameter('payment') === '1' && localStorage.getItem('donateURL')) {
        const donateURL = localStorage.getItem('donateURL');
        $('.window-wrap').html('<div id="paying-iframe">' +
            ' <a href="/madrasafree/donate/" class="button">חזור</a>' +
            ' <iframe width="100%" height="100%" src="' + donateURL + '"></iframe>' +
            '</div>');
    } else {
        history.replaceState({payment: '0'}, document.title, '/madrasafree/donate/');
        if (localStorage.getItem('donateURL')) {
            localStorage.removeItem('donateURL');
            window.location.reload();
        }
    }
}

window.onpopstate = function (event) {
    showCurrentState();
}

window.onload = function () {
    showCurrentState();
}


$(function () {
    // variables
    let amount = 15;
    let isMonthly = true;
    $("#monthly option[value=1]").prop("selected", true);


    // functions
    // set iframe data and show iframe
    function setIframeData() {
        $("#empty-fields-msg").hide();
        let json = createJson(isMonthly, amount);
        setUrl(json);
    } //setIframeData
    window.setIframeData = setIframeData;

    //Creating purchese object
    function createJson(isMonthly, amount) {
        const object = {};
        object["Item"] = {
            CatalogNumber: "1",
            Quantity: 1,
            Description: "תמיכה חד פעמית במדרסה",
        };
        if (isMonthly) {
            object["CreateRecurringSale"] = true;
            object["Item"].Description = "תמיכה חודשית במדרסה (הוראת קבע)";
        }
        object["Item"].UnitPrice = amount;
        return object;
    } //createJson

    //set url from the server by the purchese object
    function setUrl(json) {
        if (amount > 0) {
            $.post("/madrasafree/icredit_get_url/", json, function (response) {
                if (history.pushState) {
                    localStorage.setItem('donateURL', response);
                    history.pushState({payment: '1'}, document.title, '/madrasafree/donate/?payment=1');
                }
                showCurrentState();
            });
        } else {
            $("#error").show().delay(1200).fadeOut(800);
        }
    } //setUrl

    //set custom amount
    function toggleSupportAmounts() {
        if ($(this).prop("checked")) {
            $("#support").show();
            $("#amount").show();
            $("#custom-amount-section").hide();
        } else {
            $("#support").hide();
            $("#paying-iframe").hide();
            $("#back-arrow").hide();
        }
        $("html, body").animate(
            {
                scrollTop: $("#amount").offset().top,
            },
            600
        );
        if ($("input[type=radio]").prop("required")) {
            $("input[type=radio]").prop("required", false);
        } else {
            $("input[type=radio]").prop("required", true);
        }
    } //toggleSupportAmounts

    const loginRegisterContainer = $(".support-container");

    loginRegisterContainer.on("click", "#custom-amount-button", function (e) {
        e.preventDefault();
    });

    loginRegisterContainer.on("change", "#monthly", function (e) {
        isMonthly = Boolean(e.target.value === "1");
        if (!isMonthly) {
            $("#amount").hide();
            $("#custom-amount-section").show();
            $("#custom-amount").val("");
            amount = 0;
        } else {
            $("#amount").show();
            if ($("#amount :checked").val() !== "custom") {
                $("#custom-amount-section").hide();
            }
            amount = $("#amount :checked").val();
        }
    });

    loginRegisterContainer.on("click", "#support-check", toggleSupportAmounts);

    loginRegisterContainer.on("change", "[name=amount]", function () {
        $("#custom-amount-section").hide();
        $(".select-amount").removeClass("selected");
        $(this).parent(".select-amount").addClass("selected");

        if ($("input[name=amount]:checked").val() !== "custom") {
            amount = $(this).val();
        } else {
            $("#custom-amount-section").show();
            amount = 0;
            $("#custom-amount").val("");
        }
    });

    loginRegisterContainer.on("input", "#custom-amount", function () {
        amount = $("#custom-amount").val();
    });
});
