<?php
include("../index.php");

function getProducts() {
    try {
        $stmt = myPDO->query('SELECT * FROM products');
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
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function deleteProduct($prodCode) {
    try {
        $stmt = myPDO->prepare('DELETE FROM products WHERE code = :code');
        $stmt->bindParam(':code', $prodCode);
        $stmt->execute();
    } catch(PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}