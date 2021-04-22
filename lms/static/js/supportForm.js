$(function() {

// variables
    let amount = $('input[name=amount]:checked').val() || 40;
    let isMonthly = true;

    $('.select-amount').click(function (e) {
        $('#custom-amount-section').hide();
        $('.select-amount').removeClass('selected');
        $(this).addClass('selected');
    });

// functions
// set iframe data and show iframe
    function setIframeData() {
        $("#empty-fields-msg").hide();
        $("#custom-amount-section").hide();
        let json = createJson(isMonthly, amount);
        setUrl(json);
    }//setIframeData
    window.setIframeData = setIframeData;

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

    const loginRegisterContainer = $('.support-container');

    loginRegisterContainer.on('click', '#custom-amount-button', function (e) {
        e.preventDefault();
    });

    loginRegisterContainer.on('change', '#monthly', function (e) {
        isMonthly = Boolean(e.target.value === '1');
        setIframeData();
    });

    loginRegisterContainer.on('click', '#support-check', toggleSupportAmounts);

    loginRegisterContainer.on('click', '.select-amount', function () {
        amount = $('input[name=amount]:checked').val();
        isMonthly = true;
        setIframeData();
    });

    loginRegisterContainer.on('click', '.custom-amount', function () {
        $("#custom-amount-section").show();
    });

    loginRegisterContainer.on('click', '#custom-amount-button', function () {
        amount = $("#custom-amount").val();
        if ($('input[name=amount]:checked').val() == "one-time") isMonthly = false;
        setIframeData();
    });
});
