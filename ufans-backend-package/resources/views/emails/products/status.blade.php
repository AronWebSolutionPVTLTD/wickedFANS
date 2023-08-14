@extends('emails.layout')

@section('content')
<h3>Hi {{$data['name']}},</h3>  
                        
<p>
    <b>{{tr('product_name')}} - {{$data['product_name']}}</b>
    <br>

    @if($data['status'] ==  tr('approved'))

        {{tr('above_product_approved_by_admin')}}!!

    @else

        {{tr('above_product_declined_by_admin')}}!! 
        
    @endif
</p>
@endsection