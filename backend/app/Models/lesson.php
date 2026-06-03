<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class lesson extends Model
{
    public function chapter()
    {
        return $this->belongsTo(chapter::class);
    }
}
