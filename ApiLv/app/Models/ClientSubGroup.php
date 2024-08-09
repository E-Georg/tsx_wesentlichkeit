<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientSubGroup extends Model
{
    use HasFactory;

    protected $table = 'wa_clientSubGroups';

    protected $fillable = [
        'clientId',
        'title',
        'groupId',
        'description',
        'relevance',
        'sort',
        'active',
        'tag'
    ];

    /**
     * Define a relationship to the ClientTopicClassification model.
     * This will allow you to retrieve all topic classifications associated with this subgroup.
     */
    public function classifications()
    {
        return $this->hasMany(ClientTopicClassification::class, 'clientSubGroupId', 'id');
    }

    public function groups()
    {
        return $this->belongsTo(ClientGroup::class, 'groupId');
    }
}
