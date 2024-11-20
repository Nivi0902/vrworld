<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['comment']);

    // Replace with your Bluehost-hosted email address
    $to = "ranjithraju@vrrcorporate.com"; 
    $subject = "New Contact Form Submission";
    $headers = "From: $email" . "\r\n" .
               "Reply-To: $email" . "\r\n" .
               "Content-Type: text/plain; charset=utf-8";

    $email_body = "Name: $name\n";
    $email_body .= "Email: $email\n";
    $email_body .= "Message: $message\n";

    if (mail($to, $subject, $email_body, $headers)) {
        echo "Your message has been sent successfully!";
    } else {
      
