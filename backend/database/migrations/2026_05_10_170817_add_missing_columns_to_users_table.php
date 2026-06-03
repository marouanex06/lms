<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('last_name')->nullable()->after('name');
            $table->string('mobile')->nullable()->after('email');
            $table->string('designation')->nullable();
            $table->string('language')->nullable();
            $table->string('nationality')->nullable();
            $table->date('birthday')->nullable();
            $table->string('gender')->nullable();
            $table->text('bio')->nullable();
            $table->string('profile_pic')->nullable();
            $table->boolean('terms_accepted')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'last_name', 'mobile', 'designation', 'language', 
                'nationality', 'birthday', 'gender', 'bio', 
                'profile_pic', 'terms_accepted'
            ]);
        });
    }
};
