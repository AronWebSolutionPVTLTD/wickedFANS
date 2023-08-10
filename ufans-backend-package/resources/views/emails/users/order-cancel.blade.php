@extends('emails.layout')

@section('content')
<h2>Hi,</h2>  

<p>{{$data['message']}}</p>

<table class="purchase" width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td colspan="2">
            <table class="purchase_content" width="100%" cellpadding="0" cellspacing="0">

                <tr>
                    <td width="80%" class="purchase_item"><span class="f-fallback">{{tr('order_id')}}</span></td>
                    <td class="align-right" width="20%" class="purchase_item"><span class="f-fallback">{{$data['order_unique_id']}}</span></td>
                </tr>

                <tr>
                    <td width="80%" class="purchase_item"><span class="f-fallback">{{tr('refunded_amount')}}</span></td>
                    <td class="align-right" width="20%" class="purchase_item"><span class="f-fallback">{{$data['refunded_amount']}}</span></td>
                </tr>

            </table>
        </td>
    </tr>
</table>
@endsection