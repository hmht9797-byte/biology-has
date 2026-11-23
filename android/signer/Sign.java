import com.android.apksig.ApkSigner;
import java.io.*;
import java.security.*;
import java.security.cert.X509Certificate;
import java.util.*;

/** Minimal apksigner: java Sign in.apk out.apk keystore.p12 pass alias */
public class Sign {
    public static void main(String[] a) throws Exception {
        KeyStore ks = KeyStore.getInstance("PKCS12");
        try (InputStream in = new FileInputStream(a[2])) { ks.load(in, a[3].toCharArray()); }
        PrivateKey key = (PrivateKey) ks.getKey(a[4], a[3].toCharArray());
        X509Certificate cert = (X509Certificate) ks.getCertificate(a[4]);
        ApkSigner.SignerConfig sc = new ApkSigner.SignerConfig.Builder("CERT", key, Collections.singletonList(cert)).build();
        new ApkSigner.Builder(Collections.singletonList(sc))
            .setInputApk(new File(a[0])).setOutputApk(new File(a[1]))
            .setV1SigningEnabled(false).setV2SigningEnabled(true).setMinSdkVersion(24)
            .build().sign();
        System.out.println("signed");
    }
}
