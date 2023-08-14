@extends('emails.layout')

@section('content')
<h3>Congratulations!</h3>

<p>
  <a href="{{Setting::get('frontend_url').'/'.$data['user']['unique_id']}}" target="_blank" style="color: #b8113c;">{{$data['user']['name']}}<a> 
  &nbsp;has just subscribed to your Wickedfans profile.
</p>
@endsection