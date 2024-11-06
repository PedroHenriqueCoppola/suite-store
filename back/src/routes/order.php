<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, PUT");

include("../services/order-services.php");

function executeEndPoints() {
    $method = $_SERVER['REQUEST_METHOD'];

    switch ($method) {
        case 'GET':
            return getOrders();
            break;

        case 'POST':
            $json = file_get_contents('php://input');
            $data = json_decode($json, true);
            $day = $data['day'];
            createOrderLine($day);
            break;
        
        case 'PUT':
            $json = file_get_contents('php://input');
            $data = json_decode($json, true);
            
            $code = $data["code"];
            $tax = $data['tax'];
            $total = $data['total'];
            updateTaxAndPrice($code, $tax, $total);
            break;
    }
}

executeEndPoints();