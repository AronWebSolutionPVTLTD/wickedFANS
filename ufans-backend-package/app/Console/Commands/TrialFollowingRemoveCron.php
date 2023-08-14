<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

use Log, Validator, Exception, DB, Setting;

use Illuminate\Http\Request;

use App\Models\Follower;

class TrialFollowingRemoveCron extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'TrialFollowingRemove:cron';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'The expired trial followers will be deleted';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(Request $request)
    {
        try {
            DB::beginTransaction();
            $followers = Follower::where('type', 'trial')->get();
            
            foreach($followers as $follower) {
                $today = date('Y-m-d');
                $date = $follower->trial_start_time;
                $diff = abs(strtotime($today) - strtotime($date)) / (60 * 60 * 24);
                
                if ($diff >= $follower->trial_period) {
                    $follower->status = FOLLOWER_EXPIRED;
                    $follower->type = null;
                    $follower->trial_period = null;
                    $follower->trial_start_time = null;
                    $follower->save();
                }
            }
            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            Log::info("TrialFollowingRemoveJob Error".print_r($e->getMessage(), true));
        }
    }
}
