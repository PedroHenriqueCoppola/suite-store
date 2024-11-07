<?php
include("../index.php");

function getProducts() {
    try {
        $stmt = myPDO->query('SELECT p.code, p.name, p.amount, p.price, p.category_code, c.name as catName
                              FROM products p
                              INNER JOIN categories c ON p.category_code = c.code');
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($products);
    } catch(PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function addProduct($name, $amount, $price, $category_code) {
    try {
        $stmt = myPDO->prepare('INSERT INTO products (name, amount, price, category_code) VALUES (:name, :amount, :price, :category_code)');
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':amount', $amount);
        $stmt->bindParam(':price', $price);
        $stmt->bindParam(':category_code', $category_code);
        $stmt->execute();
    } catch(PDOException $e) {
        http_response_code(401);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function deleteProduct($prodCode) {
    try {
        $stmt = myPDO->prepare('DELETE FROM products WHERE code = :code');
        $stmt->bindParam(':code', $prodCode);
        $stmt->execute();
    } catch(PDOException $e) {
        http_response_code(401);
        echo json_encode(['error' => $e->getMessage()]);
    }
}