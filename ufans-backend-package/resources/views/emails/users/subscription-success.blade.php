@extends('emails.layout')

@section('content')
<h3>Congratulations!</h3>

<p>
  You have successfully subscribed to&nbsp;
  <a href="{{Setting::get('frontend_url').'/'.$data['user']['unique_id']}}" target="_blank" style="color: #b8113c;">{{$data['user']['name']}}<a>.
</p>
@endsection