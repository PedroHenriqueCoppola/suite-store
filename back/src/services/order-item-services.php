<?php
include("../index.php");
include("category-services.php");

function getRightOrderItem($orderCode) {
    try {
        $stmt = myPDO->query("SELECT p.name AS prodname, o.price, o.amount, c.name AS catname, o.tax
                            FROM products p
                            INNER JOIN order_item o ON o.product_code = p.code 
                            INNER JOIN categories c ON p.category_code = c.code
                            WHERE o.order_code = '$orderCode'");
        $orderItens = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($orderItens);
    } catch(PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function getRightProducts($code) {
    try {
        $stmt = myPDO->query("SELECT * FROM products WHERE code = $code");
        $products = $stmt->fetch(PDO::FETCH_ASSOC);
        return $products;
    } catch(PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function createInsertInOrdemItem($order_code, $product_code, $order_amount) {
    try {
        $product = getRightProducts($product_code);
        $category = getRightCategory($product['category_code']);
        $stmt = myPDO->prepare("INSERT INTO order_item (order_code, product_code, amount, price, tax) VALUES (:order_code, :product_code, :amount, :price, :tax);");

        $stmt->bindParam(':order_code', $order_code);
        $stmt->bindParam(':product_code', $product_code);
        $stmt->bindParam(':amount', $order_amount);

        $finalPrice = $product['price'] * $order_amount;

        $stmt->bindParam(':price', $finalPrice);

        $convertedTax = floatval($category['tax'])/100;
        $finalTax = $finalPrice * $convertedTax;

        $stmt->bindParam(':tax', $finalTax);

        $stmt->execute();
        echo json_encode([
            'code' => myPDO->lastInsertId(), 
            'total' => 0, 
            'tax' => 0
        ]);
    } catch(PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function updateProductAmount($localAmount, $localId) {
    try {
        // diminui do estoque (products.amount) baseado (where) na ultima compra criada
        $stmt = myPDO->prepare("UPDATE products SET amount = amount - :localAmount WHERE code = :localId");
        $stmt->bindParam(':localAmount', $localAmount);
        $stmt->bindParam(':localId', $localId);
        $stmt->execute();
    } catch(PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}


// function updateProductAmount() {
//     try {
//         // diminui do estoque (products.amount) baseado (where) na ultima compra criada
//         $stmt = myPDO->prepare("SELECT p.amount - o.amount as newAmount
//                                 FROM products p
//                                 INNER JOIN order_item o ON p.code = o.product_code
//                                 WHERE o.order_code = (SELECT code FROM orders ORDER BY code DESC limit 1)");
//         // for(i=0; i<)
//         $stmt->execute();
//     } catch(PDOException $e) {
//         echo json_encode(['error' => $e->getMessage()]);
//     }
// }
