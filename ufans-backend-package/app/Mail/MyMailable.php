<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

use Setting;

class MyMailable extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $user = \App\Models\User::find(22);

        $email_data['subject'] = tr('user_welcome_title').' '.Setting::get('site_name');

        $email_data['page'] = "emails.users.welcome";

        $email_data['data'] = $user;

        $email_data['email'] = $user->email;

        $email_data['name'] = $user->name;

        $email_data['verification_code'] = $user->verification_code;

        $email_data['verification_link'] = Setting::get('frontend_url')."/verify/".$user->verification_code;

        // $message = tr('user_follow_message', 'Kamal'); 

        // $email_data['subject'] = $message; 
        
        // $email_data['message'] = $message;

        // $email_data['page'] = "emails.users.follow-user";

        // $email_data['email'] = $user->email;

        // $email_data['name'] = $user->name;

        // $email_data['data'] = $user;

        return $this->view($email_data['page'])
            ->subject($email_data['subject'])
            ->with([
                'data' => $email_data
            ]);
    }
}
