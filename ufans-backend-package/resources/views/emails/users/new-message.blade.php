@extends('emails.layout')

@section('content')
<h3>Hi {{$data['name']}},</h3>

<p>You have unread messages in the following chats:</p>
@endsection