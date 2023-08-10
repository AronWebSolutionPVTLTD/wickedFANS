@extends('emails.layout')

@section('content')
<h2>Hi {{$data['data']['name']}},</h2>

<p>
  {{tr('regenerate_verification_code_tag')}}
</p>

<p>
  <h2>{{tr('verification_code')}}: {{$data['verification_code']}}</h2>
</p>
@endsection