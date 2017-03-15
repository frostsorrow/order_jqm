<?php
    header('Content-Type: application/json');
    //接收数据
    @$start = $_REQUEST['start'];
    if( !isset($start) ){
        $start = 0;
    };
    $count = 5;
    $conn = mysqli_connect('127.0.0.1','root','','kaifanla');
    $sql="SET NAMES UTF8";
    mysqli_query($conn,$sql);
    $sql="SELECT did,name,price,material,img_sm FROM kf_dish LIMIT $start,$count";
    $result = mysqli_query($conn, $sql);

    $output = [];  //用于保存所有记录的数组
    while( ($row=mysqli_fetch_assoc($result))!==NULL ){
        $output[] = $row;
    };
    //向客户端输出响应消息主体
    $jsonString = json_encode($output);
    echo $jsonString;
?>