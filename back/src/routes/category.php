<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE");
include("../services/category-services.php");

function executeEndPoints() {
    $method = $_SERVER['REQUEST_METHOD'];

    switch ($method) {
        case 'GET':
            echo getCategories();
            break;

        case 'POST':
            // $name = filter_input(INPUT_POST, 'catName', FILTER_SANITIZE_SPECIAL_CHARS);
            // $tax = filter_input(INPUT_POST, 'catTax', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
            $name = $_POST['rightName'];
            $tax = $_POST['rightTax'];
            addCategory($name, $tax);
            break;

        case 'DELETE':
            $code = $_GET["code"];
            deleteCategory($code);
            break;
    }
}

executeEndPoints();