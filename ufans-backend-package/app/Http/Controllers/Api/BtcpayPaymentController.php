<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use Validator, Log;

use App\Repositories\PaymentRepository as PaymentRepo;

class BtcpayPaymentController extends Controller
{
    /**
     * 
     * @method webhook() 
     *
     * @uses Btcpay webhook for payment received
     *
     * @param Request $request
     *
     * @return json repsonse
     */
    public function webhook(Request $request)
    {
        $event_type = $request->type;

        $user_wallet_payment = \App\Models\UserWalletPayment::where('payment_id', $request->invoiceId)->first();

        switch ($event_type) {
            case 'InvoiceCreated':
                $user_wallet_payment->status = USER_WALLET_PAYMENT_INITIALIZE;
                break;
            case 'InvoiceReceivedPayment':
                $user_wallet_payment->status = USER_WALLET_PAYMENT_PAID;
                break;
            case 'InvoiceInvalid':
                $user_wallet_payment->status = USER_WALLET_PAYMENT_CANCELLED;
                break;
            case 'InvoiceExpired':
                $user_wallet_payment->status = USER_WALLET_PAYMENT_UNPAID;
                break;
            default:
                break;
        }

        $user_wallet_payment->save();

        if ($event_type == 'InvoiceReceivedPayment' && $user_wallet_payment->status == USER_WALLET_PAYMENT_PAID) {
            PaymentRepo::user_wallet_update($user_wallet_payment);
        }
    }
}
