@extends('emails.layout')

@section('content')
<h3>Hi {{$data['name']}},</h3>

<p>
  You can reset your password by clicking the link below:
</p>

<p>
  <a href="{{$data['url']}}" target="_blank" style="color: #b8113c;">
    {{$data['url']}}
  </a>
</p>
@endsection