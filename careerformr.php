<?php
// Include PHPMailer autoload (make sure you have PHPMailer installed via Composer or include PHPMailer manually)

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // This is for Composer-based autoload, adjust accordingly if you're not using Composer

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Collect form data
    $name = $_POST['name'];
    $email = $_POST['email'];
    $contact = $_POST['contact'];

        // Ensure the file is a PDF and doesn't exceed 20MB
        $file_ext = pathinfo($file_name, PATHINFO_EXTENSION);
        if (strtolower($file_ext) !== 'pdf') {
            echo "Error: Only PDF files are allowed.";
            exit;
        }
        if ($file_size > 20971520) { // 20MB in bytes
            echo "Error: File size exceeds 20MB.";
            exit;
        }

        // Move uploaded file to the tmp folder
        $upload_dir = 'C:/xampp/tmp/';
        $file_path = $upload_dir . basename($file_name);
        if (!move_uploaded_file($file_tmp, $file_path)) {
            echo "Error: Unable to move the uploaded file.";
            exit;
        }
    } else {
        echo "Error: File upload failed.";
        exit;
    }

            $mail = new PHPMailer(true);
        try{
            // Server settings (SMTP)
            $mail->isSMTP();                                            // Send using SMTP
            $mail->Host = 'smtp.gmail.com';                             // Set the SMTP server to send through
            $mail->SMTPAuth = true;                                       // Enable SMTP authentication
            $mail->Username = 'shobia.2001220@srec.ac.in';                   // SMTP username
            $mail->Password = 'fqmz clda dhzq ykay';                      // SMTP password
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;           // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` also works
            $mail->Port = 587;                                           // TCP port to connect to

            // Recipients
            $mail->setFrom($email, $name);                                // Set the sender's email and name
            $mail->addAddress('shobia.2001220@srec.ac.in');               // Add recipient email (use your actual recipient's email)
        
            // Content
        $mail->isHTML(true);
        $mail->Subject = 'New Career Form Submission';
        $mail->Body    = "Name: $name<br>Email: $email<br>Contact: $contact";

        // Attach resume file
        $mail->addAttachment($file_path);  // Add the uploaded file as attachment

        // Send the email
        if ($mail->send()) {
            echo "Message has been sent successfully.";
        } else {
            echo "Mailer Error: " . $mail->ErrorInfo;
        }

        // Clean up by deleting the uploaded file after email is sent
        unlink($file_path); // Remove the file after successful email sending

        } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
        }
        ?>