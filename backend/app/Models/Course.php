<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    public function level() {
        return $this->belongsTo(level::class);
    }

    public function category() {
        return $this->belongsTo(Category::class);
    }

    public function language() {
        return $this->belongsTo(language::class);
    }

    public function user() {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function outcomes() {
        return $this->hasMany(outcome::class);
    }

    public function requirements() {
        return $this->hasMany(requirement::class);
    }

    public function chapters() {
        return $this->hasMany(chapter::class)->orderBy('sort_order');
    }

    public function enrollments() {
        return $this->hasMany(enrollment::class);
    }

    public function reviews() {
        return $this->hasMany(Review::class);
    }
}
