<?php
if(isset($_POST)){
    $data=file_get_contents('php://input');
    $user=json_decode($data,true);
    echo $user['UID'];
    echo $user['Balance'];
}

?>