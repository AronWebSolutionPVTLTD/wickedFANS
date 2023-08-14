@extends('emails.layout')

@section('content')
<h2>Hi {{$data['name']}},</h2>

<p>You have unread messages in the following chats:</p>
@endsection