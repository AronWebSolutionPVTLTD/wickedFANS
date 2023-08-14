@extends('emails.layout')

@section('content')
<h3>Hi {{$data['user']['name']}},</h3>  

<p>{{$data['message']}}</p>

<table class="attributes" width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
        <td class="attributes_content">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                    <td class="attributes_item">
                        <span class="f-fallback">
                            <strong>{{tr('amount')}} :</strong> {{formatted_amount($data['order_payments']['total'] ?? 0.00)}}
                        </span>
                    </td>
                </tr>
                <tr style="padding-bottom:30px !important;">
                    <td class="attributes_item">
                        <span class="f-fallback">
                            <strong>{{tr('date')}}:</strong> {{common_date($data['order_payments']['paid_date'], $data['timezone'], 'd M Y')}}
                        </span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
<table class="purchase" width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td>
            <h3>{{$data['order_payments']['payment_id'] ?? ''}}</h3>
        </td>
        <td>
            <h3 class="align-right">{{common_date($data['order_payments']['paid_date'], $data['timezone'], 'd M Y')}}</h3>
        </td>
    </tr>
    <tr>
        <td colspan="2">
            <table class="purchase_content" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <th class="purchase_heading" align="left">
                        <p class="f-fallback">{{tr('token')}}</p>
                    </th>
                    <th class="purchase_heading" align="right">
                        <p class="f-fallback">{{tr('amount')}}</p>
                    </th>
                </tr>

                <tr>
                    <td width="80%" class="purchase_item"><span class="f-fallback">{{$data['order_payments']['token']}}</span></td>
                    <td class="align-right" width="20%" class="purchase_item"><span class="f-fallback">{{ formatted_amount($data['order_payments']['total'] ?? 0.00)}}</span></td>
                </tr>


                <tr>
                    <td width="80%" class="purchase_footer" valign="middle">
                        <p class="f-fallback purchase_total purchase_total--label">{{tr('total')}}</p>
                    </td>
                    <td width="20%" class="purchase_footer" valign="middle">
                        <p class="f-fallback purchase_total">{{ formatted_amount($data['order_payments']['total'] ?? 0.00)}}</p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
@endsection