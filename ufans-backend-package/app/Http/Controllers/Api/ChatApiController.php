<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use Log, Validator, Exception, DB, Setting;

use App\Helpers\Helper;

use App\Repositories\PaymentRepository as PaymentRepo;

class ChatApiController extends Controller
{

    protected $skip, $take;

    public function __construct(Request $request) {

        Log::info(url()->current());

        Log::info("Request Data".print_r($request->all(), true));

        $this->skip = $request->skip ?: 0;

        $this->take = $request->take ?: (Setting::get('admin_take_count') ?: TAKE_COUNT);

        $this->timezone = $this->loginUser->timezone ?? "America/New_York";

    }

    /**
     * @method chat_assets_save()
     * 
     * @uses - To save the chat assets.
     *
     * @created Arun
     *
     * @updated Arun
     * 
     * @param 
     *
     * @return No return response.
     *
     */

    public function chat_assets_save(Request $request) {

        try {

            DB::beginTransaction();

            $rules = [
                'from_user_id' => 'required|exists:users,id',
                'to_user_id' => 'required|exists:users,id',
                'message' => 'nullable',
                'amount' => 'nullable|numeric|min:1',
                'file' => 'required',
            ];

            Helper::custom_validator($request->all(),$rules);
            
            $message = $request->message;

            $from_chat_user_inputs = ['from_user_id' => $request->from_user_id, 'to_user_id' => $request->to_user_id];

            $from_chat_user = \App\Models\ChatUser::updateOrCreate($from_chat_user_inputs);

            $to_chat_user_inputs = ['from_user_id' => $request->to_user_id, 'to_user_id' => $request->from_user_id];

            $to_chat_user = \App\Models\ChatUser::updateOrCreate($to_chat_user_inputs);

            $chat_message = new \App\Models\ChatMessage;

            $chat_message->from_user_id = $request->from_user_id;

            $chat_message->to_user_id = $request->to_user_id;

            $chat_message->message = $request->message ?? '';

            $chat_message->is_file_uploaded = YES;

            $amount = $request->amount ?? 0.00;

            if(Setting::get('is_only_wallet_payment')) {

                $chat_message->token = $amount;

                $chat_message->amount = $chat_message->token * Setting::get('token_amount');

            } else {

                $chat_message->amount = $amount;

            }

            $chat_message->is_paid = $chat_message->amount > 0 ? YES : NO;

            if ($chat_message->save()) {


                if ($request->has('file')) {

                    $files = $request->file;

                    if(!is_array($files)) {

                        $chat_asset = new \App\Models\ChatAsset;

                        $chat_asset->from_user_id = $request->from_user_id;

                        $chat_asset->to_user_id = $request->to_user_id;

                        $chat_asset->chat_message_id = $chat_message->chat_message_id;

                        $filename = rand(1,1000000).'-chat_asset-'.$request->file_type ?? 'image';

                        $chat_assets_file_url = Helper::storage_upload_file($request->file, CHAT_ASSETS_PATH, $filename);

                        $chat_asset->file = $chat_assets_file_url;

                        if($chat_assets_file_url) {

                            $chat_asset->file_type = $request->file_type ?? FILE_TYPE_IMAGE;

                            $chat_asset->token = $chat_message->token ?? 0.00;

                            $chat_asset->amount = $chat_message->amount ?? 0.00;

                            $chat_asset->blur_file = $request->file_type == FILE_TYPE_IMAGE ? \App\Helpers\Helper::generate_chat_blur_file($chat_asset->file, $request->file) : Setting::get('post_video_placeholder');  

                            $chat_asset->save();

                        }
                    } else {

                        foreach($files as $file){

                            $chat_asset = new \App\Models\ChatAsset;

                            $chat_asset->from_user_id = $request->from_user_id;

                            $chat_asset->to_user_id = $request->to_user_id;

                            $chat_asset->chat_message_id = $chat_message->chat_message_id;

                            $filename = rand(1,1000000).'-chat_asset-'.$request->file_type ?? 'image';

                            $chat_assets_file_url = Helper::storage_upload_file($file, CHAT_ASSETS_PATH, $filename);

                            $chat_asset->file = $chat_assets_file_url;

                            if($chat_assets_file_url) {

                                $chat_asset->file_type = $request->file_type ?? FILE_TYPE_IMAGE;

                                $chat_asset->token = $chat_message->token ?? 0.00;

                                $chat_asset->amount = $chat_message->amount ?? 0.00;

                                $chat_asset->blur_file = $request->file_type == FILE_TYPE_IMAGE ? \App\Helpers\Helper::generate_chat_blur_file($chat_asset->file, $file) : Setting::get('post_video_placeholder');  

                                $chat_asset->save();
                            }
                        }

                    }
                }

                DB::commit();
            }

            $chat_message = \App\Repositories\CommonRepository::chat_messages_single_response($chat_message, $request);

            $data['chat_message'] = $chat_message;

            $data['chat_asset'] = $chat_asset;

            return $this->sendResponse("", "", $data);

        } catch(Exception $e) {

            DB::rollback();

            return $this->sendError($e->getMessage(), $e->getCode());
        }
    
    }
    
    /**
     * @method chat_assets_index()
     * 
     * @uses - To get the media assets.
     *
     * @created Arun
     *
     * @updated Vithya R
     * 
     * @param 
     *
     * @return return response.
     *
     */

    public function chat_assets_index(Request $request) {

        try {

            $base_query = $total_query = \App\Models\ChatAsset::where(function($query) use ($request){
                        $query->where('chat_assets.from_user_id', $request->from_user_id);
                        $query->where('chat_assets.to_user_id', $request->to_user_id);
                    })->orWhere(function($query) use ($request){
                        $query->where('chat_assets.from_user_id', $request->to_user_id);
                        $query->where('chat_assets.to_user_id', $request->from_user_id);
                    })
                    ->latest();
                    
            $chat_assets = $base_query->skip($this->skip)->take($this->take)->get();
            
            $data['chat_assets'] = $chat_assets ?? emptyObject();

            $data['total'] = $total_query->count() ?? [];

            return $this->sendResponse("", "", $data);

        } catch(Exception $e) {

            return $this->sendError($e->getMessage(), $e->getCode());
        }
    
    }

    /**
     * @method chat_assets_payment_by_stripe()
     * 
     * @uses chat_assets_payment_by_stripe based on Chat message id
     *
     * @created Arun
     *
     * @updated Arun
     *
     * @param object $request - Chat message id
     *
     * @return json with boolean output
     */

    public function chat_assets_payment_by_stripe(Request $request) {

        try {

            DB::beginTransaction();

            // Validation start

            $rules = ['chat_message_id' => 'required|numeric'];

            Helper::custom_validator($request->all(), $rules, $custom_errors = []);

            // Validation end
            $chat_message = \App\Models\ChatMessage::firstWhere('id',$request->chat_message_id);

            $chat_asset = \App\Models\ChatAsset::firstWhere('chat_message_id',$request->chat_message_id);

            if(!$chat_message || !$chat_asset) {

                throw new Exception(api_error(3000), 3000); 

            }

            $request->request->add(['payment_mode' => CARD, 'usage_type' => USAGE_TYPE_CHAT]);

            $total = $user_pay_amount = $chat_message->amount ?: 0.00;

            if($user_pay_amount > 0) {

                // Check the user have the cards

                $user_card = \App\Models\UserCard::where('user_id', $request->id)->firstWhere('is_default', YES);

                if(!$user_card) {

                    throw new Exception(api_error(120), 120); 

                }

                $request->request->add([
                    'total' => $total, 
                    'user_card_id' => $user_card->id,
                    'customer_id' => $user_card->customer_id,
                    'card_token' => $user_card->card_token,
                    'user_pay_amount' => $user_pay_amount,
                    'paid_amount' => $user_pay_amount,
                ]);

                $card_payment_response = PaymentRepo::chat_assets_payment_by_stripe($request, $chat_message)->getData();
                
                if($card_payment_response->success == false) {

                    throw new Exception($card_payment_response->error, $card_payment_response->error_code);
                    
                }

                $card_payment_data = $card_payment_response->data;

                $request->request->add(['paid_amount' => $card_payment_data->paid_amount, 'payment_id' => $card_payment_data->payment_id, 'paid_status' => $card_payment_data->paid_status]);
               

            }

            $payment_response = PaymentRepo::chat_assets_payment_save($request, $chat_message)->getData();

            if($payment_response->success) {
                

                DB::commit();

                $data['chat_message'] = $chat_message;

                return $this->sendResponse(api_success(118), 118, $data);

            } else {

                throw new Exception($payment_response->error, $payment_response->error_code);
                
            }

        } catch(Exception $e) {

            DB::rollback();

            return $this->sendError($e->getMessage(), $e->getCode());
        }

    }

    /**
     * @method chat_assets_payment_by_wallet()
     * 
     * @uses chat_assets_payment_by_wallet based on Chat message id
     *
     * @created Bhawya
     *
     * @updated
     *
     * @param object $request - Chat message id
     *
     * @return json with boolean output
     */

    public function chat_assets_payment_by_wallet(Request $request) {

        try {

            DB::beginTransaction();

            // Validation start

            $rules = ['chat_message_id' => 'required|numeric'];

            Helper::custom_validator($request->all(), $rules, $custom_errors = []);

            // Validation end
            $chat_message = \App\Models\ChatMessage::firstWhere('id',$request->chat_message_id);

            $chat_asset = \App\Models\ChatAsset::firstWhere('chat_message_id',$request->chat_message_id);

            if(!$chat_message || !$chat_asset) {

                throw new Exception(api_error(3000), 3000); 

            }

            $total = $user_pay_amount = Setting::get('is_only_wallet_payment') ? $chat_message->token : $chat_message->amount;

            // Check the user has enough balance 

            $user_wallet = \App\Models\UserWallet::where('user_id', $request->id)->first();

            $remaining = $user_wallet->remaining ?? 0;

            if(Setting::get('is_referral_enabled')) {

                $remaining = $remaining + $user_wallet->referral_amount;
                
            }
            
            if($remaining < $total) {
                throw new Exception(api_error(147), 147);    
            }

            $request->request->add([
                'payment_mode' => PAYMENT_MODE_WALLET,
                'total' => $user_pay_amount * Setting::get('token_amount'), 
                'user_pay_amount' => $user_pay_amount,
                'paid_amount' => $user_pay_amount * Setting::get('token_amount'),
                'payment_type' => WALLET_PAYMENT_TYPE_PAID,
                'amount_type' => WALLET_AMOUNT_TYPE_MINUS,
                'payment_id' => 'WPP-'.rand(),
                'usage_type' => USAGE_TYPE_CHAT,
                'tokens' => $user_pay_amount,
            ]);

            $wallet_payment_response = PaymentRepo::user_wallets_payment_save($request)->getData();

            if($wallet_payment_response->success) {

                $request->request->add([
                    'from_user_id' => $request->id,
                    'to_user_id' => $request->user_id,
                ]);

                $payment_response = PaymentRepo::chat_assets_payment_save($request, $chat_message)->getData();

                if($payment_response->success) {
                    
                    DB::commit();

                    $chat_message = \App\Repositories\CommonRepository::chat_messages_asset_single_response($chat_message, $request);

                    $data['chat_message'] = $chat_message;

                    return $this->sendResponse(api_success(118), 118, $data);

                } else {

                    throw new Exception($payment_response->error, $payment_response->error_code);
                    
                }

            }

            throw new Exception($wallet_payment_response->error, $wallet_payment_response->error_code);
                
        } catch(Exception $e) {

            DB::rollback();

            return $this->sendError($e->getMessage(), $e->getCode());
        }

    }

    /**
     * @method chat_assets_payment_by_paypal()
     * 
     * @uses chat_assets_payment_by_paypal based on Chat message id
     *
     * @created Arun
     *
     * @updated Arun
     *
     * @param object $request - Chat message id
     *
     * @return json with boolean output
     */

    public function chat_assets_payment_by_paypal(Request $request) {

        try {

            DB::beginTransaction();

            // Validation start

            $rules = [
                'chat_message_id' => 'required|numeric',
                'payment_id' => 'required',
            ];

            Helper::custom_validator($request->all(), $rules, $custom_errors = []);

            // Validation end
            $chat_message = \App\Models\ChatMessage::firstWhere('id',$request->chat_message_id);

            $chat_asset = \App\Models\ChatAsset::firstWhere('chat_message_id',$request->chat_message_id);

            if(!$chat_message || !$chat_asset) {

                throw new Exception(api_error(3000), 3000); 

            }

            $total = $user_pay_amount = $chat_message->amount ?: 0.00;

            $request->request->add(['payment_mode' => PAYPAL,'paid_amount'=>$user_pay_amount, 'usage_type' => USAGE_TYPE_CHAT, 'user_pay_amount' => $user_pay_amount,'paid_status' => PAID_STATUS]);
            
            $payment_response = PaymentRepo::chat_assets_payment_save($request, $chat_message)->getData();

            if($payment_response->success) {
                

                DB::commit();

                $data['chat_message'] = $chat_message;
                
                return $this->sendResponse(api_success(118), 118, $data);

            } else {

                throw new Exception($payment_response->error, $payment_response->error_code);
                
            }

        } catch(Exception $e) {

            DB::rollback();

            return $this->sendError($e->getMessage(), $e->getCode());
        }

    }

    /**
     * @method chat_assets_delete()
     *
     * @uses delete the chat assets
     *
     * @created Arun
     *
     * @updated Arun
     *
     * @param object $request
     *
     * @return JSON Response
     */
    public function chat_assets_delete(Request $request) {

        try {
            
            DB::begintransaction();

            $rules = ['chat_message_id' => 'required|exists:chat_messages,id'];

            Helper::custom_validator($request->all(),$rules);

            $chat_message = \App\Models\ChatMessage::destroy($request->chat_message_id);

            DB::commit(); 

            $data = $chat_message;

            return $this->sendResponse(api_success(3000), 3000, $data);
            
        } catch(Exception $e){ 

            DB::rollback();

            return $this->sendError($e->getMessage(), $e->getCode());

        } 
    
    }

    /** 
     * @method chat_assets_payments_list()
     *
     * @uses To display the chat_assets_payments list based on user  id
     *
     * @created Arun 
     *
     * @updated Arun
     *
     * @param object $request
     *
     * @return json response with user details
     */

    public function chat_assets_payments_list(Request $request) {

        try {

            $base_query = $total_query = \App\Models\ChatAssetPayment::where('from_user_id',$request->id);

            $chat_assets_payments = $base_query->skip($this->skip)->take($this->take)->get();

            $data['chat_assets_payments'] = $chat_assets_payments;

            $data['total'] = $total_query->count() ?? 0;

            return $this->sendResponse($message = "", $success_code = "", $data);

        } catch(Exception $e) {

            return $this->sendError($e->getMessage(), $e->getCode());

        }
    
    }

    /**
     * @method chat_assets_payments_view()
     * 
     * @uses get the selected chat_assets_payments request
     *
     * @created Arun 
     *
     * @updated Arun
     *
     * @param object $request
     *
     * @return json with boolean output
     */

    public function chat_assets_payments_view(Request $request) {

        try {

            $rules = ['chat_asset_payments_id' => 'required|exists:chat_asset_payments,id'];

            Helper::custom_validator($request->all(),$rules);

            $chat_asset_payment = \App\Models\ChatAssetPayment::with('chatMessage')->with('chatAssets')->firstWhere('id',$request->chat_asset_payments_id);
            
            if(!$chat_asset_payment) {

                throw new Exception(api_error(167), 167);
                
            }

            $data['chat_asset_payment'] = $chat_asset_payment;

            return $this->sendResponse($message = "", $code = "", $data);

        } catch(Exception $e) {

            return $this->sendError($e->getMessage(), $e->getCode());
        }

    }


    /** 
     * @method chat_users_search()
     *
     * @uses
     *
     * @created Bhawya
     *
     * @updated Bhawya
     *
     * @param
     * 
     * @return JSON response
     *
     */
    public function chat_users_search(Request $request) {

        try {

            // validation start

            $rules = ['search_key' => 'required'];
            
            $custom_errors = ['search_key.required' => 'Please enter the username'];

            Helper::custom_validator($request->all(), $rules, $custom_errors);

            $search_key = $request->search_key;

            $base_query = $total_query = \App\Models\ChatUser::where('from_user_id', $request->id)
                    ->whereHas('toUser',function($query) use($search_key) {
                        return $query->where('users.name','LIKE','%'.$search_key.'%');
                    })
                    ->orderBy('chat_users.updated_at', 'desc');

            $chat_users = $base_query->skip($this->skip)->take($this->take)->get();

            $data['users'] = $chat_users ?? [];

            $data['total'] = $total_query->count() ?: 0;

            return $this->sendResponse($message = "", $code = "", $data);

        } catch(Exception $e) {

            return $this->sendError($e->getMessage(), $e->getCode());
        
        }

    }

    /** 
     * @method chat_messages_search()
     *
     * @uses
     *
     * @created vithya R
     *
     * @updated vithya R
     *
     * @param
     * 
     * @return JSON response
     *
     */
    public function chat_messages_search(Request $request) {

        try {

            $rules = ['search_key' => 'required'];
            
            $custom_errors = ['search_key.required' => 'Please enter the message'];

            Helper::custom_validator($request->all(), $rules, $custom_errors);

            $search_key = $request->search_key;

            $base_query = $total_query = \App\Models\ChatMessage::where(function($query) use ($request){
                        $query->where('chat_messages.from_user_id', $request->from_user_id);
                        $query->where('chat_messages.to_user_id', $request->to_user_id);
                    })
                    ->where('chat_messages.message', 'like', "%".$search_key."%")
                    ->orderBy('chat_messages.updated_at', 'asc');

            $chat_messages = $base_query->skip($this->skip)->take($this->take)->get();

            $data['messages'] = $chat_messages ?? [];

            $data['total'] = $total_query->count() ?: 0;

            return $this->sendResponse($message = "", $code = "", $data);

        } catch(Exception $e) {

            return $this->sendError($e->getMessage(), $e->getCode());
        
        }

    }

    /**
     * @method chat_assets_save()
     * 
     * @uses - To save the chat assets.
     *
     * @created Arun
     *
     * @updated Arun
     * 
     * @param 
     *
     * @return No return response.
     *
     */

    public function chat_asset_files_upload(Request $request) {

        try {

            DB::beginTransaction();

            $rules = [
                'from_user_id' => 'required|exists:users,id',
                'to_user_id' => 'required|exists:users,id',
                'message' => 'nullable',
                'amount' => 'nullable|numeric|min:1',
                'file' => 'required',
            ];

            Helper::custom_validator($request->all(),$rules);
            
            $data = $file_data = [];

            $chat_asset_file_id = $chat_asset_blur_file = '';

            $file_url = $file_name = [];

            if ($request->has('file')) {

                $files = $request->file;

                if(!is_array($files)) {

                    $chat_asset = new \App\Models\ChatAsset;

                    $chat_asset->from_user_id = $request->from_user_id;

                    $chat_asset->to_user_id = $request->to_user_id;

                    $chat_asset->chat_message_id = 0;

                    $filename = str_replace(' ', '-', $file->getClientOriginalName());

                    // $filename = rand(1,1000000).'-chat_asset-'.$request->file_type ?? 'image';

                    $chat_assets_file_url = Helper::storage_upload_file($request->file, CHAT_ASSETS_PATH, $filename, NO);

                    $chat_asset->file = $chat_assets_file_url;

                    if($chat_assets_file_url) {

                        $chat_asset->file_type = $request->file_type ?? FILE_TYPE_IMAGE;

                        // $chat_asset->token = $chat_message->token ?? 0.00;

                        // $chat_asset->amount = $chat_message->amount ?? 0.00;

                        $chat_asset->blur_file = $request->file_type == FILE_TYPE_IMAGE ? \App\Helpers\Helper::generate_chat_blur_file($chat_asset->file, $request->file) : Setting::get('post_video_placeholder');  

                        $chat_asset->save();

                    }

                    $file_data['chat_asset'] = $chat_asset;

                    $chat_asset_file_id != "" && $chat_asset_file_id .= ",";

                    $chat_asset_file_id .= $chat_asset->id;

                    $file_url[] = $chat_assets_file_url;

                    $file_name[] = basename($chat_assets_file_url);

                    $chat_asset_blur_file != "" && $chat_asset_blur_file .= ",";

                    $chat_asset_blur_file .= $chat_asset->blur_file;

                    $chat_asset->asset_file = $chat_asset->file;
                    
                    $data['chat_asset'] = $chat_asset;

                } else {

                    foreach($files as $file){

                        $chat_asset = new \App\Models\ChatAsset;

                        $chat_asset->from_user_id = $request->from_user_id;

                        $chat_asset->to_user_id = $request->to_user_id;

                        $chat_asset->chat_message_id = 0;

                        $filename = str_replace(' ', '-', $file->getClientOriginalName());

                        // $filename = rand(1,1000000).'-chat_asset-'.$request->file_type ?? 'image';

                        $chat_assets_file_url = Helper::storage_upload_file($file, CHAT_ASSETS_PATH, $filename, NO);

                        $chat_asset->file = $chat_assets_file_url;

                        if($chat_assets_file_url) {

                            $chat_asset->file_type = $request->file_type ?? FILE_TYPE_IMAGE;

                            $chat_asset->blur_file = $request->file_type == FILE_TYPE_IMAGE ? \App\Helpers\Helper::generate_chat_blur_file($chat_asset->file, $file) : ($request->file_type == FILE_TYPE_DOCUMENT ? Setting::get('asset_placeholder') : Setting::get('post_video_placeholder'));  

                            $chat_asset->save();
                        }

                        $chat_asset_file_id != "" && $chat_asset_file_id .= ",";

                        $chat_asset_file_id .= $chat_asset->id;

                        $file_url[] = $chat_assets_file_url;

                        $file_name[] = basename($chat_assets_file_url);

                        $chat_asset_blur_file != "" && $chat_asset_blur_file .= ",";

                        $chat_asset_blur_file .= $chat_asset->blur_file;

                        $chat_asset->asset_file = $chat_asset->file;

                        array_push($file_data, $chat_asset);

                    }

                    $data['chat_asset'] = $file_data;

                }

            }

            DB::commit();

            $data['chat_asset_file_id'] = $chat_asset_file_id;

            $data['file'] = $file_url;

            $data['file_name'] = $file_name;

            $data['blur_file'] = $chat_asset_blur_file;

            return $this->sendResponse("", "", $data);

        } catch(Exception $e) {

            DB::rollback();

            return $this->sendError($e->getMessage(), $e->getCode());
        }
    
    }

    /**
     * @method chat_asset_files_remove()
     *
     * @uses remove the selected file
     *
     * @created Vithya R
     *
     * @updated Vithya R
     *
     * @param integer $post_file_id
     *
     * @return JSON Response
     */
    public function chat_asset_files_remove(Request $request) {

        try {
            
            DB::begintransaction();

            $rules = [
                'file' => 'nullable',
                // 'file_type' => 'required',
                // 'blur_file' => 'required_if:file_type,==,'.POSTS_IMAGE,
                // 'preview_file' => 'required_if:file_type,==,'.POSTS_VIDEO,
                // 'post_file_id' => 'nullable|exists:post_files,id',
            ];

            Helper::custom_validator($request->all(),$rules);

            if($request->file) {

                $chat_asset = \App\Models\ChatAsset::where('file', $request->file)->first();

            } else {

                $chat_asset = \App\Models\ChatAsset::where('id', $request->chat_asset_id)->first();

            }

            $chat_asset_ids = explode(',', $request->chat_asset_id);

            if($chat_asset) {

                $pos = array_search($chat_asset->id, $chat_asset_ids);

                unset($chat_asset_ids[$pos]);

                $chat_asset->delete();

                DB::commit(); 

            }

            $chat_assets = \App\Models\ChatAsset::whereIn('id',$chat_asset_ids)->pluck('file');

            $chat_asset_ids = $chat_asset_ids ? implode(',', $chat_asset_ids) : '';
            
            $data['chat_asset_id'] = $chat_asset_ids ?? '';

            $data['chat_asset'] = $chat_assets ?? '';

            return $this->sendResponse(api_success(152), 152, $data = $data);
           
            
        } catch(Exception $e){ 

            DB::rollback();

            return $this->sendError($e->getMessage(), $e->getCode());

        } 
    
    }

    /** 
     * @method chat_messages()
     *
     * @uses chat_messages List
     *
     * @created vithya R
     *
     * @updated vithya R
     *
     * @param
     * 
     * @return JSON response
     *
     */
    public function chat_messages_index(Request $request) {

        try {

            $base_query = $total_query = \App\Models\ChatMessage::where(function($query) use ($request){
                        $query->where('chat_messages.from_user_id', $request->from_user_id);
                        $query->where('chat_messages.to_user_id', $request->to_user_id);
                    })->orWhere(function($query) use ($request){
                        $query->where('chat_messages.from_user_id', $request->to_user_id);
                        $query->where('chat_messages.to_user_id', $request->from_user_id);
                    });

            $data['total'] = $total_query->count() ?: 0;

            $base_query = $base_query->latest();

            $chat_message = \App\Models\ChatMessage::where('chat_messages.to_user_id', $request->from_user_id)->where('status', NO)->update(['status' => YES]);

            $chat_messages = $base_query->skip($this->skip)->take($this->take)->orderBy('chat_messages.updated_at', 'asc')->get();

            $chat_messages = \App\Repositories\CommonRepository::chat_messages_response($chat_messages, $request);

            if($request->device_type == DEVICE_WEB) {

                // $chat_messages = array_reverse($chat_messages->toArray());

            }
            
            $data['messages'] = $chat_messages ?? [];

            $data['user'] = $request->id == $request->from_user_id ? \App\Models\User::find($request->to_user_id) : \App\Models\User::find($request->to_user_id);

            $data['is_block_user'] = Helper::is_block_user($request->id, $request->to_user_id);

            return $this->sendResponse($message = "", $code = "", $data);

        } catch(Exception $e) {

            return $this->sendError($e->getMessage(), $e->getCode());
        
        }

    }

    /**
     * @method chat_assets_save()
     * 
     * @uses - To save the chat assets.
     *
     * @created Arun
     *
     * @updated Arun
     * 
     * @param 
     *
     * @return No return response.
     *
     */

    public function chat_messages_save(Request $request) {

        try {

            DB::beginTransaction();

            $rules = [
                'from_user_id' => 'required|exists:users,id',
                'to_user_id' => 'required|exists:users,id',
                'message' => 'nullable',
                'amount' => 'nullable|numeric|min:1',
                'chat_asset_file_id' => 'required',
            ];

            Helper::custom_validator($request->all(),$rules);
            
            $message = $request->message;

            $from_chat_user_inputs = ['from_user_id' => $request->from_user_id, 'to_user_id' => $request->to_user_id];

            $from_chat_user = \App\Models\ChatUser::updateOrCreate($from_chat_user_inputs);

            $to_chat_user_inputs = ['from_user_id' => $request->to_user_id, 'to_user_id' => $request->from_user_id];

            $to_chat_user = \App\Models\ChatUser::updateOrCreate($to_chat_user_inputs);

            $chat_message = new \App\Models\ChatMessage;

            $chat_message->from_user_id = $request->from_user_id;

            $chat_message->to_user_id = $request->to_user_id;

            $chat_message->message = $request->message ?? '';

            $chat_message->is_file_uploaded = YES;

            $amount = $request->amount ?? 0.00;

            if(Setting::get('is_only_wallet_payment')) {

                $chat_message->token = $amount;

                $chat_message->amount = $chat_message->token * Setting::get('token_amount');

            } else {

                $chat_message->amount = $amount;

            }

            $chat_message->is_paid = $chat_message->amount > 0 ? YES : NO;

            if ($chat_message->save()) {

                if($request->chat_asset_file_id) {

                    $chat_asset_file_ids = explode(',',$request->chat_asset_file_id);

                    foreach($chat_asset_file_ids as $chat_asset_file_id) {

                        $chat_asset = \App\Models\ChatAsset::find($chat_asset_file_id);

                        $chat_asset->chat_message_id = $chat_message->id;

                        $chat_asset->token = $chat_message->token;

                        $chat_asset->amount = $chat_message->amount;

                        $chat_asset->save();

                    }
                }

                DB::commit();
            }

            $chat_message = \App\Repositories\CommonRepository::chat_messages_asset_single_response($chat_message, $request);

            $data['chat_message'] = $chat_message;

            $data['chat_asset'] = $chat_asset;

            return $this->sendResponse("", "", $data);

        } catch(Exception $e) {

            DB::rollback();

            return $this->sendError($e->getMessage(), $e->getCode());
        }
    
    }

    /**
     * @method user_chat_assets()
     *
     * @uses To display all the chat media files
     *
     * @created Bhawya N
     *
     * @updated
     *
     * @param request id
     *
     * @return JSON Response
     */
    public function user_chat_assets(Request $request) {

        try {

            $to_chat_message_ids = \App\Models\ChatMessage::where(function($query) use ($request){
                        $query->where('chat_messages.from_user_id', $request->from_user_id);
                        $query->where('chat_messages.to_user_id', $request->to_user_id);
                    })
                ->pluck('id')
                ->toArray();

            $from_chat_message_ids = \App\Models\ChatMessage::where(function($query) use ($request){
                        $query->where('chat_messages.to_user_id', $request->from_user_id);
                        $query->where('chat_messages.from_user_id', $request->to_user_id);
                    })
                ->pluck('id')
                ->toArray();

            $chat_message_ids = array_merge($to_chat_message_ids, $from_chat_message_ids);

            $base_query = $total_query = \App\Models\ChatAsset::whereIn('chat_message_id',$chat_message_ids);

            if($request->file_type != POSTS_ALL) {

                $type = $request->file_type;

                if($type)

                    $base_query = $base_query->where('chat_assets.file_type', $type);
            }

            $data['total'] = $total_query->count() ?? 0;

            $base_query = $base_query->latest();
            
            $chat_assets = $base_query->skip($this->skip)->take($this->take)->get();

            $chat_assets = \App\Repositories\CommonRepository::chat_assets_list_response($chat_assets, $request);

            $data['chat_assets'] = $chat_assets ?? [];

            return $this->sendResponse($message = '' , $code = '', $data);

        } catch(Exception $e) {

            return $this->sendError($e->getMessage(), $e->getCode());
        
        }
    
    }

}
