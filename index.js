$(document).ready(function () {
    function validateX() {
        const X_min = -3;
        const X_max = 3;
        let X_value = $("#x-values").val().replace(",", ".");
        if (X_value === "") {
            printError("X can't be empty");
            return false;
        }
        if (isNaN(X_value)) {
            printError("X must be number");
            return false;
        }
        if (X_value < X_min || X_value > X_max) {
            printError("X in (-3; 3)");
            return false;
        }
        return X_value;
    }

    function validateY() {
        let Y_value = $('#y-values').val()
        if (Y_value === '10') {
            printError("Y can't be empty");
            return false
        }
        return Y_value;
    }

    function validateR() {
        let checkbox = $(':checkbox')
        let count = 0;
        let R_value = []
        for (let i = 0; i < checkbox.length; i++) {
            if (checkbox[i].checked === true) {
                count++;
                R_value.push(checkbox[i].value)
            }
        }
        if (count > 0) {
            return R_value;
        } else {
            printError("R can't be empty");
            return false;
        }
    }

    function validateForm() {
        let errors = document.getElementById('errors')
        while (errors.firstChild) {
            errors.removeChild(errors.firstChild)
        }
        let val1 = validateX();
        let val2 = validateY();
        let val3 = validateR();
        if (!(val1 === false) && !(val2 === false) && !(val3 === false)) {
            return {x: val1, y: val2, r: val3};
        } else {
            return false;
        }
    }

//document.getElementById('submit').addEventListener("click", async function (event) {
    $("#submit").on('click', async function (event) {
        event.preventDefault();
        let coord = validateForm();
        if (!coord) {
            return false;
        }
        const result = await connect(coord);
        let table = $("result-table")
        for (let i in result.response){
            if (result.response[i].valid) {
                let newRow = '<tr>';
                newRow += '<td>' + result.response[i].x + '</td>';
                newRow += '<td>' + result.response[i].y + '</td>';
                newRow += '<td>' + result.response[i].r + '</td>';
                newRow += '<td>' + result.response[i].curtime + '</td>';
                newRow += '<td>' + result.response[i].scripttime + '</td>';
                newRow += '<td>' + result.response[i].check + '</td>';
                $('#result-table').append(newRow);
            }
        }
    })

    $("#reset").on('click', function (event) {
        event.preventDefault();
        document.getElementById("x-values").value = ""
        document.getElementById("y-values").value = "10"
        $(":checkbox").prop("checked", false)
        let table = document.getElementById("result-table")
        while(table.rows.length > 1){
            table.deleteRow(-1);
        }
        console.log("Deleted")
    })

    async function connect(coord) {
        let form = new FormData();
        for (let key in coord) {
            form.append(key, coord[key]);
        }
        const resp = await fetch("main.php", {
            method: "POST",
            body: form
        })
        if (resp.ok) {
            console.log("Submitted");
            let text = await resp.text();
            console.log(text);
            return JSON.parse(text);
        } else {
            return JSON.parse('{"error":"'+resp.status+': '+resp.statusText+'"}')
        }
    }

    function printError(s) {
        let error = document.createElement("p");
        error.textContent = s;
        $("#errors").append(error);
    }
})
