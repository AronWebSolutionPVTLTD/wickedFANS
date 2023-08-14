@extends('emails.layout')

@section('content')
<h3>Hi {{$data['name']}},</h3>

<p>Your subscription to {{$data['creator']['name']}} for {{$data['price']}} TOKEN will expire in 2 days.</p>

<p>
  <a href="{{$data['renewal_link']}}" target="_blank" style="color: #b8113c;">
    Enable Renewal
  </a>
</p>
@endsection