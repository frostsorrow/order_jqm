<?php
    header('Content-Type: application/json');
    //接收数据
    @$did = $_REQUEST['did'];
    if( !isset($did) ){
        echo '{}';
        return;
    };
    $conn = mysqli_connect('127.0.0.1','root','','kaifanla');
    $sql="SET NAMES UTF8";
    mysqli_query($conn,$sql);
    $sql="SELECT did,name,price,material,img_lg,detail FROM kf_dish WHERE did=$did";
    $result = mysqli_query($conn, $sql);

    $row=mysqli_fetch_assoc($result);

    //向客户端输出响应消息主体
    $jsonString = json_encode($row);
    echo $jsonString;
?>