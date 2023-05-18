 <?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

use Carbon\Carbon;
use Log, Auth;
use Setting, Exception;
use App\Helpers\Helper;
use App\Models\User;

class AudioCallPaymentJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $data;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($data)
    {
        //
        $this->data = $data;

    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        
        try {

            $request = (object) $this->data['audio_call_payments'];

            $title = $content = push_messages(606);

            $audio_call_payments = \App\Models\AudioCallPayment::where('user_id',$request->id)->where('audio_call_payment_id',$request->audio_call_payment_id)->first();

            $to_user = User::find($audio_call_payment->user_id);

            $paid_amount = \Setting::get('is_only_wallet_payment') ? $audio_call_payments->token : $audio_call_payments->paid_amount;

            $message = tr('audio_call_payments_message', formatted_amount($paid_amount ?? 0.00) )." ".$to_user->name ?? ''; 

            $data['user_id'] = $audio_call_payments->user_id ?? '';

            $data['user_id'] = $audio_call_payments->audiocallDetails->user_id ?? '';
          
            $data['message'] = $message;

            $data['action_url'] = Setting::get('BN_USER_TIPS');

            $data['notification_type'] = BELL_NOTIFICATION_TYPE_AUDIO_CALL_PAYMENT;

            $data['image'] = $audio_call_payments->user->picture ?? asset('placeholder.jpeg');

            $data['audio_call_request_id'] = $audio_call_payments->audio_call_payment_id ?? '';

            $data['subject'] = $content;

            dispatch(new BellNotificationJob($data));

            $user_details = User::where('id', $data['user_id'])->first();

            if (Setting::get('is_push_notification') == YES && $user_details) {

                if($user_details->is_push_notification == YES && ($user_details->device_token != '')) {

                    $push_data = [
                        'content_id' =>$audio_call_payments->audio_call_payment_id ?? '',
                        'notification_type' => BELL_NOTIFICATION_TYPE_AUDIO_CALL_PAYMENT,
                        'content_unique_id' => $audio_call_payments->videocallDetails->video_call_payment_unique_id ?? '',
                    ];

                    \Notification::send(
                        $user_details->id, 
                        new \App\Notifications\PushNotification(
                            $title , 
                            $content, 
                            json_encode($push_data), 
                            $user_details->device_token,
                            Setting::get('BN_USER_TIPS'),
                        )
                    );

                }
            } 

            if (Setting::get('is_email_notification') == YES && $user_details) {
               
                $email_data['subject'] = tr('audio_call_payments_message', formatted_amount($audio_call_payments->paid_amount ?? 0.00) )." ".$from_user->name ?? ''; 
               
                $email_data['message'] = $message;

                $email_data['page'] = "emails.users.audio_call_payment_invoice";

                $email_data['email'] = $user_details->email;

                $email_data['name'] = $user_details->name;

                $email_data['data'] = $user_details;

                dispatch(new SendEmailJob($email_data));

            }
            
            



        } catch(Exception $e) {

            Log::info("Error ".print_r($e->getMessage(), true));

        }
    }
}