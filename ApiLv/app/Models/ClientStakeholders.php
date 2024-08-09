<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientStakeholders extends Model
{
    use HasFactory;

    protected $table = 'wa_clientStakeholders';

    protected $fillable = [
        'clientId',
        'title'
    ];

    public function categoration()
    {
        return $this->hasMany(ClientTopicClassificationClientStakeholders::class, 'stakeholderId',);
    }
}
