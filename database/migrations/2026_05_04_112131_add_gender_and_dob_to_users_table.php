<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('users', function (Blueprint $table) {
        $table->string('gender')->nullable(); // Lưu 'nam', 'nu', hoặc 'khac'
        $table->date('dob')->nullable();      // Date of birth (Ngày sinh)
    });
}

public function down()
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn(['gender', 'dob']);
    });
}
};
