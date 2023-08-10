@extends('emails.layout')

@section('content')
<h2>Hi {{$data['name']}},</h2>  

<p>{{$data['message']}} <a href="{{$data['post_url']}}"> {{ $data['post_content']}}</a></p>
@endsection