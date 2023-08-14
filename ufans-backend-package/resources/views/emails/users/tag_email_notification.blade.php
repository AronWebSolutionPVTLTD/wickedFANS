@extends('emails.layout')

@section('content')
<h3>Hi {{$data['name']}},</h3>  

<p>{{$data['message']}} <a href="{{$data['post_url']}}" target="_blank" style="color: #b8113c;"> {{ $data['post_content']}}</a></p>
@endsection