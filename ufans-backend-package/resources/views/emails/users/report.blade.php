@extends('emails.layout')

@section('content')
<h2>Hi {{$data['name']}},</h2>

<p>{{ tr('report_tag', Setting::get('site_name')) }}</p>

<!-- Action -->
<table class="purchase" width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td colspan="2">
            <table class="purchase_content" width="100%" cellpadding="0" cellspacing="0">

                <tr>
                    <th width="100%" class="purchase_item"><span class="f-fallback">{{$data['message']}}</span></th>
                </tr>

            </table>
        </td>
        
    </tr>
    <tr>
        <td colspan="2">
            <table class="purchase_content" width="100%" cellpadding="0" cellspacing="0">

                <tr>
                    <td width="80%" class="purchase_item"><span class="f-fallback">{{tr('total_posts')}}</span></td>
                    <td class="align-right" width="20%" class="purchase_item"><span class="f-fallback">{{$data['main']['posts']}}</span></td>
                </tr>

                <tr>
                    <td width="80%" class="purchase_item"><span class="f-fallback">{{tr('total_tips')}}</span></td>
                    <td class="align-right" width="20%" class="purchase_item"><span class="f-fallback">{{$data['main']['tip_payment']}}</span></td>
                </tr>

                <tr>
                    <td width="80%" class="purchase_item"><span class="f-fallback">{{tr('post_payments')}}</span></td>
                    <td class="align-right" width="20%" class="purchase_item"><span class="f-fallback">{{$data['main']['post_payment']}}</span></td>
                </tr>

                <tr>
                    <td width="80%" class="purchase_item"><span class="f-fallback">{{tr('subscription_payments')}}</span></td>
                    <td class="align-right" width="20%" class="purchase_item"><span class="f-fallback">{{$data['main']['subscription_payment']}}</span></td>
                </tr>

                <tr>
                    <td width="80%" class="purchase_item"><span class="f-fallback">{{tr('total_likes')}}</span></td>
                    <td class="align-right" width="20%" class="purchase_item"><span class="f-fallback">{{$data['main']['likes']}}</span></td>
                </tr>

                <tr>
                    <td width="80%" class="purchase_item"><span class="f-fallback">{{tr('followers')}}</span></td>
                    <td class="align-right" width="20%" class="purchase_item"><span class="f-fallback">{{$data['main']['followers']}}</span></td>
                </tr>

                <tr>
                    <td width="80%" class="purchase_item"><span class="f-fallback">{{tr('followings')}}</span></td>
                    <td class="align-right" width="20%" class="purchase_item"><span class="f-fallback">{{$data['main']['followings']}}</span></td>
                </tr>

            </table>
        </td>
    </tr>
</table>
@endsection