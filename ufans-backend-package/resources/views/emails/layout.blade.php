<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>{{Setting::get('site_name')}}</title>
    <style type="text/css" rel="stylesheet" media="all">
    /* Base ------------------------------ */
    
    @import url("https://fonts.googleapis.com/css?family=Nunito+Sans:400,700&display=swap");
    body {
      width: 100% !important;
      height: 100%;
      margin: 0;
      -webkit-text-size-adjust: none;
    }
    </style>
  </head>
  <body>
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 570px;">
            <tr>
              <td align="center">
                <div style="background-color: #b8113c;padding: 10px 0;">
                  <a href="{{Setting::get('frontend_url')}}">
                    <img src="https://wickedfans.com/admin/public/email-logo.png" width="250" height="47" />
                  </a>
                </div>
              </td>
            </tr>
            <!-- Email Body -->
            <tr>
              <td width="100%" cellpadding="0" cellspacing="0">
                <table class="email-body_inner" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-bottom: 1px solid #b8113c;">
                  <!-- Body content -->
                  <tr>
                    <td>
                      <div style="padding: 10px 15px;">
                        @yield('content')
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <table class="email-footer" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td align="center">
                      <p>©{{date('Y')}} {{Setting::get('site_name')}}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>