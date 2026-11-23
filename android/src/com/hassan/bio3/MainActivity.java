package com.hassan.bio3;

import android.app.Activity;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.Window;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/** Interactive biology booklet: shows the bundled offline web app in a WebView. */
public class MainActivity extends Activity {
    private WebView web;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        // purple status bar (API 21+), called by reflection so it compiles against old stubs
        if (Build.VERSION.SDK_INT >= 21) {
            try {
                Window w = getWindow();
                w.getClass().getMethod("setStatusBarColor", int.class).invoke(w, Color.rgb(42, 26, 85));
            } catch (Exception ignored) { }
        }
        web = new WebView(this);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);          // saves the student's progress
        s.setAllowFileAccess(true);
        s.setBuiltInZoomControls(true);        // pinch-zoom on diagrams
        s.setDisplayZoomControls(false);
        s.setSupportZoom(true);
        web.setWebViewClient(new WebViewClient());
        web.setBackgroundColor(Color.rgb(243, 241, 248));
        if (state != null) web.restoreState(state);
        else web.loadUrl("file:///android_asset/index.html");
        setContentView(web);
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }

    @Override
    public void onBackPressed() {
        if (web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }
}
