@extends('emails.layout')

@section('content')
<h3>Hi {{$data['name']}},</h3>

<p>{{$data['message']}}</p>
@endsection