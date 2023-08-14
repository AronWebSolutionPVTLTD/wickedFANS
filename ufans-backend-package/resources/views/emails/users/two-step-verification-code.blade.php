@extends('emails.layout')

@section('content')
<h3>Hi {{$data['name']}},</h3>

<p>
    {{tr('verification_code')}}: <b>{{$data['verification_code']}}</b>
</p>
@endsection