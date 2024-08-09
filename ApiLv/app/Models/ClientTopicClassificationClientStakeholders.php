<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientTopicClassificationClientStakeholders extends Model
{
    use HasFactory;

    protected $table = 'wa_clientTopicClassificationClientStakeholders';

    protected $fillable = [
        'clientId',
        'active',
        'clientTopicClassificationId',
        'stakeholderId'
    ];

    public function stakeholder()
    {
        return $this->belongsTo(ClientStakeholders::class, 'stakeholderId');
    }

    // public function classification()
    // {
    //     return $this->belongsTo(ClientTopicClassification::class, 'id', 'clientTopicClassificationId');
    // }
}
