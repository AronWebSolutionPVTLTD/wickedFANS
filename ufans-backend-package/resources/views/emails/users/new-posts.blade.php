@extends('emails.layout')

@section('content')
<h3>Hi {{$data['name']}},</h3>

<p>There are new posts from accounts you are following:</p>
@endsection