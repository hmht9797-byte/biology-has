package com.hassan.bio3;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Insets;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;
import android.window.OnBackInvokedDispatcher;

/**
 * Interactive biology booklet (3rd intermediate, Iraq) – by teacher Hassan Mujtaba Al-Taweel.
 * Shows the bundled offline web app from assets in a WebView.
 */
public class MainActivity extends Activity {
    private WebView web;
    private FrameLayout root;
    private View fullView;                       // the video while it plays full screen
    private WebChromeClient.CustomViewCallback fullCallback;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);

        // Root container: dark emerald (the app header colour, --app-top #043127) behind the status bar /
        // navigation bar, visible because Android 15+ draws edge-to-edge.
        root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(4, 49, 39));

        web = new WebView(this);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);        // keeps the student's progress
        // The page lays itself out for the phone width. Ignore the phone's font-size setting (the reader has its own
        // A+ / A- buttons) and turn off pinch / double-tap zoom, matching the page's viewport (user-scalable=no).
        s.setTextZoom(100);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setAllowFileAccess(true);          // needed to load file:///android_asset
        // The booklet lives in file:///android_asset. Everything else (phone, e-mail, Facebook, Instagram) opens in
        // the matching app instead of replacing the booklet inside the WebView (tel: would show an error page).
        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String scheme = uri.getScheme() == null ? "" : uri.getScheme().toLowerCase();
                if (scheme.equals("file") || scheme.equals("about")) return false;   // our own pages
                Intent intent;
                if (scheme.equals("tel")) intent = new Intent(Intent.ACTION_DIAL, uri);
                else if (scheme.equals("mailto")) intent = new Intent(Intent.ACTION_SENDTO, uri);
                else intent = new Intent(Intent.ACTION_VIEW, uri).addCategory(Intent.CATEGORY_BROWSABLE);
                try {
                    startActivity(intent);
                } catch (ActivityNotFoundException e) {
                    Toast.makeText(MainActivity.this, "\u0644\u0627 \u064a\u0648\u062c\u062f \u062a\u0637\u0628\u064a\u0642 \u0644\u0641\u062a\u062d \u0627\u0644\u0631\u0627\u0628\u0637", Toast.LENGTH_LONG).show();
                }
                return true;
            }
        });
        // Full screen for the chapter motion-graphics player (element requestFullscreen). Media still starts only from a tap.
        s.setMediaPlaybackRequiresUserGesture(true);
        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onShowCustomView(View view, CustomViewCallback callback) {
                if (fullView != null) { callback.onCustomViewHidden(); return; }
                fullView = view; fullCallback = callback;
                root.addView(view, new FrameLayout.LayoutParams(
                        FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));
                view.setBackgroundColor(Color.BLACK);
                web.setVisibility(View.GONE);
            }

            @Override
            public void onHideCustomView() { exitFullscreen(); }
        });
        web.setBackgroundColor(Color.rgb(239, 245, 242));   // --app-bg #eff5f2: no colour flash before the page paints
        root.addView(web, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));

        // Keep content out of the system bars and display cutouts.
        root.setOnApplyWindowInsetsListener((v, insets) -> {
            int l, t, r, b;
            if (Build.VERSION.SDK_INT >= 30) {
                Insets in = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                l = in.left; t = in.top; r = in.right; b = in.bottom;
            } else {
                l = insets.getSystemWindowInsetLeft(); t = insets.getSystemWindowInsetTop();
                r = insets.getSystemWindowInsetRight(); b = insets.getSystemWindowInsetBottom();
            }
            v.setPadding(l, t, r, b);
            return insets;
        });

        if (state != null) web.restoreState(state);
        else web.loadUrl("file:///android_asset/index.html");
        setContentView(root);

        // Back button: go back inside the booklet first (Android 13+ predictive-back API).
        if (Build.VERSION.SDK_INT >= 33) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                    OnBackInvokedDispatcher.PRIORITY_DEFAULT,
                    () -> { if (fullView != null) exitFullscreen(); else if (web.canGoBack()) web.goBack(); else finish(); });
        }
    }

    /** Leaves full-screen video and shows the booklet again. */
    private void exitFullscreen() {
        if (fullView == null) return;
        root.removeView(fullView);
        fullView = null;
        web.setVisibility(View.VISIBLE);
        if (fullCallback != null) { fullCallback.onCustomViewHidden(); fullCallback = null; }
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {   // Android 12 and older
        if (fullView != null) exitFullscreen();
        else if (web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }
}
