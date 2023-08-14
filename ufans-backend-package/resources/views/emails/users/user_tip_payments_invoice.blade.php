@extends('emails.layout')

@section('content')
<h3>Hi {{$data['user']['name']}},</h3>  

<p>{{$data['message']}}</p>
@endsection