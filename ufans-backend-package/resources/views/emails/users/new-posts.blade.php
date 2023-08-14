@extends('emails.layout')

@section('content')
<h2>Hi {{$data['name']}},</h2>

<p>There are new posts from accounts you are following:</p>
@endsection