@extends('emails.layout')

@section('content')
<h3>Hi {{$data['name']}},</h3>

<p>
    <b>{{tr('post_id')}} - {{$data['post_unique_id']}}</b>
    <br>

    @if($data['status'] == tr('approved'))

        {{tr('above_post_approved_by_admin')}}!!

    @elseif($data['status'] ==  tr('deleted'))

        {{tr('above_post_deleted_by_admin')}}!! 

    @else

        {{tr('above_post_declined_by_admin')}}!! 
        
    @endif
</p>
@endsection