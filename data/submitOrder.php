<?php
    header('Content-Type: application/json');
    //接收数据
    $user_name = $_REQUEST['user_name'];
    $sex = $_REQUEST['sex'];
    $phone = $_REQUEST['phone'];
    $addr = $_REQUEST['addr'];
    $did = $_REQUEST['did'];
    $order_time = time()*1000;
    if(!isset($sex)||!isset($user_name)||!isset($sex)||!isset($phone)||!isset($addr)||!isset($did)){
        echo 'params are not enough';
        return;
    }
    $conn = mysqli_connect('127.0.0.1','root','','kaifanla');
    $sql="SET NAMES UTF8";
    mysqli_query($conn,$sql);
    $sql="INSERT INTO kf_order(oid,user_name,sex,phone,addr,did,order_time) VALUES (NULL,'$user_name','$sex','$phone','$addr','$did','$order_time')";
    $result = mysqli_query($conn, $sql);
    $output = [];  //用于保存所有记录的数组
    if($result){
        $output['status']='success';
        $output['oid']=mysqli_insert_id($conn);
    }else{
        $output['status']='error';
        $output['msg']='访问数据库失败';
    }

    //向客户端输出响应消息主体
    $jsonString = json_encode($output);
    echo $jsonString;
?>