<?php
if ($_POST["REQUEST_METHOD"] == "POST") {
    $TOKEN = "6686840970:AAGosvolUtnzM88xG5cO44YzgZGCt52x-wE"; // token
    $CHATID = "-1002065217617"; // chat_id        
    // Проверяем не пусты ли поля с именем и телефоном
    if (!empty($_POST['name']) && !empty($_POST['phone'])) {
        // Если не пустые, то валидируем эти поля и сохраняем и добавляем в тело сообщения. Минимально для теста так:
        $name = ($_POST['name']);
        $kurs = ($_POST['kurs']);
        $facult = ($_POST['facult']);
        $birth = ($_POST['birth']);
        $phone = ($_POST['phone']);
        $arr = array(
            'ФИО:' => $name,
            'Курс:' => $kurs,
            'Факультет:' => $facult,
            'Год рождения:' => $birth,
            'Телефон:' => $phone
        );
        $textSendStatus = '';
        $msgs = [];
        $txt = '';              
        foreach($arr as $key => $value) {
            $txt .= "<b>".$key."</b> ".$value."%0A";
        };
        $textSendStatus = @file_get_contents('https://api.telegram.org/bot'. $TOKEN .'/sendMessage?chat_id=' . $CHATID . '&parse_mode=html&text=' . $txt); 
        if( isset(json_decode($textSendStatus)->{'ok'}) && json_decode($textSendStatus)->{'ok'} ) {
            echo json_encode('SUCCESS');
        } else {
            echo json_decode($textSendStatus);
        }
        header("Location: /");
    } else {
        echo json_encode('NOTVALID');
    }
} else {
    header("Location: /");
}
?>