<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, PUT");
include("../services/order-item-services.php");

// error_log(print_r('oi'));
// error_log(print_r($orderCode, true));
function executeEndPoints() {
    $method = $_SERVER['REQUEST_METHOD'];
    switch ($method) {
        case 'GET':
            $orderCode = $_GET['code'];
            error_log(print_r($orderCode, true));
            return getRightOrderItem($orderCode);
            break;
            
        case 'POST':
            $json = file_get_contents('php://input');
            
            $data = json_decode($json, true);
            $order_code = $data['code'];
            $product_code = $data['prodCode'];
            $order_amount = $data['amount'];
                
            createInsertInOrdemItem($order_code, $product_code, $order_amount);
            break;

        case 'PUT': // decrementar do banco 
            $json = file_get_contents('php://input');
            $stock = json_decode($json, true);
            error_log(print_r($stock, true));
            
            $amount = $stock['amount'];
            error_log(print_r($amount, true));
            $id = $stock["id"];
            error_log(print_r($id, true));
            updateProductAmount($amount, $id);
            break;
    }
}

executeEndPoints();