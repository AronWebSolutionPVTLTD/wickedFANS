<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTrialColumnsToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('link_name')->nullable();
            $table->integer('offer_limit')->nullable();
            $table->integer('offer_expiration')->nullable();
            $table->integer('free_trial_duration')->nullable();
            $table->date('trial_created')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('link_name');
            $table->dropColumn('offer_limit');
            $table->dropColumn('offer_expiration');
            $table->dropColumn('free_trial_duration');
            $table->dropColumn('trial_created');
        });
    }
}
