@extends('emails.layout')

@section('content')
<h2>Hi {{$data['name']}},</h2>

<p>
    {{tr('verification_code')}}: <b>{{$data['verification_code']}}</b>
</p>
@endsection