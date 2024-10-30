<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE");
include("../services/product-services.php");

function executeEndPoints() {
    $method = $_SERVER['REQUEST_METHOD'];

    switch ($method) {
        case 'GET':
            echo getProducts();
            break;

        case 'POST':
            // $name = filter_input(INPUT_POST, 'prodName', FILTER_SANITIZE_SPECIAL_CHARS);
            // $amount = filter_input(INPUT_POST, 'prodAmount', FILTER_SANITIZE_NUMBER_INT);
            // $price = filter_input(INPUT_POST, 'prodPrice', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
            // $category_code = filter_input(INPUT_POST, 'categoryCode', FILTER_SANITIZE_NUMBER_INT);
            $name = $_POST['product'];
            $amount = $_POST['amount'];
            $price = $_POST['price'];
            $category_code = $_POST['category'];
            addProduct($name, $amount, $price, $category_code);
            break;

        case 'DELETE':
            $code = $_GET["code"];
            deleteProduct($code);
            break;
    }
}

executeEndPoints();