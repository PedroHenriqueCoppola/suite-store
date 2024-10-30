<?php
include("../index.php");

function getOrders() {
    try {
        $stmt = myPDO->query('SELECT * FROM orders ORDER BY code DESC');
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($orders);
    } catch(PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function createOrderLine() {
    try {
        $stmt = myPDO->prepare('INSERT INTO orders (total, tax) VALUES (0, 0);');
        $stmt->execute();

        $code = myPDO->lastInsertId();
        
        echo json_encode([
            'code' => $code, 
            'total' => 0, 
            'tax' => 0
        ]);
    } catch(PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function updateTaxAndPrice($code, $tax, $total) {
    try {
        $stmt = myPDO->prepare("UPDATE orders SET tax = :tax, total = :total WHERE code = :code;"); // O ERRO TA AQUI
        $stmt->bindParam(':code', $code);
        $stmt->bindParam(':tax', $tax);
        $stmt->bindParam(':total', $total);
        $stmt->execute();
    } catch(PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}