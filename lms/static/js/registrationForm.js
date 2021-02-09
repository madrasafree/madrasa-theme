// variables
let amount;
let fname = "";
let lname = "";
let email = "";
let json = {};
let isMonthly = true;

//hiding elements
$("#paying-iframe").hide();

// functions
// set iframe data and show iframe
function setIframeData() {
    $("#empty-fields-msg").hide();
    if (checkFormInput()) {
        $("#custom-amount-section").hide();
        let json = {};
        email = $("#register-email").val();
        // fname = $("#register-name").val();
        // lname = $("#lname").val();
        json = createJson(isMonthly, '', '', email, amount);
        setUrl(json);
        showIframe();
        //$("#supporter-details").html(`שם פרטי: ${fname}<br>שם משפחה:${lname}<br>אימייל: ${email}`);
    } else {
        $("#empty-fields-msg").show();
    }
}//setIframeData


//show the iframe and hide the amount and the arrow
function showIframe() {
    $("#paying-iframe").show();
    $("#back-arrow").show();
    $("#amount").hide();
}//showIframe


//Creating purchese object
function createJson(isMonthly, fname, lname, email, amount) {
    const object = {};
    object["Item"] = {
        "CatalogNumber": "29",
        "Quantity": 1,
        "Description": "תמיכה חד פעמית במדרסה"
    };
    if (isMonthly) {
        object["SaleType"] = 2;
        object["CreateRecurringSale"] = true;
        object["RecurringSaleCycle"] = 3;
        object["RecurringSaleDay"] = 10;
        object["RecurringSaleStep"] = 1;
        object["RecurringSaleCount"] = 6;
        object["RecurringSaleAutoCharge"] = true;
        object["Item"].Description = "תמיכה חודשית במדרסה (הוראת קבע)";
    }
    object["EmailAddress"] = email;
    object["CustomerFirstName"] = fname;
    object["CustomerLastName"] = lname;
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

function checkFormInput() {
    email = $("#email").val();
    fname = $("#fname").val();
    lname = $("#lname").val();
    if (email === "" || fname === "" || lname === "") {
        return false;
    } else {
        return true;
    }
}//checkFormInput


const loginRegisterContainer = $('.login-register-content');

loginRegisterContainer.on('submit', '.register-form', function (e) {
    e.preventDefault();
});

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
    console.log(amount);
    setIframeData();
});

loginRegisterContainer.on('click', '#custom-amount-button', function () {
    amount = $("#custom-amount").val();
    if ($('input[name=amount]:checked').val() == "one-time") isMonthly = false;
    setIframeData();
});
