<?php
include("../index.php");

function getFullOrders() {
    try {
        $stmt = myPDO->query('SELECT * FROM orders');
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($orders);
    } catch(PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}