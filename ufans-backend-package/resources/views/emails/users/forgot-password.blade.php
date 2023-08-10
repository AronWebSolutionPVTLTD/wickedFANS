@extends('emails.layout')

@section('content')
<h2>Hi {{$data['name']}},</h2>

<p>
  You can reset your password by clicking the link below:
</p>

<p>
  <a href="{{$data['url']}}" target="_blank">
    {{$data['url']}}
  </a>
</p>
@endsection