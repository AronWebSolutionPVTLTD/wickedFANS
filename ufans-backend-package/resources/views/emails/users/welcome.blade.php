@extends('emails.layout')

@section('content')
<h3>Welcome to {{Setting::get('site_name')}}!</h3>

<p>You are almost ready to start interacting with other users.
</p>

<p>
  Please confirm your email address by clicking the link below:
</p>

<p>
  <a href="{{$data['verification_link']}}" target="_blank" style="color: #b8113c;">
    {{$data['verification_link']}}
  </a>
</p>
@endsection