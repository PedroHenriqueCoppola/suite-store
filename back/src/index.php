<?php

// declaração pro banco
$host = "pgsql_desafio";
$db = "applicationphp";
$user = "root";
$pw = "root";

// conexão com o banco de dados
try {
    if (!defined('myPDO'))
    define("myPDO", new PDO("pgsql:host=$host;dbname=$db", $user, $pw));
} catch(PDOException $e) {
    echo 'Erro na conexão com o banco de dados: ' . $e->getMessage();
    exit;
}