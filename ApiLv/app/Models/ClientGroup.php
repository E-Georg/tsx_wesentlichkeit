<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientGroup extends Model
{
    protected $table = 'wa_clientGroups';

    protected $fillable = [
        'clientId',
        'title',
        'categoryId',
        'description',
        'relevance',
        'sort',
        'active',
        'tag'
    ];
}
