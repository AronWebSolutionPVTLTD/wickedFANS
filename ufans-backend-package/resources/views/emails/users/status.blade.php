@extends('emails.layout')

@section('content')
<h3>Hi {{$data['name']}},</h3>  

<p>
    @if($data['status'] ==  tr('approved'))
        {{tr('your_account_has_been_approved_by_admin')}}
    @else
        {{tr('your_account_has_been_declined_by_admin')}} 
    @endif
</p>
@endsection