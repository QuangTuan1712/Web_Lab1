<?php
session_start();
if (!isset($_SESSION['Data'])) {
    $_SESSION['Data'] = array();
}

function validX($x) {
    $x_min = -3;
    $x_max = 3;
    if (!isset($x)) return false;
    $numX = str_replace(',','.',$x);
    return is_numeric($numX) && $numX >= $x_min && $numX <= $x_max;
}

if (!$_SERVER["REQUEST_METHOD"] == "POST") {
    echo '{' . "\"response\":[" . "request method is not allowed" . ']}';
} else {
    $resp = '';
    $x = $_POST['x'];
    $y = $_POST['y'];
    $r_str = str_replace(',','',$_POST['r']);
    $r_arr = str_split($r_str);
    foreach ($r_arr as $r) {
        $r = (int) $r;
        $timezoneOffset = $_GET['timezone'];
        $isValid = isset($y) && is_numeric($y) && isset($r) && is_numeric($r) && validX($x);

        if (!$isValid) $jsData = "{}";
        else {
            $currentTime = date("H:i:s", time() - $timezoneOffset * 60);
            $scriptTime = round(microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'], 7);
            $checkTriangle = $x <= 0 && $y >= 0 && $y <= ($x / 2 + $r / 2);
            $checkRectangle = $y >= 0 && $x >= 0 && $y <= $r / 2 && $x <= $r;
            $checkCircle = $x <= 0 && $y <= 0 && sqrt($x * $x + $y * $y) <= $r / 2;
            $result = (($checkTriangle || $checkCircle || $checkRectangle)) ? 'true' : 'false';
            $jsData = '{' .
                "\"valid\":true," .
                "\"x\":$x," .
                "\"y\":$y," .
                "\"r\":$r," .
                "\"curtime\":\"$currentTime\"," .
                "\"scripttime\":\"$scriptTime\"," .
                "\"check\":$result" .
                "}";
        }
        array_push($_SESSION['Data'], $jsData);
        $resp = $resp . $jsData . ',';
    }
    $resp = substr($resp, 0, -1);
    echo '{' . "\"response\":[" . $resp . ']}';
}