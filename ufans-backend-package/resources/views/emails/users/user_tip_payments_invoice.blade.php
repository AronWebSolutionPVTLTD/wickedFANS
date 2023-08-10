@extends('emails.layout')

@section('content')
<h2>Hi {{$data['user']['name']}},</h2>  

<p>{{$data['message']}}</p>
@endsection