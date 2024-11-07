<?php
include("../index.php");

function getCategories() {
    try {
        $stmt = myPDO->query('SELECT * FROM categories');
        $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($categories);
    } catch(PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function getRightCategory($code) {
    try {
        $stmt = myPDO->query("SELECT * FROM categories WHERE code = $code");
        $categories = $stmt->fetch(PDO::FETCH_ASSOC);
        return $categories;
    } catch(PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function addCategory($name, $tax) {
    try {
        $stmt = myPDO->prepare('INSERT INTO categories (name, tax) VALUES (:name, :tax)');
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':tax', $tax);
        $stmt->execute();
    } catch(PDOException $e) {
        http_response_code(401);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function deleteCategory($catCode) {
    try {
        $stmt = myPDO->prepare('DELETE FROM categories WHERE code = :code');
        $stmt->bindParam(':code', $catCode);
        $stmt->execute();
    } catch(PDOException $e) {
        http_response_code(401);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
