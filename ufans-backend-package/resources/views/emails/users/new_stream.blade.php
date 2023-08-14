@extends('emails.layout')

@section('content')
<h3>Hi {{$data['name']}},</h3>

<p>
  Don't miss out, <a href="{{Setting::get('frontend_url').'/'.$data['user']['unique_id']}}" target="_blank" style="color: #b8113c;">{{$data['user']['name']}}<a>
  &nbsp;is live now!
</p>
@endsection