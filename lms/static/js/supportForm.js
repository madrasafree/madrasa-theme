$(function() {

// variables
    let amount;
    let isMonthly = true;

// functions
// set iframe data and show iframe
    function setIframeData() {
        $("#empty-fields-msg").hide();
        $("#custom-amount-section").hide();
        let json = createJson(isMonthly, amount);
        setUrl(json);
        showIframe();
    }//setIframeData


//show the iframe and hide the amount and the arrow
    function showIframe() {
        $("#paying-iframe").show();
        $("#back-arrow").show();
        $("#amount").hide();
    }//showIframe


//Creating purchese object
    function createJson(isMonthly, amount) {
        const object = {};
        object["Item"] = {
            "CatalogNumber": "1",
            "Quantity": 1,
            "Description": "תמיכה חד פעמית במדרסה"
        };
        if (isMonthly) {
            object["CreateRecurringSale"] = true;
            object["Item"].Description = "תמיכה חודשית במדרסה (הוראת קבע)";
        }
        object["Item"].UnitPrice = amount;
        return object;
    }//createJson


//set iframe url from the server by the purchese object
    function setUrl(json) {
        $.post("/madrasafree/icredit_get_url/", json, function (response) {
            $("#paying-iframe iframe").attr('src', response);
        });
    }//setUrl

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
        $('html, body').animate({
            scrollTop: $("#amount").offset().top,
        }, 600);
        if ($("input[type=radio]").prop("required")) {

            $("input[type=radio]").prop("required", false);
        } else {
            $("input[type=radio]").prop("required", true);
        }
    }//toggleSupportAmounts

    function backToAmounts() {
        amount = 0;
        $("#back-arrow").hide();
        $("#amount").show();
        $("#paying-iframe").hide();
        $("#paying-iframe iframe").attr('src', "");
        $("#custom-amount-section").hide();
        $("#empty-fields-msg").hide();
    }//backToAmounts

    const loginRegisterContainer = $('.support-container');

    loginRegisterContainer.on('click', '#custom-amount-button', function (e) {
        e.preventDefault();
    });

    loginRegisterContainer.on('click', '.custom-amount input', function () {
        $("#custom-amount-section").show();
    });

    loginRegisterContainer.on('click', '#support-check', toggleSupportAmounts);

    loginRegisterContainer.on('click', '#back-arrow', backToAmounts);

    loginRegisterContainer.on('click', '.fixed-amount input', function () {
        amount = $('input[name=amount]:checked').val();
        isMonthly = true;
        setIframeData();
    });

    loginRegisterContainer.on('click', '#custom-amount-button', function () {
        amount = $("#custom-amount").val();
        if ($('input[name=amount]:checked').val() == "one-time") isMonthly = false;
        setIframeData();
    });
});
